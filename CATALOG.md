# Catalog

Human-readable index of this marketplace's plugins. Keep in sync with
`.claude-plugin/marketplace.json` by hand.

| Plugin | Status | Skills | Summary |
|---|---|---|---|
| `_template-plugin` | scaffolding, not installable content | `_template-skill` | Validates the marketplace structure and all four adapters. Copy it to start a real plugin; don't install it. |

## Scope

This marketplace is specifically for **tech-lead-facing** work -- the parts
of the job that are about people, prioritization, and communication, not
general-purpose engineering tasks. PR review and debugging tools are
useful to any developer regardless of seniority, so those live in a
separate general-purpose marketplace, not here.

## Backlog ideas (brainstormed, not yet designed)

From the original brainstorm on plugins for developers moving into a lead
role -- not yet scoped into skills:

- **1:1 prep assistant** -- pulls recent PRs/tickets for a report and
  suggests talking points beyond status updates.
- **Tech debt prioritizer** -- ranks debt by business impact, not just "this
  code is ugly."
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
4. Confirm all four `adapters/*` still work against the new plugin.
