# Profile Schema

`~/.tech-leadership/stakeholders/<slug>.json` -- never committed, never
carried by an adapter.

One file per stakeholder. This skill owns every key below; the
`communications` array in the same file belongs to `stakeholder-history`
and is documented in that skill's `references/log-schema.md`. Two writers,
disjoint keys, one file per person.

## Fields

| Field | Type | Notes |
|---|---|---|
| `name` | string | Display name, as they use it. |
| `slug` | string | Stable id, kebab-case. Matches the filename. `communications` entries reference nothing else, so a rename means renaming the file, not rewriting history. |
| `role` | string or null | What they own. Context for you -- never used to infer fluency. |
| `fluency` | integer or null | 1-4, observed. `null` means unknown, and unknown is a real answer. |
| `cares_about` | array | What they have actually asked about or acted on, in their framing. |
| `leads_with` | string or null | The one thing that goes in the first line. |
| `format` | string or null | `chat`, `email`, `doc`, or `spoken`. |
| `cadence` | string or null | How often they expect to hear from you: `weekly`, `monthly`, `on-change`, `ad-hoc`. |
| `avoid` | array | Observed patterns that reliably go wrong, phrased as a consequence and a remedy. |
| `notes` | string or null | Factual context that doesn't fit above -- uneven fluency across areas, a standing constraint. |
| `updated` | string | ISO date of the last change to any of the above. |

## Fluency levels

| Level | Meaning | What it changes |
|---|---|---|
| 1 | Non-technical. | System names become what they do. No acronyms. |
| 2 | Technically literate. | "API," "database," "deploy" are fine. Architecture tradeoffs are not. |
| 3 | Technical, different domain. | Full technical vocabulary, no assumed knowledge of *this* system. |
| 4 | Technical in this domain. | Keep the detail. Simplifying reads as condescension and costs credibility. |

**`null` is not level 1.** It means nobody has observed it yet.
`stakeholder-translate` asks rather than assuming, which is correct -- and
much better than a guess that silently persists for a year.

Record fluency from evidence: what they've read without asking, what they
asked about, what they've built. Never from a title, a department, or
seniority.

## `avoid` entries

The most valuable field and the easiest to abuse. A good entry is an
observed pattern plus what to do instead:

- "Quotes the optimistic end of any range to the board -- give a single
  date with a confidence rather than a range."
- "Forwards updates verbatim to the customer success team, so assume
  anything here is customer-visible."
- "Asks for the root cause within the first hour of an incident -- have a
  'still unconfirmed' sentence ready rather than a theory."

A bad entry is a character judgment in the same slot: "impatient,"
"doesn't read carefully," "political." Those describe a person rather than
a practice, they change nothing about the rewrite, and they are the entries
you would not want read aloud. See the test in the skill body.

## Worked example

```json
{
  "name": "Priya Nadar",
  "slug": "priya-nadar",
  "role": "VP Finance",
  "fluency": 2,
  "cares_about": [
    "cost per customer",
    "anything that changes the Q1 forecast",
    "vendor contract renewals"
  ],
  "leads_with": "the number, or that there isn't one yet",
  "format": "email",
  "cadence": "monthly",
  "avoid": [
    "Quotes the optimistic end of any range to the board -- give a single date with a confidence rather than a range.",
    "Treats an engineering estimate as a committed figure once it is written down. Label estimates explicitly."
  ],
  "notes": "Wrote the original commissions logic years ago, so she is a 4 on billing specifically. Everything else is a 2.",
  "updated": "2026-09-20"
}
```

And a group, written to the floor rather than the average:

```json
{
  "name": "Exec team (weekly staff meeting)",
  "slug": "exec-team",
  "role": "CEO, CFO, VP Product, VP Sales, VP Eng",
  "fluency": 1,
  "cares_about": [
    "customer-visible impact",
    "whether a date moved",
    "what we need from them"
  ],
  "leads_with": "status and whether anything changed since last week",
  "format": "doc",
  "cadence": "weekly",
  "avoid": [
    "A status label with no reason attached gets read as the whole update -- always put the why on the same line."
  ],
  "notes": "VP Eng is a 4; written to 1 because the other four read it too.",
  "updated": "2026-09-20"
}
```

Note what the group example does: fluency 1 with the reason recorded in
`notes`, so the next person to read the file doesn't 'correct' it upward
and start writing past most of the room.
