import { describe, expect, test } from "bun:test";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

/**
 * SKILL.md is the single source every tool adapter reads. Its frontmatter is
 * not decoration: Claude, Copilot, Gemini, and Codex all key off `name` and
 * `description` to decide whether a skill fires at all. A skill whose `name`
 * disagrees with its directory, or whose frontmatter fails to parse, installs
 * cleanly everywhere and then never triggers -- a failure that shows up as
 * "the assistant ignored me" rather than as an error.
 *
 * The reference check guards the other half. AGENTS.md asks that SKILL.md
 * bodies stay lean and push detail into `references/`, pointing at it
 * explicitly. A pointer at a file that does not exist sends the agent looking
 * for instructions that are not there.
 */

/** AGENTS.md: descriptions should name specific trigger phrases, not a
 * category. A bare category name fits in far less than this; the threshold is
 * a floor against one-liners, not a style judgment. */
const MIN_DESCRIPTION_LENGTH = 60;

type Skill = {
  plugin: string;
  name: string;
  dir: string;
  body: string;
  frontmatter: Record<string, unknown>;
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const pluginNames = (await readdir("plugins", { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const skillDirs: { plugin: string; name: string; dir: string }[] = [];
for (const plugin of pluginNames) {
  const skillsRoot = join("plugins", plugin, "skills");
  let entries: string[];
  try {
    entries = (await readdir(skillsRoot, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch {
    continue;
  }
  for (const name of entries.sort()) {
    skillDirs.push({ plugin, name, dir: join(skillsRoot, name) });
  }
}

test("the repository contains skills to check", () => {
  expect(skillDirs.length).toBeGreaterThan(0);
});

describe("every skill directory ships a SKILL.md", () => {
  test.each(skillDirs.map((s) => [`${s.plugin}/${s.name}`, s.dir] as const))(
    "%s has SKILL.md",
    async (_label, dir) => {
      const info = await stat(join(dir, "SKILL.md"));
      expect(info.isFile()).toBe(true);
      expect(info.size).toBeGreaterThan(0);
    },
  );
});

// Parsed once, after the existence check above has a chance to report a
// missing file as a clean failure rather than a module-load crash.
const skills: Skill[] = [];
for (const entry of skillDirs) {
  const raw = await readFile(join(entry.dir, "SKILL.md"), "utf8").catch(
    () => "",
  );
  const match = raw.match(FRONTMATTER);
  let frontmatter: Record<string, unknown> = {};
  if (match?.[1]) {
    try {
      frontmatter = (Bun.YAML.parse(match[1]) ?? {}) as Record<string, unknown>;
    } catch {
      frontmatter = {};
    }
  }
  skills.push({
    ...entry,
    body: match ? raw.slice(match[0].length) : raw,
    frontmatter,
  });
}

describe("frontmatter is present and usable", () => {
  test.each(skills.map((s) => [`${s.plugin}/${s.name}`] as const))(
    "%s opens with parseable YAML frontmatter",
    (label) => {
      const skill = skills.find((s) => `${s.plugin}/${s.name}` === label);
      expect(Object.keys(skill?.frontmatter ?? {}).length).toBeGreaterThan(0);
    },
  );

  test.each(skills.map((s) => [`${s.plugin}/${s.name}`] as const))(
    "%s declares a name matching its directory",
    (label) => {
      const skill = skills.find((s) => `${s.plugin}/${s.name}` === label);
      expect(skill?.frontmatter.name).toBe(skill?.name);
    },
  );

  test.each(skills.map((s) => [`${s.plugin}/${s.name}`] as const))(
    "%s declares a description specific enough to trigger on",
    (label) => {
      const skill = skills.find((s) => `${s.plugin}/${s.name}` === label);
      const description = skill?.frontmatter.description;
      expect(typeof description).toBe("string");
      expect((description as string).trim().length).toBeGreaterThanOrEqual(
        MIN_DESCRIPTION_LENGTH,
      );
    },
  );
});

describe("references cited in a body exist on disk", () => {
  test.each(skills.map((s) => [`${s.plugin}/${s.name}`] as const))(
    "%s cites only reference files that exist",
    async (label) => {
      const skill = skills.find((s) => `${s.plugin}/${s.name}` === label);
      if (!skill) throw new Error(`no skill for ${label}`);

      const cited = new Set(
        [...skill.body.matchAll(/(?<![\w/.-])references\/[\w.-]+/g)].map(
          (m) => m[0],
        ),
      );

      const missing: string[] = [];
      for (const path of cited) {
        const exists = await stat(join(skill.dir, path))
          .then(() => true)
          .catch(() => false);
        if (!exists) missing.push(path);
      }
      expect(missing).toEqual([]);
    },
  );
});

const catalog = await readFile("CATALOG.md", "utf8");

/** Rows of the plugin table, as arrays of trimmed cells. */
const catalogRows = catalog
  .split("\n")
  .filter((line) => line.trimStart().startsWith("|"))
  .map((line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim()),
  )
  .filter((cells) => cells.length >= 3 && !/^-+$/.test(cells[0] ?? ""));

const rowFor = (plugin: string) =>
  catalogRows.find((cells) => cells[0] === `\`${plugin}\``);

describe("CATALOG.md stays in step with the plugins", () => {
  test.each(pluginNames.map((p) => [p] as const))(
    "%s has a row in CATALOG.md",
    (plugin) => {
      expect(rowFor(plugin)).toBeDefined();
    },
  );

  test.each(pluginNames.map((p) => [p] as const))(
    "%s row names every skill the plugin ships",
    (plugin) => {
      const row = rowFor(plugin);
      const listed = row?.join(" | ") ?? "";
      const owned = skills
        .filter((s) => s.plugin === plugin)
        .map((s) => s.name);
      expect(owned.filter((name) => !listed.includes(name))).toEqual([]);
    },
  );
});
