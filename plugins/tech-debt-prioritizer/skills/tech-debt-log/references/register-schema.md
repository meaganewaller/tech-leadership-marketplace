# Register Schema

`.claude/tech-debt-register.json` -- one file per repository, committed.

## Top level

| Field | Type | Notes |
|---|---|---|
| `repo` | string | `owner/name`, or a plain name if there's no remote. Identifies the register if it's ever copied. |
| `updated` | string | ISO date (`YYYY-MM-DD`) of the last change to this file. |
| `items` | array | Every item ever logged, including resolved ones. |

## Item fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | `td-NNN`, zero-padded, assigned in order. Never reused, even after an item resolves. |
| `title` | string | One line. What the debt *is*, not how it feels. |
| `area` | string | Path, service, or subsystem. Used by `tech-debt-trends` to group -- keep it consistent (`services/auth`, not `auth stuff` one time and `the auth service` the next). |
| `status` | string | `open`, `scheduled`, or `resolved`. |
| `added` | string | ISO date first logged. |
| `scheduled_for` | string or null | Sprint, quarter, or date. Null unless `status` is `scheduled` or later. |
| `resolved` | string or null | ISO date resolved. Null unless `status` is `resolved`. |
| `scores` | object | The five factors, 1-5 each. See below. |
| `impact` | number | Sum of the four impact factors (4-20). Stored, not recomputed on read. |
| `ratio` | number | `impact / effort`, one decimal place. |
| `tier` | string | `Now`, `Next`, or `Later`, as computed when scored. |
| `quick_win` | boolean | `impact >= 12 && effort <= 2`. |
| `evidence` | string or null | What was cited for velocity drag. Null only when `velocity_drag` is 1. |
| `rationale` | string | One line on why it ranks where it does. Also where re-scoring notes go. |

## Scores object

```json
{
  "blast_radius": 4,
  "velocity_drag": 4,
  "customer_impact": 2,
  "cost_of_delay": 4,
  "effort": 2
}
```

Each 1-5, or the string `"?"` when genuinely unknown. A `"?"` in any impact
factor means `impact` and `ratio` are computed from what's known and the
item carries the uncertainty forward -- do not substitute a middle value.

## Invariants worth preserving

These are what make the register trustworthy over time. Check them when
writing:

- `impact` equals the sum of the four impact factors (ignoring `"?"`).
- `quick_win` agrees with `impact` and `effort`.
- `resolved` is non-null **iff** `status` is `resolved`.
- `scheduled_for` is non-null whenever `status` is `scheduled` or `resolved`
  -- a resolved item that was never scheduled is possible but unusual, and
  worth a note in `rationale` if it happens (it usually means an incident
  forced the work).
- `id` values are unique and never reused.
- No item is ever removed from `items`.

## Full example

```json
{
  "repo": "meaganewaller/example-service",
  "updated": "2026-11-02",
  "items": [
    {
      "id": "td-001",
      "title": "Auth logic copied across three services",
      "area": "services/auth",
      "status": "resolved",
      "added": "2026-09-19",
      "scheduled_for": "2026-Q4",
      "resolved": "2026-10-28",
      "scores": { "blast_radius": 4, "velocity_drag": 4, "customer_impact": 2, "cost_of_delay": 4, "effort": 2 },
      "impact": 14,
      "ratio": 7.0,
      "tier": "Now",
      "quick_win": true,
      "evidence": "Three incidents in Q2 from divergent auth checks; every auth change shipped as three PRs",
      "rationale": "High blast radius and compounding -- each new service copied it again"
    },
    {
      "id": "td-002",
      "title": "Old templating engine in the marketing site",
      "area": "web/marketing",
      "status": "open",
      "added": "2026-09-19",
      "scheduled_for": null,
      "resolved": null,
      "scores": { "blast_radius": 2, "velocity_drag": 2, "customer_impact": 1, "cost_of_delay": 5, "effort": 4 },
      "impact": 10,
      "ratio": 2.5,
      "tier": "Next",
      "quick_win": false,
      "evidence": "Two-day ramp for anyone who hasn't touched it before",
      "rationale": "Re-scored 2026-11-02: cost of delay 1 -> 5 after vendor announced EOL for 2027-06"
    }
  ]
}
```

The second item shows scoring drift recorded rather than silently applied:
the tier moved from Later to Next because the world changed, and the
`rationale` says so. `tech-debt-trends` can read that.
