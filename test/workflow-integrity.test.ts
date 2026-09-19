import { describe, expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * These checks assert against the *parsed* workflow rather than its raw text.
 * The difference is not cosmetic: a workflow that ran nothing -- every asserted
 * string moved into a leading comment, `if: false` on the only job -- would
 * satisfy any substring match, because comments and structure are
 * indistinguishable to `toContain`.
 *
 * The release permissions are asserted because their absence has already cost
 * a broken run here. Release-please needs `pull-requests: write` to open its
 * release pull request; a repository's default `GITHUB_TOKEN` is read-only, so
 * the grant in the workflow is the only thing supplying it. Drop it and
 * releases stop, silently, with main still green.
 */

const WORKFLOW_DIR = ".github/workflows";

type Step = { uses?: string; run?: string; if?: string };
type Job = { steps?: Step[]; permissions?: unknown; if?: string };
type Workflow = {
  on?: {
    pull_request?: { types?: string[]; branches?: string[] };
    push?: { branches?: string[] };
  };
  concurrency?: { group?: string; "cancel-in-progress"?: unknown };
  permissions?: Record<string, string>;
  jobs?: Record<string, Job>;
};

const load = async (file: string): Promise<Workflow> => {
  const raw = await readFile(join(WORKFLOW_DIR, file), "utf8");
  return Bun.YAML.parse(raw) as Workflow;
};

/**
 * `on:` is the YAML 1.1 boolean `true`. Bun's parser follows YAML 1.2 and
 * keeps it a string, but reading both costs one line and removes the question.
 */
const triggers = (wf: Workflow) =>
  (wf.on ??
    (wf as unknown as Record<string, unknown>).true ??
    {}) as NonNullable<Workflow["on"]>;

const workflowFiles = (await readdir(WORKFLOW_DIR)).filter((f) =>
  /\.ya?ml$/.test(f),
);

const ci = await load("ci.yml");
const release = await load("release.yml");

test("both workflows are present", () => {
  expect(workflowFiles.sort()).toEqual(["ci.yml", "release.yml"]);
});

describe("release.yml can still cut a release", () => {
  test("grants the permissions release-please needs", () => {
    // contents: write tags and commits; pull-requests: write opens the release
    // PR; issues: write is what the action uses to label it.
    expect(release.permissions?.contents).toBe("write");
    expect(release.permissions?.["pull-requests"]).toBe("write");
    expect(release.permissions?.issues).toBe("write");
  });

  test("runs on push to main", () => {
    expect(triggers(release).push?.branches).toContain("main");
  });

  test("actually invokes release-please", () => {
    const uses = Object.values(release.jobs ?? {})
      .flatMap((job) => job.steps ?? [])
      .map((step) => step.uses ?? "");
    expect(
      uses.some((u) =>
        u.startsWith("google-github-actions/release-please-action@"),
      ),
    ).toBe(true);
  });

  test("no job is disabled", () => {
    for (const job of Object.values(release.jobs ?? {})) {
      expect(job.if).toBeUndefined();
    }
  });
});

describe("ci.yml gates the right events", () => {
  test("runs on pull requests targeting main", () => {
    expect(triggers(ci).pull_request?.branches).toContain("main");
  });

  /**
   * Squash-merge puts the pull request title on main, and release-please reads
   * it. Without `edited`, a title can be changed to `chore:` after a green
   * check and suppress a release that should have shipped.
   */
  test("re-runs when a pull request title is edited", () => {
    expect(triggers(ci).pull_request?.types).toContain("edited");
  });

  test("runs on push to main", () => {
    expect(triggers(ci).push?.branches).toContain("main");
  });

  test("cancels superseded pull request runs only", () => {
    expect(ci.concurrency?.group).toContain("github.ref");
    expect(String(ci.concurrency?.["cancel-in-progress"])).toContain(
      "pull_request",
    );
  });

  test("requests no more than read access", () => {
    expect(ci.permissions).toEqual({ contents: "read" });
  });
});

describe("ci.yml runs the checks it claims to", () => {
  const runSteps = Object.values(ci.jobs ?? {})
    .flatMap((job) => job.steps ?? [])
    .map((step) => step.run ?? "");

  test("installs dependencies from the lockfile", () => {
    expect(runSteps.some((r) => r.includes("--frozen-lockfile"))).toBe(true);
  });

  test("runs the linters", () => {
    expect(runSteps.some((r) => r.trim() === "bun run lint")).toBe(true);
  });

  test("runs the test suite", () => {
    expect(runSteps.some((r) => r.trim() === "bun test")).toBe(true);
  });

  test("lints commit messages", () => {
    expect(runSteps.some((r) => r.includes("commitlint"))).toBe(true);
  });

  /**
   * A test failure must not be hidden by an earlier lint failure, but must
   * stay skipped when the install never succeeded.
   */
  test("the test step still runs after a lint failure", () => {
    const testStep = Object.values(ci.jobs ?? {})
      .flatMap((job) => job.steps ?? [])
      .find((step) => step.run?.trim() === "bun test");
    expect(testStep?.if).toContain("cancelled()");
    expect(testStep?.if).toContain("steps.install.outcome");
  });
});

/**
 * A tag can be moved to point at different code after review; a commit SHA
 * cannot. Scope is ci.yml alone -- release.yml deliberately tracks
 * release-please-action@v4, which is a separate decision recorded in the spec.
 */
describe("ci.yml pins its actions by commit SHA", () => {
  const uses = Object.values(ci.jobs ?? {})
    .flatMap((job) => job.steps ?? [])
    .map((step) => step.uses)
    .filter((u): u is string => !!u);

  test("every step that uses an action is pinned", () => {
    expect(uses.length).toBeGreaterThan(0);
    const unpinned = uses.filter((u) => !/@[0-9a-f]{40}$/.test(u));
    expect(unpinned).toEqual([]);
  });
});
