---
name: incident-history
description: >
  Reads the incident records in .claude/incidents/index.json and reports on
  patterns across incidents -- root cause categories that keep recurring,
  services that show up repeatedly, and action items that get created and
  never close. Use this skill when the user says "what keeps breaking,"
  "are we actually fixing these," "incident review for the quarter," "which
  action items never got done," "do we have a pattern here," or runs
  "/incident history". Reach for it before a reliability review or planning
  cycle, when the question is about the pattern rather than one incident.
---

# Incident History

## What this answers

Three questions. Each has an uncomfortable answer that the records can
prove and a meeting usually can't.

1. **Which root causes keep recurring?** The same category appearing across
   incidents means the fix isn't landing, or the action items aren't the
   right ones.
2. **Are action items closing?** Postmortems reliably produce action items
   and unreliably produce completed ones. This is the single most useful
   thing here.
3. **Which services show up repeatedly?** Concentration, and whether it's
   the same failure mode each time or different ones.

Output shape is in `references/history-report-template.md`.

## Reading the records

Load `.claude/incidents/index.json` from the current repo. If it doesn't
exist, say so and offer `incident-timeline` -- don't synthesize a report.

With fewer than about four incidents carrying written postmortems, report
the action item status and the raw list, and say the pattern analyses
aren't meaningful yet. Three incidents sharing a category is not a trend,
and presenting it as one sends people to fix the wrong thing.

## The analyses

**Recurring root causes.** Group by category across root causes and
contributing factors, counting each separately -- a category that is
repeatedly a contributing factor but never the root cause is its own
finding, usually meaning something is always making incidents worse without
ever starting one.

**Action item follow-through.** For every item: open, closed, or overdue.
Report the closure rate and list the overdue ones with their age and which
incident produced them. Call out any item whose incident's root cause
category has recurred since -- that pairing is the strongest evidence
available that a fix never landed.

**Service concentration.** Group by service. For each, incident count and
whether the categories repeat or vary. Same category repeatedly means one
unfixed gap; varied categories in one service usually means something more
structural.

**Detection gap trend.** Across incidents, the spread between estimated
start and `detected_at`. If it isn't shrinking while `alerting` keeps
appearing as a category, the alerting action items aren't working.

## Rules

- **Report what the records say, never what they imply about people.**
  "Three of the last five incidents have `change-management` root causes"
  is a finding. "The team is careless about deploys" is not, and would
  undo the blameless framing every one of those postmortems was written
  under.
- **Names appear only as action item owners.** An overdue item has an owner
  because somebody has to; that is a fact about the item, not a judgment
  about the person. Never aggregate overdue items by owner into anything
  resembling a scoreboard -- that turns a reliability tool into a
  performance one, which is exactly what blameless postmortems exist to
  prevent.
- **Name the uncomfortable pattern plainly.** A report that only says
  encouraging things isn't worth running.
- **Say when the sample is too small** rather than reporting a percentage
  computed from three incidents.

## Also relevant

If the report shows a category recurring with overdue action items against
it, that pairing is worth raising directly: the postmortems found the right
gap and the follow-through didn't happen. That is a different problem from
not knowing what's wrong, and it needs a different conversation.
