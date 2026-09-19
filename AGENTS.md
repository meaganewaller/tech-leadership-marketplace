# tech-leadership marketplace

This repository is a source tree for AI-agent plugins/skills aimed
specifically at the tech-lead side of engineering -- 1:1s, delegation, tech
debt prioritization, incident/postmortem writing, stakeholder
communication, design doc review. General-purpose engineering tools (code
review, debugging) belong in a separate general marketplace, not here.

This file is for an agent working *on this repository itself* (adding a
plugin, fixing an adapter script) -- it is not one of the distributed
skills. Codex CLI and other AGENTS.md-native tools will read this
automatically when a session is rooted here.

## Layout

- `plugins/<name>/` -- one plugin. Contains `.claude-plugin/plugin.json`
  (Claude's native manifest) and `skills/<skill-name>/SKILL.md` per skill.
  This is the canonical, single-source content every tool adapter reads
  from -- never duplicate a skill's prose elsewhere in this repo.
- `.claude-plugin/marketplace.json` -- the catalog Claude reads to list and
  install plugins from this repo.
- `adapters/<tool>/` -- one directory per supported tool (`claude`,
  `copilot`, `gemini`, `codex`), each with a README and, for the three
  non-Claude tools, an `install.sh` that copies or repackages
  `plugins/*/skills/*/` into that tool's expected location. Claude needs no
  script since `plugins/` already is its native format.
- `CATALOG.md` -- human-readable index of every plugin and skill. Rows are
  added by hand; versions deliberately do not appear there (see "Releases").
- `release-please-config.json` / `.release-please-manifest.json` -- one
  release package per installable plugin. See "Releases".

## Conventions when adding or editing a plugin

- Write skill content once, under `plugins/<plugin>/skills/<skill>/SKILL.md`.
  Never write tool-specific copies into this repo by hand -- that's what the
  adapter scripts are for, generated at install time.
- Frontmatter `description` fields should be a little "pushy" about when to
  trigger (specific phrases, not just a category name) -- all four tools
  under-trigger skills more often than they over-trigger.
- Keep each `SKILL.md` body lean; put detail in `references/` and point to
  it explicitly from the body (see `plugins/_template-plugin` for the
  pattern).
- After adding or changing a plugin: update `.claude-plugin/marketplace.json`
  and `CATALOG.md`, then run the relevant `adapters/*/install.sh` against a
  scratch target to confirm it still adapts cleanly to all four tools.
- Never hand-edit a `version` field in `plugin.json` or
  `marketplace.json` -- release-please owns both. A hand-edit will be
  overwritten by the next release PR, or worse, silently disagree with the
  git tag.
- The `_template-plugin` directory is scaffolding, not real content --
  copy it, don't edit it in place, and don't remove it (it's what proves
  the adapters still work after a change to this repo's structure).

## Build/test commands

There is no build step for the content itself (it's Markdown + JSON). To
validate:

```bash
# JSON validity
jq . .claude-plugin/marketplace.json
for f in plugins/*/.claude-plugin/plugin.json; do jq . "$f" > /dev/null; done

# Every skill has a SKILL.md
find plugins -mindepth 3 -maxdepth 3 -type d -path '*/skills/*' \
  -exec test -f '{}/SKILL.md' \; -print

# Exercise each adapter against a scratch directory
adapters/copilot/install.sh /tmp/scratch-repo
adapters/codex/install.sh --personal
adapters/gemini/install.sh <plugin-name>
```

## Releases

Releases are driven by release-please in manifest mode, one package per
installable plugin, from `.github/workflows/release.yml` on push to `main`.

This repository allows squash merges only, with
`squash_merge_commit_title` set to `PR_TITLE`. The pull request title --
not the individual commit messages -- is therefore the subject that lands
on `main`, and it is the only string release-please reads. A `feat:`/`fix:`
title on a pull request touching `plugins/<name>/**` opens (or updates) a
release PR for that plugin. Merging that PR tags `<name>-vX.Y.Z`, writes
`plugins/<name>/CHANGELOG.md`, and bumps the version in both
`plugins/<name>/.claude-plugin/plugin.json` and the plugin's entry in the
root `.claude-plugin/marketplace.json`.

Individual commits must still be conventional -- CI lints every one of
them, and they become the squash commit's body -- but the title is what
decides the release.

Notes an agent working here should know:

- **Only installable plugins are release packages.** `_template-plugin` is
  deliberately excluded -- it's scaffolding nobody installs, so it gets no
  tags and no changelog.
- **Root-level changes cut no release.** Commits touching only `README.md`,
  `AGENTS.md`, `CATALOG.md`, or `adapters/` map to no package. That's
  correct; those aren't versioned, distributed content.
- **Versions never appear in `CATALOG.md`.** release-please's generic
  file updater matches `x-release-please-version` with no way to scope an
  annotation to a component, and it writes one version to *every* annotated
  line in a file. The moment a second plugin listed `CATALOG.md` as an
  extra-file, each plugin's release PR would silently stamp its own version
  over the other plugin's row. Keeping versions out of `CATALOG.md`
  sidesteps this entirely -- don't "helpfully" add them back.
- **Keep a pull request scoped to one plugin.** Squashing collapses the
  branch into one subject with one type, and release-please applies that
  type to every path the diff touched. A `feat(plugin-a):` pull request
  that also edits `plugin-b` minor-bumps both and writes plugin-a's
  message into plugin-b's changelog. Split the work instead.
- **While a plugin is below 1.0.0**, a `feat!:` breaking change goes
  straight to `1.0.0` (release-please's default). Set
  `bump-minor-pre-major: true` on that package to stay in `0.x` instead.

To add a new plugin to releases, add a package to
`release-please-config.json` -- copying the `one-on-one-prep` block and
replacing the component name in both the `component` field and the
`marketplace.json` jsonpath filter -- and add a matching
`"plugins/<name>": "<current version>"` entry to
`.release-please-manifest.json`.
