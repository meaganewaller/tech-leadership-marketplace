# Log Schema

`~/.tech-leadership/delegation/log.json` -- never committed, never carried
by an adapter.

## Top level

| Field | Type | Notes |
|---|---|---|
| `updated` | string | ISO date of the last change. |
| `assignments` | array | Every assignment ever logged. Nothing is removed. |

## Assignment fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | `dl-NNN`, assigned in order, never reused. |
| `project` | string | What the plan was for. |
| `chunk` | string | The chunk text from the plan, so the two can be lined up later. |
| `person` | string | Roster `slug`, not display name -- names change. |
| `area` | string | The skill area the chunk drew on. Must match a roster area to be useful for calibration. |
| `demand` | number | The chunk's level, 1-4, as planned. |
| `level_at_time` | number | The person's stated level in that area when assigned. |
| `match` | string | `skill`, `growth`, or `workload` -- the rationale the plan used. |
| `assigned` | string | ISO date. |
| `completed` | string or null | ISO date, null while in flight. |
| `outcome` | string or null | `as_expected`, `needed_more_support`, or `good_stretch`. Null while in flight. |
| `support_note` | string or null | Factual description of help needed. About the work, never about the person. |
| `level_after` | number or null | Only when the user explicitly says the level changed. |

## Why `level_at_time` and `demand` are both stored

Together they say what kind of match this was, independent of what the
roster says today. A `growth` match is `level_at_time == demand - 1`. If the
roster later moves Jordan from 1 to 2, a stored `level_at_time: 1` still
records that chunk 4 *was* a stretch at the time. Without it, every past
stretch silently becomes a skill fit as people level up, and the
distribution check stops working.

## Invariants

- `completed` is non-null **iff** `outcome` is non-null.
- `match` is `growth` only when `level_at_time == demand - 1`.
- `support_note` is non-null whenever `outcome` is `needed_more_support`.
- `level_after`, when set, differs from `level_at_time`.
- `id` values are unique, never reused, and nothing is deleted.

## Full example

```json
{
  "updated": "2026-10-03",
  "assignments": [
    {
      "id": "dl-001",
      "project": "Add SSO to the admin app",
      "chunk": "Admin UI for the login flow",
      "person": "jordan-lee",
      "area": "frontend",
      "demand": 2,
      "level_at_time": 1,
      "match": "growth",
      "assigned": "2026-09-19",
      "completed": "2026-10-03",
      "outcome": "good_stretch",
      "support_note": "Two review rounds with Priya on form patterns",
      "level_after": 2
    },
    {
      "id": "dl-002",
      "project": "Add SSO to the admin app",
      "chunk": "Migration for existing password users",
      "person": "priya-n",
      "area": "backend",
      "demand": 3,
      "level_at_time": 3,
      "match": "skill",
      "assigned": "2026-09-19",
      "completed": "2026-10-07",
      "outcome": "needed_more_support",
      "support_note": "Rollback path wasn't specified in the chunk; took a day of design with the user before implementation could start",
      "level_after": null
    }
  ]
}
```

Note `dl-002`: a level-3 person on a level-3 chunk needed more support, and
the note says why -- the chunk was underspecified, not the person
underpowered. That is the distinction this field exists to preserve, and
the reason the outcome vocabulary has no value meaning "did badly."
