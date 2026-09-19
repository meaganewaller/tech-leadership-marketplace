---
name: tech-debt-trends
description: >
  Reads the tech debt register at .claude/tech-debt-register.json and
  reports on what is actually happening to debt over time -- which areas
  keep accumulating it, whether quick wins get resolved or only expensive
  work ships, and how old the open high-impact items are. Use this skill
  when the user says "how are we doing on tech debt," "are we actually
  paying this down," "what keeps coming back," "where is our debt
  concentrated," "debt review for the retro," or runs "/tech-debt trends".
  Reach for it before quarterly planning or a retro, when the question is
  about the pattern rather than any single item.
---

# Tech Debt Trends

## What this answers

Four questions, in this order. They're chosen because each one has an
uncomfortable answer that a register can prove and a conversation usually
can't.

1. **Where is debt concentrating?** Which areas accumulate items faster than
   they resolve them.
2. **Do quick wins actually get done?** Or does the team only ship expensive,
   visible projects while the cheap high-impact work sits open.
3. **How old are the open high-impact items?** Age on `Now`-tier work is the
   clearest sign that the framework is being produced and then ignored.
4. **Is anything being re-scored upward?** Items whose cost of delay grew
   while they sat.

Read `references/trends-report-template.md` for the output shape.

## Reading the register

Load `.claude/tech-debt-register.json` from the current repo. If it doesn't
exist, say so and offer `tech-debt-log` -- don't synthesize a report from
nothing.

If it exists but has fewer than about five resolved items, say that the
resolution patterns aren't meaningful yet and report only the concentration
and age views. A trend line drawn through two points is not a trend, and
presenting it as one is worse than saying nothing.

## The analyses

**Concentration by area.** Group by `area`. For each: open count, resolved
count, and the ratio. An area with many opens and few resolves is where debt
accumulates faster than it's paid. Order by open count, descending.

**Quick-win follow-through.** Compare resolution rates for `quick_win: true`
items against the rest. The failure pattern to name explicitly: quick wins
sitting open while high-effort items resolve. It usually means work is being
chosen by visibility rather than by return, and it is the single most useful
thing this skill can surface.

**Age of open items.** For every `open` or `scheduled` item, compute days
since `added`. Report median and the oldest few, weighted toward `Now` tier.
An item tiered `Now` and open for six months is a finding, not a statistic --
call it out by name.

**Scoring drift.** Items whose `rationale` records a re-score. Note which
direction and why, since upward drift on a delayed item is the framework
catching cost of delay working exactly as designed.

## Rules

- **Report what the register says, not what it implies about people.** "The
  payments area has 9 open and 1 resolved" is a finding. "The payments team
  isn't prioritizing debt" is an inference about people, and this skill
  doesn't make those. The same principle the 1:1 plugins follow.
- **Name the uncomfortable pattern plainly** when the data shows it. A
  report that only says encouraging things isn't worth running.
- **Don't recompute scores.** Read `impact`, `ratio`, and `tier` as stored.
  They reflect what was known when the item was scored, which is the point.
- **Say when the sample is too small** rather than reporting a percentage
  computed from three items.

## Also relevant

If the report surfaces stale `Now` items, offer `tech-debt-prioritize` to
re-score them -- an item open for two quarters often isn't scored wrong, but
its cost of delay has usually changed.
