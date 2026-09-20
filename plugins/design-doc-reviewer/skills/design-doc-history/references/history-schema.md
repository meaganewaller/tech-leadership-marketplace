# History Schema

`.claude/design-doc-history.json` in the repo the docs belong to. A flat,
append-only JSON array. One entry per finding kept from a review.

## Entry fields

| Field | Type | Notes |
|---|---|---|
| `date` | string | ISO date of the review. |
| `doc` | string | The doc's title, as it is titled. |
| `link` | string or null | Where the doc lives, if there is a stable link. |
| `category` | string | The gap category. Must reuse an existing name -- see below. |
| `severity` | string | `Blocking`, `Should-address`, or `Nice-to-have`. |
| `tier` | string or null | `T1` or `T2` from the checklist, when the team uses tiers. Lets a report separate "missing on a small doc" from "missing on a migration." |

There is deliberately **no author field, and no field a person's name
belongs in.** See the skill body for why. If you find yourself wanting to
put a name in `doc` to disambiguate two similarly titled documents, use the
`link` instead.

## Category names

Recurrence detection is string matching on `category`. It only works if the
same gap gets the same name every time, so:

- **Reuse a name that's already in the file** before coining a new one.
  `Rollback` and `Rollout and rollback` as two categories means a gap
  recurring six times looks like two that recurred three times.
- Prefer the names in `design-doc-review`'s `references/gap-categories.md`,
  or the team's checklist headings when they have one.
- Add a new category only for a gap the existing names genuinely don't
  cover -- typically a team-specific checklist item.

## Example

```json
[
  {
    "date": "2026-08-04",
    "doc": "Unify notification delivery",
    "link": "https://linear.app/acme/document/unify-notifications",
    "category": "Failure modes",
    "severity": "Should-address",
    "tier": "T2"
  },
  {
    "date": "2026-08-04",
    "doc": "Unify notification delivery",
    "link": "https://linear.app/acme/document/unify-notifications",
    "category": "Alternatives considered",
    "severity": "Nice-to-have",
    "tier": "T1"
  },
  {
    "date": "2026-09-20",
    "doc": "Move session storage to Redis",
    "link": "https://linear.app/acme/document/move-session-storage",
    "category": "Rollout and rollback",
    "severity": "Blocking",
    "tier": "T2"
  },
  {
    "date": "2026-09-20",
    "doc": "Move session storage to Redis",
    "link": "https://linear.app/acme/document/move-session-storage",
    "category": "Failure modes",
    "severity": "Should-address",
    "tier": "T2"
  }
]
```

Two things the example shows: one review contributes several entries
sharing a `date` and `doc`, and `Failure modes` has now appeared in two
separate docs at the same severity -- which is the shape recurrence
detection is looking for.

## Growth

One entry per finding, a handful per review. A team doing a design review a
week adds maybe 150 entries a year, so this stays small enough to read
whole. There's no rotation or archiving step; if it ever does get
unwieldy, dropping entries older than a couple of years by hand is fine --
the recurrence question is about what's happening now.
