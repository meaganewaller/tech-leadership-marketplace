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
- `CATALOG.md` -- human-readable index of every plugin and skill, kept in
  sync with `.claude-plugin/marketplace.json` by hand.

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
