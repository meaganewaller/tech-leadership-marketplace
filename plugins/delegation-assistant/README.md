# Delegation Assistant

Breaks a project into chunks and matches each one to a person on purpose,
instead of by reflex. The two reflexes it exists to beat are **"hard parts
go to whoever's most senior"** and **"whoever's free takes it."** Both are
fast, and neither one is a decision.

## What's in this plugin

- **`skills/delegation-plan`** -- the core skill. Splits the work into
  chunks, levels each one, and proposes an owner with a rationale that says
  which kind of fit it is: skill, growth, or workload. Flags chunks nobody
  is ready for rather than forcing a match.
- **`skills/delegation-roster`** -- maintains the team roster: skill areas
  with stated levels, growth interests people have said out loud, and
  current load.
- **`skills/delegation-log`** -- records how each assignment actually went,
  so later plans calibrate instead of repeating the same guesses.

## Using it

- "Set up my team roster" / "Jordan's at capacity this sprint" -- roster
- "Help me split up the SSO project" / "Who should take the migration?" --
  the plan
- "Log how chunk 4 went -- took two extra review rounds" -- the log

## How matching works

Chunks and people share one 1-4 scale. For a chunk demanding level `d` and
a person at level `l` in that area:

| Match | Condition |
|---|---|
| **Skill fit** | `l >= d` |
| **Growth fit** | `l == d - 1`, and their load is `light` or `normal` |
| **Workload fit** | tie-break between equally good matches |

Three rules fall out of that, and they're the substance of the plugin:

- **A stretch is exactly one level up, never two.** Two levels up isn't a
  stretch, it's a setup.
- **Never stretch someone who's `heavy` or `overloaded`.** Stretch work
  needs slack to learn in. Without it you've handed someone a harder task
  *and* less time.
- **Growth fit beats skill fit when load allows** -- and the plan says so,
  so passing over a more experienced person reads as a decision rather than
  an oversight.

When nobody is at `d` or `d - 1` with capacity, the chunk comes back
unmatched with options (pair, split smaller, outside help, you take it).
Forcing a match is how a delegation framework becomes worse than the reflex
it replaced.

## What never enters a decision

Only three things: **stated skill level, stated growth interest, and
current load.**

Never tenure, job title, time on the team, or any assumption about who
someone is. Levels are recorded because someone stated them -- an absent
area means nobody has said, not level zero, and the plan won't assign
against it.

The same applies to growth interests. `delegation-roster` records only what
a person has said they want, never what you inferred they'd be good at. The
difference matters because a growth interest is a reason to hand someone
harder work: an inferred interest becomes a real assignment they never
asked for.

## Stretch distribution

Before finalizing a plan, it checks the log for who has been getting the
stretch assignments. If it's the same person repeatedly, it says so and
proposes an alternative for at least one chunk. If someone qualified has had
none, it names that too.

It reports the distribution as a pattern, never as a characterization of
anyone. "Jordan has taken 4 of the last 5" is a finding. Anything about why
is yours to think about.

## Where your data lives -- read this before installing

Both files live under `~/.tech-leadership/delegation/`, **outside this
plugin's installed folder, on purpose:**

- `roster.json` -- skill levels, growth interests, load
- `log.json` -- how each assignment went

This is information about specific people you work with. It must never be
committed to a shared marketplace repo, or copied alongside shareable skill
content into a team's `.github/skills/`, a Gemini extension, or
`~/.codex/skills/`. Same reasoning and same directory root as
`one-on-one-prep`'s per-person notes.

If you use any adapter in this marketplace to install this plugin into
another tool, only the skill *instructions* travel. Both data files are
created fresh, locally, wherever that tool runs.

## Reading 1:1 growth notes -- read, never repeat

If `one-on-one-prep` is also installed and has data, `delegation-plan` may
read logged `growth_notes` as one additional signal for growth fit.

**The plan never quotes, paraphrases, or attributes them.** Those notes are
things a person said to their manager in a one-to-one. A delegation plan is
an artifact that gets pasted into a kickoff doc or a ticket -- repeating a
private disclosure there discloses it to an audience the person never
chose. In the plan, the rationale reads `growth fit` and nothing more.

Separately, in your session only, it tells you which matches drew on 1:1
data, so you can confirm someone still wants that kind of work before it
lands on them as an assignment.

A growth note is never treated as an instruction. Someone saying they want
design ownership is a reason to consider them for a design chunk, not a
reason to assign one regardless of level or load.

## Design principle: records about work, not verdicts about people

`delegation-log` has exactly three outcomes: `as_expected`,
`needed_more_support`, and `good_stretch`. There is deliberately no value
meaning "did badly."

An assignment that went poorly is recorded as `needed_more_support` with a
factual note about what was needed -- which is both the humane record and
the useful one, because the usual cause is a chunk levelled too low rather
than a person who fell short. Repeated `needed_more_support` in one area
means that area's chunks are being sized wrong.

Raising someone's recorded level always requires you to say so. One good
assignment is not an inference the plugin gets to make about a person.

## Known limitations (v0.1.0)

- Load is a manual field and goes stale fast. The plan warns when the roster
  hasn't been touched in about two weeks, but it can't know on its own.
- Chunk levelling is a judgment call. The log surfaces systematic
  mis-levelling over time, but only after enough assignments to see it.
- No calendar or sprint awareness -- "available" means what you last wrote
  down, not what a tool says.
- Stretch distribution needs a few logged assignments before it means
  anything. With two entries it stays quiet rather than drawing a trend
  through them.
