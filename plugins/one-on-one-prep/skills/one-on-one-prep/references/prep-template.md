# Output Template

```markdown
# 1:1 Prep: [Name]
**Date:** [today]  **Last 1:1:** [date of last logged session, or "no prior history"]

## Open follow-ups from last time
- [follow-up item] (raised [date])
(If none: "No open follow-ups.")

## Recent activity
**PRs/commits:** [1-3 line summary, not a raw list]
**Tickets:** [1-3 line summary]

## Worth asking about
- [observation framed as a question to ask, not a conclusion]
(If nothing stands out: "Nothing unusual in recent activity -- this can be a
lighter check-in.")

## Recurring themes (if any, from one-on-one-history)
- [theme noted across 2+ past 1:1s]

## Suggested talking points
- [talking point -- specific, not generic]
- [talking point]
```

## Worked example

```markdown
# 1:1 Prep: Jordan Lee
**Date:** 2026-09-19  **Last 1:1:** 2026-09-05

## Open follow-ups from last time
- Jordan wanted to try leading the migration design review (raised 2026-09-05)

## Recent activity
**PRs/commits:** Merged the retry-logic fix from the checkout incident;
currently mid-review on a larger auth refactor (3 review rounds so far,
still open).
**Tickets:** Picked up two tickets from the migration epic this week, both
closed within a day or two -- faster than the epic's average.

## Worth asking about
- The auth refactor PR has more review rounds than Jordan's PRs usually
  get -- worth asking if the design direction is solid or if it's just
  taking longer for other reasons.
- Migration tickets are going fast -- worth checking if Jordan wants more
  of that work, or if it's just easier than expected.

## Recurring themes (if any, from one-on-one-history)
- Jordan has mentioned wanting more design-level ownership in each of the
  last 2 1:1s.

## Suggested talking points
- Follow up on the migration design review lead -- did that happen, and if
  not, what's blocking it?
- Ask how the auth refactor review is going from Jordan's side.
- Given the recurring interest in design ownership, ask directly whether
  Jordan wants to propose owning the next design doc, rather than waiting
  to be asked.
```
