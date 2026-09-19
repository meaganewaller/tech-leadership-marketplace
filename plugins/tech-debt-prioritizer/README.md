# Tech Debt Prioritizer

Ranks technical debt by business impact instead of by how unpleasant the
code is. The framework exists to beat two specific failure modes in debt
conversations: **loudest voice wins**, and **most offensive code wins**.
Neither one correlates with what it costs the business.

## What's in this plugin

- **`skills/tech-debt-prioritize`** -- the core skill. Scores each item on
  blast radius, velocity drag, customer impact, cost of delay, and effort,
  then produces a Now/Next/Later ranking with a score breakdown, a one-line
  rationale per item, and quick-win flags.
- **`skills/tech-debt-log`** -- maintains the debt register: adding scored
  items, moving them open → scheduled → resolved, recording dates and why.
- **`skills/tech-debt-trends`** -- reads the register over time. Which areas
  accumulate debt, whether quick wins actually get resolved or only
  expensive work ships, how old the open high-impact items are.

## Using it

- "Prioritize these: [list]" / "What debt should we fix first?" -- produces
  the ranked, scored output
- "Log that ranking" / "We're scheduling the auth cleanup for Q4" / "td-003
  is done" -- maintains the register
- "Are we actually paying down debt?" / "Debt review for the retro" --
  the cross-time report

## How scoring works

Four impact factors scored 1-5, summed, divided by effort:

```text
impact = blast_radius + velocity_drag + customer_impact + cost_of_delay   (4-20)
ratio  = impact / effort                                                  (0.8-20)
```

- **Now** -- ratio >= 4.0 **and** impact >= 10
- **Next** -- ratio >= 2.0
- **Later** -- everything else
- **Quick win** -- impact >= 12 and effort <= 2, at any tier

The impact floor on `Now` is deliberate. Pure ratio ranking floats
trivially cheap, barely-useful work to the top -- a 1-effort item with an
impact of 5 scores 5.0 and would otherwise outrank a genuine fire.

Anchor descriptions for every score from 1 to 5 live in
`skills/tech-debt-prioritize/references/scoring-rubric.md`. Use them; the
value of the framework is that two people scoring the same item land in
roughly the same place.

## The velocity drag rule

This is the factor that gets abused, so it has a hard rule: **velocity drag
means an observable, nameable cost.** Repeated workarounds, unusually long
review cycles on an area, onboarding time lost, a class of bug that keeps
recurring.

"I find this code unpleasant" is not velocity drag. Neither is "it's
legacy" or "it doesn't follow our conventions." Aesthetic objection scores
**1** unless it's tied to a cost somebody can name.

If you complain about code and the skill asks what it costs in practice,
that's the skill working. Answer it or accept the 1.

## Where your data lives -- read this before installing

The register is written to `.claude/tech-debt-register.json` **in the
repository the debt belongs to**, not inside this plugin's installed folder.

That's the opposite of how `one-on-one-prep` treats its data, and for the
opposite reason. 1:1 notes are personal and must stay out of shared repos.
A debt register is **team-shareable working data** -- a backlog. It is worth
more when the whole team sees the same one, so committing it is the point.

Keeping it in the target repo also avoids three practical problems:

- Debt is per-codebase. One install of this plugin serves many repos; a
  single file inside the plugin couldn't tell them apart.
- The plugin folder is replaced on reinstall or update.
- The adapters in this marketplace copy plugin folders into `.github/skills/`,
  `~/.codex/skills/`, and Gemini extensions. A register living inside the
  plugin would be duplicated into every one of them.

Only skill *instructions* travel through the adapters. The register stays
with its repo.

## Design principle: scores you can argue with

Every output shows its score breakdown. That's not decoration -- it's what
lets someone disagree with the ranking instead of disagreeing with you.
"Why is that a 4?" is a productive question. "Why is that first?" is not.

The corollary is that the ranking has to be willing to disagree with the
room. If the thing everybody complains about ranks last because nothing
measurable is being lost, the output says so plainly.

## Known limitations (v0.1.0)

- No ticket-tracker connector bundled. If one is connected in your session
  it'll offer to pull from it; otherwise it works from what you paste or
  describe.
- Weights are fixed and equal across the four impact factors. If your team
  consistently cares more about one, you currently adjust by scoring
  convention rather than configuration.
- `tech-debt-trends` needs roughly five resolved items before resolution
  patterns mean anything. It says so rather than drawing a trend line
  through two points.
- No cross-repo view. Each repository's register stands alone.
