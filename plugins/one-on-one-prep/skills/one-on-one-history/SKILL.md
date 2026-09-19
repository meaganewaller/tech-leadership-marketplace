---
name: one-on-one-history
description: >
  Surfaces patterns across a person's 1:1 history -- follow-ups that have
  stayed open too long, topics that keep recurring, and growth goals they've
  stated more than once -- from ~/.tech-leadership/one-on-ones/<person-slug>.json.
  Use this skill when the user asks "what keeps coming up with [name],"
  "has [name] mentioned this before," "what follow-ups are still open for
  [name]," wants a growth-trajectory summary before a review, or runs
  "/1-1 history [name]".
---

# One-on-One History

Reads the same file `one-on-one-log` writes:
`~/.tech-leadership/one-on-ones/<person-slug>.json`.

## What to surface

1. **Stale open follow-ups** -- anything with `status: "open"` raised more
   than ~2-3 sessions ago. Flag these plainly: "This has been open since
   [date] across N sessions" -- so it doesn't quietly fall off the list.

2. **Recurring topics** -- a topic (or close variant) appearing in `topics`
   or `growth_notes` across 2 or more sessions. Group and count them,
   most-frequent first.

3. **Self-stated growth trajectory** -- pull `growth_notes` in date order to
   show what this person has said they want, over time. Useful ahead of a
   review or a leveling conversation. Present it as their own stated
   interests over time, not as an assessment of whether they're "on track."

## Output

A short summary, not a full re-print of the log:

```markdown
## 1:1 History: [Name]

### Stale follow-ups
- [item] -- open since [date] ([N] sessions)

### Recurring topics
- [topic] -- mentioned in [N] sessions ([dates])

### Stated growth interests over time
- [date]: [what they said]
- [date]: [what they said]
```

## What this skill does not do

- It does not conclude anything about the person's performance, engagement,
  or trajectory -- it surfaces their own stated words and the plain facts
  of what's stayed open, and leaves the interpretation to the manager.
- It does not compare this person's history to any other report's.
- If asked to use this for a performance review, hand back the factual
  summary and say plainly that it's raw material -- not a drafted
  assessment -- since a review needs the manager's own judgment, not a
  generated one.
