---
name: tech-debt-log
description: >
  Maintains a team-visible tech debt register at
  .claude/tech-debt-register.json in the repo being worked on -- adding
  scored items, moving them between open/scheduled/resolved, and recording
  when and why. Use this skill when the user says "log this debt," "add
  that to the register," "we're scheduling the auth cleanup," "that one's
  done," "mark it resolved," "what's in the debt register," or runs
  "/tech-debt log". Also use it right after tech-debt-prioritize produces a
  ranking the user is happy with.
---

# Tech Debt Log

## Where data lives

`.claude/tech-debt-register.json`, in the repository the debt belongs to.

This is deliberately **inside the target repo, not inside this plugin's
installed folder**. Three reasons, and they all bite in practice:

- Debt is per-codebase. One install of this plugin serves many repos, and a
  single file inside the plugin could not tell them apart.
- The plugin folder is replaced on reinstall or update, and the adapters in
  this marketplace copy plugin folders into other tools' locations. A
  register living there would be destroyed or duplicated.
- Unlike 1:1 notes, this is **team-shareable working data** -- a backlog,
  not personal information. Committing it is the point: the register is
  worth more when the whole team sees the same one.

Create the file if it doesn't exist. If the working directory isn't a
repository, ask where the register should live rather than guessing.

## Schema

The full schema with field-by-field rules is in
`references/register-schema.md`. The short version:

```json
{
  "repo": "meaganewaller/example-service",
  "updated": "2026-09-19",
  "items": [
    {
      "id": "td-001",
      "title": "Auth logic copied across three services",
      "area": "services/auth",
      "status": "open",
      "added": "2026-09-19",
      "scheduled_for": null,
      "resolved": null,
      "scores": { "blast_radius": 4, "velocity_drag": 4, "customer_impact": 2, "cost_of_delay": 4, "effort": 2 },
      "impact": 14,
      "ratio": 7.0,
      "tier": "Now",
      "quick_win": true,
      "evidence": "Three incidents in Q2 from divergent auth checks; every auth change ships as three PRs",
      "rationale": "High blast radius and compounding -- each new service copies it again"
    }
  ]
}
```

## Status lifecycle

`open` → `scheduled` → `resolved`. Items move forward, never backward, and
never get deleted.

- **`open`** -- recorded, not yet committed to a sprint or quarter.
- **`scheduled`** -- someone has committed to it. Set `scheduled_for` to the
  sprint, quarter, or date the user names.
- **`resolved`** -- done. Set `resolved` to today's date.

**Never delete a resolved item.** `tech-debt-trends` reads the full history
to answer whether quick wins actually get paid down or whether the team only
ever ships the expensive work. Deleting resolved items destroys exactly the
evidence that question needs.

If the user says an item is no longer relevant rather than fixed, resolve it
and note why in `rationale` -- "obsolete, service decommissioned" is a real
outcome worth keeping.

## Recording scores

Store the scores **as they were when the item was logged**, alongside the
computed `impact`, `ratio`, `tier`, and `quick_win`. Don't recompute
silently on later edits.

If the user re-scores an item, overwrite the scores and recompute, but note
the change in `rationale` ("re-scored 2026-11-02: cost of delay 1 → 5 after
vendor announced EOL"). Scoring drift is signal -- it usually means the
world changed, and trends should be able to see it.

## Workflow

1. Locate or create `.claude/tech-debt-register.json` in the current repo.
2. For a new item: assign the next `td-NNN` id, fill what the user gave, and
   ask only for what's genuinely missing. If it hasn't been scored, offer
   `tech-debt-prioritize` rather than inventing scores.
3. For a status change: find the item, move it forward, set the matching
   date field.
4. Update the top-level `updated` date.
5. Confirm back what changed, in one line per item -- this is the user's
   chance to correct it before it's written.

## Adding a whole ranking at once

When called right after `tech-debt-prioritize`, add every ranked item in one
pass, preserving each item's scores, tier, quick-win flag, and evidence.
Assign ids in ranked order. Tell the user how many were added and how many
were already in the register -- re-ranking the same list twice is common,
and silently creating duplicates is the obvious way this goes wrong.

Match against existing items by `title` similarity and `area`. When in
doubt, ask rather than creating a near-duplicate.
