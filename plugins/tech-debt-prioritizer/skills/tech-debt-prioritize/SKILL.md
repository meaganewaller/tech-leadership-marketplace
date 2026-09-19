---
name: tech-debt-prioritize
description: >
  Ranks technical debt by business impact instead of by how ugly the code
  is -- scoring blast radius, velocity drag, customer impact, cost of delay,
  and effort, then producing a Now/Next/Later list with a score breakdown
  and quick-win flags. Use this skill when the user says "prioritize our
  tech debt," "what debt should we fix first," "rank these," "is this worth
  fixing," "help me make the case for paying down X," "which of these
  should go in the next sprint," or runs "/tech-debt prioritize". Reach for
  it whenever a debt conversation is about to be settled by whoever feels
  most strongly.
---

# Tech Debt Prioritize

## The job

Turn a pile of "we should really fix that someday" into a ranked list
somebody can defend in a planning meeting. The framework exists to beat two
specific failure modes: **loudest voice wins**, and **most offensive code
wins**. Neither correlates with business impact.

## Getting the items

Ask for the list if the user hasn't given one. In order of preference:

1. **A connected ticket tracker** (Linear, Jira, GitHub issues via `gh`).
   If one is connected in this session, offer to pull open items by label
   or query -- "tech-debt", "refactor", "cleanup" are common. Confirm the
   query with the user before treating the result as the full list.
2. **Whatever the user pastes or describes.** This is the normal case. A
   rough list in prose is fine -- one line per item is enough to start.

If no connector is available, say so plainly once and move on. Do not
block on it.

## Scoring

Five factors. Four measure impact and are scored 1-5; effort is scored 1-5
and used as the divisor. Full definitions with anchor descriptions for every
score are in `references/scoring-rubric.md` -- read it before scoring, and
use its anchors rather than inventing your own sense of what a 4 means.

| Factor | What it measures |
|---|---|
| Blast radius | How bad the failure is when this breaks |
| Velocity drag | Measurable slowdown the team is paying now |
| Customer impact | Visible bugs, slowness, or limits users hit |
| Cost of delay | Whether waiting makes it worse or blocks something planned |
| Effort | Rough size of the fix, as a divisor |

```text
impact = blast_radius + velocity_drag + customer_impact + cost_of_delay   (4-20)
ratio  = impact / effort                                                  (0.8-20)
```

Rank by `ratio`, descending.

## The velocity drag rule -- this is the one that gets abused

Velocity drag means an **observable, nameable cost**. Before scoring it
above 1, say what the cost is:

- Repeated workarounds people actually perform
- Review cycles that run unusually long on this area
- Onboarding time lost to explaining it
- A class of bug that keeps recurring here

"I find this code unpleasant" is not velocity drag. Neither is "this isn't
how I'd write it," "this is legacy," or "this uses an old pattern."
Aesthetic objection is allowed to score **1** and no higher unless it is
tied to one of the observable costs above.

If the user offers an aesthetic complaint, ask once what it costs in
practice. If they can name a cost, score it and record the cost as
evidence. If they can't, score it 1 and say why -- that is the skill doing
its job, not being unhelpful.

## Tiers

- **Now** -- `ratio >= 4.0` **and** `impact >= 10`
- **Next** -- `ratio >= 2.0`
- **Later** -- everything else

The `impact >= 10` floor on Now exists because pure ratio ranking floats
trivially cheap, barely-useful work to the top: a 1-effort item with an
impact of 5 scores 5.0 and would otherwise outrank a genuine fire. Cheap is
not the same as important.

**Quick win** -- flag any item with `impact >= 12` and `effort <= 2`,
whatever its tier. These are the items to spend political capital on first,
because they pay off before anyone loses patience with the initiative.

## Output

Follow `references/output-template.md`. Every item gets a score breakdown, a
one-line rationale, a tier, and a quick-win flag where it applies. The
breakdown is not decoration -- it is what lets someone argue with the
ranking instead of arguing with you.

## Missing information

Score what you can and mark what you can't. Write `?` for a factor the user
has no basis to score, compute the ratio from what is known, and list the
unknowns under "What would change this ranking." Never quietly assume a
middle value -- a guessed 3 is indistinguishable from a real one once it's
in the table, and it launders a guess into evidence.

## Also relevant

Offer to save the result with `tech-debt-log` once the user is happy with
the ranking. Don't save automatically -- rankings get revised in the
conversation, and only the settled one is worth recording.
