# Catalog

Human-readable index of this marketplace's plugins. Rows are added by hand
when a plugin is added or removed; the `Status` column is deliberately
semantic rather than a version number, because versions live in
`.claude-plugin/marketplace.json` and each plugin's `plugin.json`, both of
which release-please maintains. Don't restate a version here -- there is
nothing to keep in sync.

| Plugin | Status | Skills | Summary |
|---|---|---|---|
| `_template-plugin` | scaffolding, not installable content | `_template-skill` | Validates the marketplace structure and all four adapters. Copy it to start a real plugin; don't install it. |
| `one-on-one-prep` | stable | `one-on-one-prep`, `one-on-one-log`, `one-on-one-history` | Prepares for 1:1s with talking points beyond status updates, logs what was discussed, and surfaces recurring themes and stale follow-ups over time. Per-person notes are stored outside the plugin folder -- see its README before installing. |
| `tech-debt-prioritizer` | stable | `tech-debt-prioritize`, `tech-debt-log`, `tech-debt-trends` | Ranks debt by business impact rather than by how ugly the code is -- scoring blast radius, velocity drag, customer impact, cost of delay, and effort into a Now/Next/Later list. Keeps a team-visible register in the target repo and reports on what actually gets paid down. |

## Scope

This marketplace is specifically for **tech-lead-facing** work -- the parts
of the job that are about people, prioritization, and communication, not
general-purpose engineering tasks. PR review and debugging tools are
useful to any developer regardless of seniority, so those live in a
separate general-purpose marketplace, not here.

## Backlog ideas (brainstormed, not yet designed)

From the original brainstorm on plugins for developers moving into a lead
role -- not yet scoped into skills:

- **Delegation assistant** -- breaks a big task into chunks suited to
  different skill levels on a team.
- **Incident/postmortem writer** -- structures blameless postmortems fast,
  right after an incident.
- **Stakeholder translator** -- rewrites technical updates for
  non-technical execs.
- **Design doc reviewer** -- checks a proposal for gaps before it goes to
  the team.

## Adding a real entry

1. Copy `plugins/_template-plugin/` to `plugins/<name>/` and fill it in
   (see that directory's own README).
2. Add a row to this table.
3. Add an entry to `.claude-plugin/marketplace.json`.
4. Register the plugin for releases -- add a package to
   `release-please-config.json` and a matching entry to
   `.release-please-manifest.json`. See "Releases" in `AGENTS.md`.
5. Confirm all four `adapters/*` still work against the new plugin.
