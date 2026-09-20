# tech-leadership

A plugin marketplace specifically for the tech-lead side of engineering --
1:1s, delegation, tech debt prioritization, incident/postmortem writing,
stakeholder communication, design doc review. General-purpose engineering
tools (code review, debugging) live in a separate general marketplace, not
here. Tool-agnostic by design: write a plugin's content once, use it in
Claude, GitHub Copilot, Gemini CLI, or OpenAI Codex CLI.

## Why this works across four different tools

As of late 2026, Claude, Copilot, Gemini CLI, and Codex CLI have converged
on the same core building block: a **skill** is a folder with a `SKILL.md`
file (YAML frontmatter giving a `name` and a `description` that says when to
trigger it, then Markdown instructions in the body, with optional bundled
`references/`, `scripts/`, or `assets/`). All four discover skills this way
and decide when to use one from its description.

What differs is *packaging and discovery location*:

| Tool | Where it looks | Unit of distribution |
|---|---|---|
| Claude | `.claude-plugin/plugin.json` + `skills/*/SKILL.md`, cataloged via `marketplace.json` | plugin |
| GitHub Copilot | `.github/skills/<name>/SKILL.md` in a repo | skill folder, committed directly |
| Gemini CLI | `skills/` bundled inside an extension with its own `gemini-extension.json` | extension |
| OpenAI Codex CLI | `~/.codex/skills/<name>/` (personal) or `<repo>/.agents/skills/<name>/` (per-repo) | skill folder |

So this repo keeps one canonical copy of each skill's content --
`plugins/<plugin>/skills/<skill>/SKILL.md` -- and a small **adapter** per
tool that repackages or copies that content into the shape each tool
expects. Claude needs no adapter, since this repo's native layout already
is Claude's plugin format.

## Layout

```text
tech-leadership-marketplace/
├── .claude-plugin/
│   └── marketplace.json      -- catalog Claude reads to list/install plugins
├── plugins/
│   └── <plugin-name>/
│       ├── .claude-plugin/plugin.json
│       ├── README.md
│       └── skills/
│           └── <skill-name>/
│               ├── SKILL.md
│               └── references/   (optional)
├── adapters/
│   ├── claude/README.md      -- no script needed; documents `claude plugin` usage
│   ├── copilot/install.sh    -- copies skills into a repo's .github/skills/
│   ├── gemini/install.sh     -- builds a Gemini extension per plugin
│   └── codex/install.sh      -- copies skills into ~/.codex/skills/ or .agents/skills/
├── test/                      -- bun tests guarding the invariants above
├── .github/workflows/
│   ├── ci.yml                -- lint + tests on every pull request
│   └── release.yml           -- release-please, on push to main
├── release-please-config.json -- one release package per installable plugin
├── .release-please-manifest.json -- current version of each of those packages
├── CATALOG.md                 -- human-readable index of plugins and skills
└── AGENTS.md                  -- instructions for an agent working on this repo itself
```

## Using a plugin

Pick the adapter for whichever tool you're using; each has its own README
with exact commands:

- **Claude** -- `adapters/claude/README.md`
- **GitHub Copilot** -- `adapters/copilot/install.sh <path-to-your-repo>`
- **Gemini CLI** -- `adapters/gemini/install.sh <plugin-name>`
- **OpenAI Codex CLI** -- `adapters/codex/install.sh --personal` or `--repo <path>`

## What's in the catalog right now

Five installable plugins, three skills each, plus `_template-plugin` -- a
scaffold kept on purpose, since it's what proves the structure and all four
adapters still work after a change to this repo's shape.

- **`one-on-one-prep`** -- prepares for 1:1s with talking points that go
  past "what did you work on this week," logs what was actually discussed,
  and surfaces recurring themes and stale follow-ups over time.
- **`tech-debt-prioritizer`** -- ranks technical debt by business impact
  rather than by how unpleasant the code is, scoring blast radius, velocity
  drag, customer impact, cost of delay, and effort into a Now/Next/Later
  list. Keeps a team-visible register in the repo the debt belongs to.
- **`delegation-assistant`** -- breaks a project into chunks and matches
  each one to a person by stated skill level, growth fit, and current load,
  rather than by who is most senior or most available. Flags the chunks
  nobody is ready for instead of assigning them anyway.
- **`incident-postmortem-writer`** -- captures an incident timeline while
  details are fresh, then writes a blameless postmortem whose root causes
  are system and process gaps. There is deliberately no root cause category
  for human error. Tracks recurring causes and action items that never
  close.
- **`stakeholder-translator`** -- rewrites a technical update for a
  non-technical audience, reframing it around business impact, risk,
  timeline, and cost. Severity, uncertainty, numbers, and any caveat that
  would change a decision survive the rewrite untouched; jargon doesn't.

### Where each one keeps its data

This differs on purpose, and it's worth knowing before you install
anything.

**Information about people** lives under `~/.tech-leadership/`, outside the
installed plugin folder -- `one-on-ones/` for `one-on-one-prep`,
`delegation/` for `delegation-assistant`, `stakeholders/` for
`stakeholder-translator`. It never travels with skill content through an
adapter and never gets committed. It stays local and private to whoever is
running the tool.

**Information about a codebase** is committed where the team can see it,
next to the code it describes. `tech-debt-prioritizer` keeps its register
in the repo the debt is in; `incident-postmortem-writer` writes to
`.claude/incidents/` in the affected service's repo.

The question is the same each time: does this describe *people* or a
*codebase*? Each plugin's own README says which it is -- read that before
installing.

`CATALOG.md` has the full index, plus the backlog of ideas not yet scoped
into plugins (currently just a design doc reviewer).

## Adding a new plugin

See `plugins/_template-plugin/README.md` for the step-by-step, and
`AGENTS.md` for repo-wide conventions (skill-writing style, validation
commands) an agent working on this repo should follow.

## Development and releases

`mise` pins the toolchain (`bun`, `shellcheck`, `shfmt`, `jq`) and `bun`
carries the linters. `bun test` runs the suite; `bun run lint` runs biome,
markdownlint, shellcheck, and shfmt. CI runs both on every pull request and
also lints commit messages, since the pull request title becomes the squash
subject that release-please reads.

Versions are managed by release-please, one release package per installable
plugin. **Don't hand-edit a `version` field** in `plugin.json` or
`marketplace.json` -- a release PR will overwrite it, or worse, leave it
silently disagreeing with the git tag. `AGENTS.md` has the full release
notes, including how to register a new plugin.

## Status

Working. Five plugins published, all four adapters exercised by the test
suite against real plugin content, and releases automated. The marketplace
structure is settled; what grows from here is the catalog.
