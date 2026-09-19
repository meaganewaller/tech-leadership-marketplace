import { describe, expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * A plugin's version and description are written twice: once in
 * `.claude-plugin/marketplace.json`, which is what people browse before
 * installing, and once in the plugin's own `plugin.json`, which is what they
 * get after. Nothing in git keeps the two equal. The sibling marketplace
 * repository drifted exactly this way -- eight of nine entries sat frozen at
 * 1.0.0 while the plugins moved on, so the catalog advertised versions that
 * were simply wrong.
 *
 * Release-please is what keeps them equal here, and only for plugins actually
 * registered with it. Registering one is a hand step documented in AGENTS.md,
 * which is the kind of step that gets skipped. These tests assert both halves:
 * the files agree today, and the machinery that keeps them agreeing is wired
 * up for every plugin that ships.
 */

const MARKETPLACE_PATH = ".claude-plugin/marketplace.json";
const DO_NOT_INSTALL = "do-not-install";

type PluginEntry = {
  name: string;
  description: string;
  version: string;
  source: string;
  tags?: string[];
};

type ExtraFile = { type?: string; path?: string; jsonpath?: string };
type ReleasePackage = { component?: string; "extra-files"?: ExtraFile[] };

const marketplace = JSON.parse(await readFile(MARKETPLACE_PATH, "utf8"));
const releaseConfig = JSON.parse(
  await readFile("release-please-config.json", "utf8"),
);
const releaseManifest: Record<string, string> = JSON.parse(
  await readFile(".release-please-manifest.json", "utf8"),
);

const published: PluginEntry[] = marketplace.plugins;
const hasTag = (entry: PluginEntry, tag: string) =>
  (entry.tags ?? []).includes(tag);

/** Plugins a user can actually install -- the ones a release applies to. */
const installable = published.filter((p) => !hasTag(p, DO_NOT_INSTALL));

const packages = Object.entries<ReleasePackage>(releaseConfig.packages);
const packageFor = (name: string) =>
  packages.find(([, p]) => p.component === name)?.[1];

const pluginManifest = (name: string) =>
  readFile(join("plugins", name, ".claude-plugin", "plugin.json"), "utf8").then(
    JSON.parse,
  );

test("the marketplace lists at least one plugin", () => {
  // Guards every test.each below: an empty list would make them all vacuous.
  expect(published.length).toBeGreaterThan(0);
  expect(installable.length).toBeGreaterThan(0);
});

describe("marketplace.json agrees with each plugin.json", () => {
  test.each(published.map((p) => [p.name] as const))(
    "%s advertises the version it actually ships",
    async (name) => {
      const manifest = await pluginManifest(name);
      expect(published.find((p) => p.name === name)?.version).toBe(
        manifest.version,
      );
    },
  );

  /**
   * Version was not the only field that drifted next door. Nothing syncs
   * `description` either, and whichever file someone edits, the browse text
   * and the installed text have to still say the same thing.
   */
  test.each(published.map((p) => [p.name] as const))(
    "%s describes itself the same way in both files",
    async (name) => {
      const manifest = await pluginManifest(name);
      expect(published.find((p) => p.name === name)?.description).toBe(
        manifest.description,
      );
    },
  );

  test.each(published.map((p) => [p.name, p.source] as const))(
    "%s source path resolves to a real plugin",
    async (name, source) => {
      expect(source).toBe(`./plugins/${name}`);
      const manifest = await pluginManifest(name);
      expect(manifest.name).toBe(name);
    },
  );
});

describe("marketplace.json and plugins/ cover each other", () => {
  test("every plugin directory is listed in marketplace.json", async () => {
    const onDisk = (await readdir("plugins", { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    const listed = new Set(published.map((p) => p.name));
    expect(onDisk.filter((n) => !listed.has(n))).toEqual([]);
  });

  test("no marketplace.json entry points at a missing directory", async () => {
    const onDisk = new Set(
      (await readdir("plugins", { withFileTypes: true }))
        .filter((e) => e.isDirectory())
        .map((e) => e.name),
    );
    expect(published.map((p) => p.name).filter((n) => !onDisk.has(n))).toEqual(
      [],
    );
  });
});

describe("release-please is wired up for everything that ships", () => {
  test("every installable plugin has a release-please package", () => {
    const components = new Set(packages.map(([, p]) => p.component));
    expect(
      installable.map((p) => p.name).filter((n) => !components.has(n)),
    ).toEqual([]);
  });

  test("no release-please package points at a plugin that was removed", () => {
    const names = new Set(published.map((p) => p.name));
    expect(
      packages
        .map(([, p]) => p.component)
        .filter((c): c is string => !!c && !names.has(c)),
    ).toEqual([]);
  });

  /**
   * The template is deliberately excluded: it is scaffolding nobody installs,
   * so tagging it for release would publish tags and a changelog for nothing.
   * Asserted explicitly so a later reader does not "fix" the omission.
   */
  test("plugins tagged do-not-install are NOT release packages", () => {
    const components = new Set(packages.map(([, p]) => p.component));
    const wronglyRegistered = published
      .filter((p) => hasTag(p, DO_NOT_INSTALL))
      .map((p) => p.name)
      .filter((n) => components.has(n));
    expect(wronglyRegistered).toEqual([]);
  });

  test.each(installable.map((p) => [p.name] as const))(
    "%s rewrites its own plugin.json on release",
    (name) => {
      const own = packageFor(name)?.["extra-files"]?.find(
        (f) => f.path === ".claude-plugin/plugin.json",
      );
      expect(own?.type).toBe("json");
      expect(own?.jsonpath).toBe("$.version");
    },
  );

  test.each(installable.map((p) => [p.name] as const))(
    "%s updates its marketplace.json entry on release",
    (name) => {
      const extra = packageFor(name)?.["extra-files"]?.find(
        (f) => f.path === `/${MARKETPLACE_PATH}`,
      );

      expect(extra).toBeDefined();
      // A leading slash is repo-root-relative; release-please rejects "../".
      expect(extra?.path?.startsWith("/")).toBe(true);
      expect(extra?.type).toBe("json");
      // The filter selects this plugin's entry by name rather than by array
      // index, so reordering marketplace.json cannot redirect the update.
      expect(extra?.jsonpath).toBe(`$.plugins[?(@.name=='${name}')].version`);
    },
  );

  /**
   * CATALOG.md deliberately carries no version numbers. Release-please's
   * generic updater matches `x-release-please-version` with no way to scope an
   * annotation to a component, and writes one version to every annotated line
   * in a file -- so the moment a second plugin listed CATALOG.md as an
   * extra-file, each release would stamp its version over the other's row.
   */
  test("no package treats CATALOG.md as an extra-file", () => {
    const offenders = packages
      .filter(([, p]) =>
        p["extra-files"]?.some((f) => f.path?.endsWith("CATALOG.md")),
      )
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });
});

describe("the release manifest tracks the config", () => {
  test("manifest keys and config package keys are the same set", () => {
    expect(Object.keys(releaseManifest).sort()).toEqual(
      packages.map(([path]) => path).sort(),
    );
  });

  test.each(installable.map((p) => [p.name] as const))(
    "%s manifest version matches its plugin.json",
    async (name) => {
      const manifest = await pluginManifest(name);
      expect(releaseManifest[`plugins/${name}`]).toBe(manifest.version);
    },
  );
});
