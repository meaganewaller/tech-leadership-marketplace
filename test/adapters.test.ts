import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * The adapters are the only executable code in this repository, and until now
 * they were exercised only by hand against a scratch directory, when someone
 * remembered. These tests run the real scripts and assert on the file tree
 * they produce, rather than reading them for plausibility.
 *
 * The `do-not-install` cases are here because the contract was documented and
 * not implemented: both the copilot and codex adapters used to hardcode
 * `_template-plugin`, so the tag in marketplace.json meant nothing and a
 * second non-installable plugin would have shipped to users. The tests below
 * are written against the tag rather than against the template's name, so
 * they keep covering the contract as plugins come and go.
 *
 * Every spawn gets an overridden HOME. The codex adapter's `--personal` mode
 * writes to `$HOME/.codex/skills`, and a test that trusted the real HOME would
 * quietly overwrite the developer's own installed skills.
 */

const MARKETPLACE_PATH = ".claude-plugin/marketplace.json";
const DO_NOT_INSTALL = "do-not-install";

type PluginEntry = { name: string; tags?: string[] };

const marketplace = JSON.parse(await readFile(MARKETPLACE_PATH, "utf8"));
const published: PluginEntry[] = marketplace.plugins;
const tagged = (tag: string) =>
  published.filter((p) => (p.tags ?? []).includes(tag)).map((p) => p.name);

const excludedPlugins = tagged(DO_NOT_INSTALL);
const installablePlugins = published
  .map((p) => p.name)
  .filter((n) => !excludedPlugins.includes(n));

