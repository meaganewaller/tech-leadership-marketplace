# Output Template

```markdown
# Tech Debt Ranking
**Date:** [today]  **Items scored:** [n]  **Source:** [tracker query / user-provided]

## Now
### 1. [Item title]  — ratio [x.x]  ⚡ quick win
**Scores:** blast [n] · drag [n] · customer [n] · delay [n] · **impact [n]** / effort [n]
**Why:** [one line -- the actual reason it ranks here, not a restatement of the scores]
**Evidence:** [what was cited for velocity drag, if scored above 1]

## Next
### 2. [Item title]  — ratio [x.x]
**Scores:** blast [n] · drag [n] · customer [n] · delay [n] · **impact [n]** / effort [n]
**Why:** [one line]

## Later
### 3. [Item title]  — ratio [x.x]
**Scores:** blast [n] · drag [n] · customer [n] · delay [n] · **impact [n]** / effort [n]
**Why:** [one line]

## Quick wins
[Items flagged ⚡, listed together for convenience. If none: "None -- every
high-impact item here is expensive. Consider whether any can be split."]

## What would change this ranking
- [unknown that was scored `?`, and what would resolve it]
- [assumption worth checking]
(If nothing: omit this section.)
```

## Worked example

```markdown
# Tech Debt Ranking
**Date:** 2026-09-19  **Items scored:** 3  **Source:** user-provided

## Now
### 1. No pagination on the admin list endpoint — ratio 10.0 ⚡ quick win
**Scores:** blast 2 · drag 1 · customer 4 · delay 3 · **impact 10** / effort 1
**Why:** Support fields this weekly and it's a one-day fix -- the cheapest
customer-visible win on the list.

### 2. Auth logic copied across three services — ratio 7.0 ⚡ quick win
**Scores:** blast 4 · drag 4 · customer 2 · delay 4 · **impact 14** / effort 2
**Why:** Every auth change needs three coordinated PRs, and the copies have
already drifted once into an incident.
**Evidence:** Three incidents in Q2 traced to divergent auth checks; every
auth change currently ships as three PRs.

## Later
### 3. Old templating engine in the marketing site — ratio 1.5
**Scores:** blast 2 · drag 2 · customer 1 · delay 1 · **impact 6** / effort 4
**Why:** The loudest complaint on the team, but nothing measurable is lost --
it's stable, rarely touched, and users never see it.

## Quick wins
- No pagination on the admin list endpoint (effort 1)
- Auth logic copied across three services (effort 2)

## What would change this ranking
- Templating engine: if the vendor announces an EOL date, cost of delay goes
  from 1 to 5 and this moves to Now.
```

Note what the example does: the item everyone complains about ranks last,
with a plain explanation of why. That is the output doing its job. Do not
soften it -- the ranking is only useful if it can disagree with the room.
