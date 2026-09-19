# Scoring Rubric

Anchor descriptions for every factor. Use these rather than an intuitive
sense of what a number means -- the whole value of the framework is that two
people scoring the same item land in roughly the same place.

## Blast radius (1-5)

How bad is it when this fails?

| Score | Anchor |
|---|---|
| 1 | Fails visibly in dev, caught before merge. No production path. |
| 2 | Degrades one non-critical feature. Recoverable without intervention. |
| 3 | Breaks one service or workflow. Needs a human to notice and fix. |
| 4 | Cross-service failure, data inconsistency, or a silent wrong answer. |
| 5 | Data loss, security exposure, or total outage of a critical path. |

Score the realistic failure, not the worst imaginable one. "Could
theoretically corrupt the database" is a 5 only if there is a plausible
path to it, not because the code touches a database.

## Velocity drag (1-5)

How much is the team measurably paying for this **right now**?

| Score | Anchor |
|---|---|
| 1 | Nobody is slowed. Includes "it's ugly but nobody touches it." |
| 2 | Occasional friction -- a workaround a few times a quarter. |
| 3 | Regular friction -- a known workaround most people who touch it perform. |
| 4 | Every change here costs materially extra: extra PRs, extra review rounds, extra coordination. |
| 5 | Actively blocking. Work stalls or gets routed around the area entirely. |

**Requires named evidence above 1.** See the velocity drag rule in
`SKILL.md`. Acceptable evidence looks like:

- "Every auth change needs three PRs because the logic is copied three times"
- "New hires take about a week to understand this before they can ship in it"
- "We've had four incidents this year from the same root cause"

Not acceptable as evidence: "it's a mess," "it's legacy," "it doesn't
follow our conventions," "I'd write it differently."

## Customer impact (1-5)

What do users experience because of this?

| Score | Anchor |
|---|---|
| 1 | Invisible to users. Purely internal. |
| 2 | Theoretical -- users could hit it but effectively don't. |
| 3 | Occasional visible bugs, or noticeable slowness in a secondary flow. |
| 4 | Regular visible bugs, or slowness in a primary flow. Support hears about it. |
| 5 | Users are blocked, leaving, or the limit is in a sales conversation. |

Internal developer experience is **not** customer impact -- that is velocity
drag. Scoring the same pain in both places double-counts it and is the most
common way this rubric gets gamed.

## Cost of delay (1-5)

Does waiting make it worse?

| Score | Anchor |
|---|---|
| 1 | Static. Costs the same to fix next year. |
| 2 | Grows slowly. Mild accretion. |
| 3 | Compounds -- every new feature in this area adds to the cleanup. |
| 4 | Blocking planned work, or a deprecation with a known deadline. |
| 5 | Hard deadline with consequences: EOL, compliance date, contract. |

A 4 or 5 should name the thing being blocked or the date. "We'll want to
migrate eventually" is a 1 or 2, not a 4.

## Effort (1-5)

Rough size of the fix. This is the divisor, so calibration matters as much
as the impact factors.

| Score | Anchor |
|---|---|
| 1 | Under a day. One person, one PR. |
| 2 | A few days. One person, a handful of PRs. |
| 3 | A sprint. One person, or two briefly. |
| 4 | Multiple sprints, or needs coordination across teams. |
| 5 | A quarter or more. A project with its own plan. |

Score the **whole** fix including migration, backfill, and cleanup of the
old path -- not just the interesting part. Effort routinely gets scored as
the fun 20% and that is what makes ratios lie.

## Worked example

Three items, scored:

| Item | Blast | Drag | Cust | Delay | Impact | Effort | Ratio | Tier |
|---|---|---|---|---|---|---|---|---|
| Auth logic copied across 3 services | 4 | 4 | 2 | 4 | 14 | 2 | 7.0 | Now (quick win) |
| No pagination on the admin list endpoint | 2 | 1 | 4 | 3 | 10 | 1 | 10.0 | Now (quick win) |
| Old templating engine in the marketing site | 2 | 2 | 1 | 1 | 6 | 4 | 1.5 | Later |

Note the second item: low blast radius and no internal drag, but users hit
it daily and it is a one-day fix. Aesthetic ranking would never surface it.
The third is the one everybody complains about; it ranks last because
nothing measurable is being lost.