const skillsOf = async (plugin: string) => {
  try {
    return (
      await readdir(join("plugins", plugin, "skills"), {
        withFileTypes: true,
      })
    )
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
};

const ADAPTERS = [
  "adapters/lib/marketplace.sh",
  "adapters/codex/install.sh",
  "adapters/copilot/install.sh",
  "adapters/gemini/install.sh",
];

type Result = { code: number; stdout: string; stderr: string };

let sandbox = "";

/** Runs a script with HOME pointed somewhere disposable. */
async function run(
  argv: string[],
  env: Record<string, string> = {},
): Promise<Result> {
  const home = await mkdtemp(join(sandbox, "home-"));
  const proc = Bun.spawn(argv, {
    cwd: process.cwd(),
    env: { ...process.env, HOME: home, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  return { code: await proc.exited, stdout, stderr };
}

const dirNames = async (path: string) => {
  try {
    return (await readdir(path, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
};

const newRepo = () => mkdtemp(join(sandbox, "repo-"));

beforeAll(async () => {
  sandbox = await mkdtemp(join(tmpdir(), "tlm-adapters-"));
});

afterAll(async () => {
  if (sandbox) await rm(sandbox, { recursive: true, force: true });
});

test("the marketplace tags at least one plugin do-not-install", () => {
  // Without this the exclusion tests below would pass vacuously.
  expect(excludedPlugins.length).toBeGreaterThan(0);
  expect(installablePlugins.length).toBeGreaterThan(0);
});

describe("every adapter is a runnable bash script", () => {
  test.each(ADAPTERS.map((a) => [a] as const))("%s parses", async (path) => {
    const { code, stderr } = await run(["bash", "-n", path]);
    expect(stderr).toBe("");
    expect(code).toBe(0);
  });

  test.each(ADAPTERS.map((a) => [a] as const))(
    "%s is executable",
    async (path) => {
      const info = await stat(path);
      expect(info.mode & 0o111).toBeGreaterThan(0);
    },
  );
});

describe("copilot adapter", () => {
  test("installs every skill of every installable plugin", async () => {
    const repo = await newRepo();
    const { code } = await run(["adapters/copilot/install.sh", repo]);
    expect(code).toBe(0);

    const expected: string[] = [];
    for (const plugin of installablePlugins) {
      expected.push(...(await skillsOf(plugin)));
    }
    expect(await dirNames(join(repo, ".github/skills"))).toEqual(
      expected.sort(),
    );
  });

  test("writes a SKILL.md for each installed skill", async () => {
    const repo = await newRepo();
    await run(["adapters/copilot/install.sh", repo]);
    const installed = await dirNames(join(repo, ".github/skills"));
    for (const skill of installed) {
      const info = await stat(join(repo, ".github/skills", skill, "SKILL.md"));
      expect(info.isFile()).toBe(true);
    }
  });

  test("excludes plugins tagged do-not-install", async () => {
    const repo = await newRepo();
    await run(["adapters/copilot/install.sh", repo]);
    const installed = new Set(await dirNames(join(repo, ".github/skills")));

    for (const plugin of excludedPlugins) {
      for (const skill of await skillsOf(plugin)) {
        expect(installed.has(skill)).toBe(false);
      }
    }
  });

  test("installs an excluded plugin when it is named explicitly", async () => {
    const plugin = excludedPlugins[0];
    if (!plugin) throw new Error("no do-not-install plugin to test with");

    const repo = await newRepo();
    const { code } = await run(["adapters/copilot/install.sh", repo, plugin]);
    expect(code).toBe(0);

    const installed = new Set(await dirNames(join(repo, ".github/skills")));
    for (const skill of await skillsOf(plugin)) {
      expect(installed.has(skill)).toBe(true);
    }
  });

  test("is idempotent", async () => {
    const repo = await newRepo();
    await run(["adapters/copilot/install.sh", repo]);
    const first = await dirNames(join(repo, ".github/skills"));
    await run(["adapters/copilot/install.sh", repo]);
    expect(await dirNames(join(repo, ".github/skills"))).toEqual(first);
  });

  test("exits non-zero with usage when given no target", async () => {
    const { code, stderr } = await run(["adapters/copilot/install.sh"]);
    expect(code).not.toBe(0);
    expect(stderr).toContain("Usage");
  });

  test("exits non-zero when the target does not exist", async () => {
    const { code, stderr } = await run([
      "adapters/copilot/install.sh",
      join(sandbox, "definitely-not-here"),
    ]);
    expect(code).not.toBe(0);
    expect(stderr).toContain("does not exist");
  });
});

describe("codex adapter", () => {
  test("--repo installs into .agents/skills", async () => {
    const repo = await newRepo();
    const { code } = await run(["adapters/codex/install.sh", "--repo", repo]);
    expect(code).toBe(0);

    const expected: string[] = [];
    for (const plugin of installablePlugins) {
      expected.push(...(await skillsOf(plugin)));
    }
    expect(await dirNames(join(repo, ".agents/skills"))).toEqual(
      expected.sort(),
    );
  });

  /**
   * The point of the HOME override: this asserts the adapter honors it, which
   * is also what keeps the rest of the suite from writing to a real ~/.codex.
   */
  test("--personal installs under HOME, not the real home directory", async () => {
    const home = await mkdtemp(join(sandbox, "home-personal-"));
    const { code } = await run(["adapters/codex/install.sh", "--personal"], {
      HOME: home,
    });
    expect(code).toBe(0);

    const expected: string[] = [];
    for (const plugin of installablePlugins) {
      expected.push(...(await skillsOf(plugin)));
    }
    expect(await dirNames(join(home, ".codex/skills"))).toEqual(
      expected.sort(),
    );
  });

  test("excludes plugins tagged do-not-install", async () => {
    const repo = await newRepo();
    await run(["adapters/codex/install.sh", "--repo", repo]);
    const installed = new Set(await dirNames(join(repo, ".agents/skills")));

    for (const plugin of excludedPlugins) {
      for (const skill of await skillsOf(plugin)) {
        expect(installed.has(skill)).toBe(false);
      }
    }
  });

  test("installs an excluded plugin when it is named explicitly", async () => {
    const plugin = excludedPlugins[0];
    if (!plugin) throw new Error("no do-not-install plugin to test with");

    const repo = await newRepo();
    const { code } = await run([
      "adapters/codex/install.sh",
      "--repo",
      repo,
      plugin,
    ]);
    expect(code).toBe(0);

    const installed = new Set(await dirNames(join(repo, ".agents/skills")));
    for (const skill of await skillsOf(plugin)) {
      expect(installed.has(skill)).toBe(true);
    }
  });

  test("exits non-zero with usage when given no mode", async () => {
    const { code, stderr } = await run(["adapters/codex/install.sh"]);
    expect(code).not.toBe(0);
    expect(stderr).toContain("Usage");
  });

  test("exits non-zero when --repo target does not exist", async () => {
    const { code, stderr } = await run([
      "adapters/codex/install.sh",
      "--repo",
      join(sandbox, "definitely-not-here"),
    ]);
    expect(code).not.toBe(0);
    expect(stderr).toContain("existing repo path");
  });
});

describe("gemini adapter", () => {
  test.each(installablePlugins.map((p) => [p] as const))(
    "%s builds an extension whose manifest matches plugin.json",
    async (plugin) => {
      const out = join(await mkdtemp(join(sandbox, "gemini-")), plugin);
      const { code } = await run(["adapters/gemini/install.sh", plugin, out]);
      expect(code).toBe(0);

      const manifest = JSON.parse(
        await readFile(join(out, "gemini-extension.json"), "utf8"),
      );
      const pluginJson = JSON.parse(
        await readFile(
          join("plugins", plugin, ".claude-plugin", "plugin.json"),
          "utf8",
        ),
      );

      expect(manifest.name).toBe(pluginJson.name);
      expect(manifest.version).toBe(pluginJson.version);
      expect(manifest.description).toBe(pluginJson.description);
      expect(await dirNames(join(out, "skills"))).toEqual(
        await skillsOf(plugin),
      );
    },
  );

  test("exits non-zero with usage when given no plugin name", async () => {
    const { code, stderr } = await run(["adapters/gemini/install.sh"]);
    expect(code).not.toBe(0);
    expect(stderr).toContain("Usage");
  });

  test("exits non-zero for a plugin that does not exist", async () => {
    const out = join(sandbox, "gemini-missing");
    const { code, stderr } = await run([
      "adapters/gemini/install.sh",
      "no-such-plugin",
      out,
    ]);
    expect(code).not.toBe(0);
    expect(stderr).toContain("no plugin.json");
  });

  test("rebuilding replaces the previous output rather than merging", async () => {
    const plugin = installablePlugins[0];
    if (!plugin) throw new Error("no installable plugin to test with");

    const out = join(await mkdtemp(join(sandbox, "gemini-rebuild-")), plugin);
    await run(["adapters/gemini/install.sh", plugin, out]);
    await Bun.write(join(out, "skills", "stale-skill", "SKILL.md"), "stale\n");
    await run(["adapters/gemini/install.sh", plugin, out]);

    expect(await dirNames(join(out, "skills"))).toEqual(await skillsOf(plugin));
  });
});
