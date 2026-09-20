---
name: delegation-log
description: >
  Records how a delegated assignment actually went -- finished as expected,
  needed more support than planned, or turned out to be a good stretch -- at
  ~/.tech-leadership/delegation/log.json, so later plans match better
  instead of repeating the same guesses. Use this skill when the user says
  "log how that went," "that took way more help than I expected," "[name]
  crushed it," "the migration is done," "close out that delegation," or runs
  "/delegate log". Also offer it when a project a plan covered has wrapped.
---

# Delegation Log

## Where data lives

`~/.tech-leadership/delegation/log.json` -- **outside this plugin's
installed folder**, same as the roster and for the same reason. This is a
record about how specific people handled specific work. It must never be
committed to a shared repo or carried into a team's `.github/skills/` by an
adapter.

It is also the most sensitive file this plugin writes. A roster says what
someone can do; the log says how it went. Write it accordingly -- see the
rules below.

## Schema

Full field rules in `references/log-schema.md`. The short version:

```json
{
  "updated": "2026-09-19",
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
    }
  ]
}
```

## Outcomes -- three values, about the work

`outcome` is one of:

- **`as_expected`** -- finished roughly as planned.
- **`needed_more_support`** -- took more help than the match assumed. This
  is a fact about the **estimate**, not about the person. It usually means
  the chunk was levelled too low or the area was wrong, and that is the
  useful thing to learn.
- **`good_stretch`** -- the person came out of it able to do that kind of
  work at a level they couldn't before.

Nothing else goes in this field. There is no value for "did badly," because
this log exists to improve matching, not to accumulate a file of judgments
about people. If an assignment went poorly, the honest and useful record is
`needed_more_support` plus a factual `support_note` about what was needed.

## Rules

- **Describe the work, never characterize the person.** "Needed two extra
  review rounds on the form patterns" is a support note. "Struggled" is
  not. "Isn't ready for frontend work" is definitely not.
- **`level_after` only when the user says so.** Raising someone's level is
  a claim about their capability, and it belongs to the user, not to an
  inference from one assignment. Ask; don't assume a `good_stretch` means a
  level went up.
- **Never delete an assignment.** `delegation-plan` reads the full history
  for stretch distribution, and deleting entries is how that check quietly
  starts lying.
- **Record the match type and level at the time.** Without them the log
  can't tell whether a stretch actually worked, which is most of its value
  later.

## Workflow

1. Load the log, or create it.
2. Identify the assignment -- by project and chunk, or by asking. If a plan
   was made in this session, match against it.
3. Fill `completed`, `outcome`, and a factual `support_note`.
4. Ask whether the person's level in that area should change. Only write
   `level_after` if the user says yes, and offer to update the roster to
   match.
5. Update the top-level `updated` date.
6. Confirm back what was recorded, in the same factual terms, so the user
   can correct it before it is saved.

## Feeding the next plan

Two things the log gives `delegation-plan`:

- **Stretch distribution** -- who has had `match: "growth"` assignments
  recently, so the same person doesn't get all of them.
- **Levelling calibration** -- repeated `needed_more_support` on a given
  area suggests chunks in that area are being levelled too low, not that
  the people are wrong.

Mention the second one if you notice it while logging. It is the kind of
pattern that is invisible in any single assignment.
