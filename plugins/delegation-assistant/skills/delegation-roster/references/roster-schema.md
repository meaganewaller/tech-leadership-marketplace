# Roster Schema

`~/.tech-leadership/delegation/roster.json` -- never committed, never
carried by an adapter.

## Top level

| Field | Type | Notes |
|---|---|---|
| `updated` | string | ISO date of the last change. `delegation-plan` warns when this is stale, because `load` goes out of date fast. |
| `people` | array | One entry per person. |

## Person fields

| Field | Type | Notes |
|---|---|---|
| `name` | string | Display name, as they use it. |
| `slug` | string | Stable id, kebab-case. `delegation-log` references people by slug so a name change doesn't orphan history. Also the key into `one-on-one-prep`'s files, when both are installed. |
| `skills` | object | Area → level (1-4). Only areas with a *stated* level. |
| `growth_interests` | array | Things the person has said they want. Their framing, not a category. |
| `load` | string | `light`, `normal`, `heavy`, or `overloaded`. |
| `notes` | string or null | Optional, factual, about availability or context. Not a place for assessments. |

## Levels

| Level | Meaning |
|---|---|
| 1 | New to this. Would be learning from scratch. |
| 2 | Can do it with support or review from someone more experienced. |
| 3 | Works independently here. |
| 4 | Can lead the work and bring others along in it. |

A level is **stated experience with a kind of work**, not a rating of a
person. Two consequences worth stating plainly:

- **An absent area is not level 0.** It means nobody has said. Leave it out
  rather than writing a guess -- `delegation-plan` treats a missing area as
  unknown and will not assign against it, which is the correct behavior.
- **Levels are per area, and they differ wildly.** Someone at 4 in backend
  may be at 1 in infra. A single "seniority" number would erase exactly the
  information that makes deliberate matching possible, which is why there
  isn't one.

## Areas

Use whatever vocabulary the team already uses -- `backend`, `api-design`,
`infra`, `frontend`, `data-modeling`, `incident-response`. Keep them
consistent across people, because `delegation-plan` matches a chunk's area
against these keys, and `delegation-log` calibrates levelling per area.

Add an area when work demands it, not preemptively. A roster of twenty
mostly-empty areas is harder to keep current than one with six real ones.

## Load

| Value | Meaning |
|---|---|
| `light` | Room to take something new, including a stretch. |
| `normal` | Working steadily. Can take a stretch. |
| `heavy` | Can take more work, but not work that requires learning. |
| `overloaded` | Should not be taking anything new. |

`delegation-plan` will not hand a growth-fit chunk to someone `heavy` or
`overloaded`, because a stretch needs slack to learn in. Load never affects
whether someone is *capable* of a chunk.

## Full example

```json
{
  "updated": "2026-09-16",
  "people": [
    {
      "name": "Jordan Lee",
      "slug": "jordan-lee",
      "skills": { "backend": 3, "frontend": 1, "api-design": 2 },
      "growth_interests": ["design-level ownership"],
      "load": "normal",
      "notes": null
    },
    {
      "name": "Priya N",
      "slug": "priya-n",
      "skills": { "backend": 3, "auth": 3, "infra": 2 },
      "growth_interests": [],
      "load": "heavy",
      "notes": "On call the week of the 22nd"
    },
    {
      "name": "Sam Okafor",
      "slug": "sam-okafor",
      "skills": { "backend": 2, "frontend": 3 },
      "growth_interests": ["infra", "leading a design review"],
      "load": "light",
      "notes": null
    }
  ]
}
```

Note Priya has no `growth_interests` and an empty array rather than a
guess. Nobody is required to have stated one, and an empty list is a real
answer -- it means `delegation-plan` matches Priya on skill and load only,
which is correct until Priya says otherwise.
