# _template-plugin (TEMPLATE -- not a real plugin)

Copy this directory to start a new tech-leadership plugin.

## Layout

```text
_template-plugin/
├── .claude-plugin/plugin.json   -- Claude plugin manifest (name, version, description, author)
├── README.md                    -- this file; replace with the plugin's own README
└── skills/
    └── _template-skill/
        ├── SKILL.md              -- the canonical, tool-agnostic skill content
        └── references/
            └── example.md        -- bundled reference file, loaded on demand
```

## Why the skill lives here, once

`skills/<name>/SKILL.md` (frontmatter `name` + `description`, then Markdown
instructions) is the one format Claude, GitHub Copilot, Gemini CLI, and
OpenAI Codex CLI all read natively today. This directory is the single
source of truth for a plugin's content -- see `adapters/` at the marketplace
root for how each tool is pointed at it without copying the prose by hand.

## Steps to create a real plugin from this template

1. `cp -R plugins/_template-plugin plugins/<your-plugin-name>`
2. Edit `.claude-plugin/plugin.json` -- name, description, version.
3. Rename `skills/_template-skill` to your first skill's name, rewrite
   `SKILL.md` (delete `references/example.md` unless you need it).
4. Add more `skills/<name>/` directories for additional skills in the same
   plugin (see the PR Review Co-Pilot design: `review-diff`,
   `team-conventions`, `review-history` as three skills in one plugin).
5. Add an entry to `.claude-plugin/marketplace.json` at the marketplace root.
6. Add a row to `CATALOG.md` at the marketplace root.
7. Run each script under `adapters/*/install.sh` against a scratch target to
   confirm the new plugin adapts cleanly to all four tools before publishing.
8. Remove the `"tags": ["template", "do-not-install"]` pattern -- that's
   specific to this template, not something real plugins need.
