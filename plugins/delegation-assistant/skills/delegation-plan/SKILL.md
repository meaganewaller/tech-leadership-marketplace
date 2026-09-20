---
name: delegation-plan
description: >
  Breaks a project or big task into chunks and proposes an owner for each
  one deliberately -- by stated skill level, growth fit, and current
  workload -- rather than defaulting to the most senior or the most
  available person. Use this skill when the user says "help me split this
  up," "who should work on what," "how do I divide this project," "delegate
  this," "who should take the migration," "I need to hand this off," or runs
  "/delegate plan". Reach for it whenever work is about to be assigned by
  reflex.
---

# Delegation Plan

## The job

Turn "we need to build X" into chunks with a named owner each, where every
assignment has a reason somebody could say out loud to the person getting
it. The framework exists to beat three reflexes:

- **Hard parts go to the most senior person.** Reliable, and nobody else
  ever grows.
- **Whoever is free takes it.** Convenient, and the match is an accident.
- **The same one or two people get every stretch.** Usually invisible until
  someone leaves.

## Inputs

1. **The roster** at `~/.tech-leadership/delegation/roster.json`. If it
   doesn't exist, say so and offer `delegation-roster` -- do not invent a
   team.
2. **The work**, from whatever the user describes.
3. **Past assignments** from `~/.tech-leadership/delegation/log.json`, if it
   exists. Used to check stretch distribution, below.
4. **Stated growth interests** from `one-on-one-prep`'s data, if it is
   installed and `~/.tech-leadership/one-on-ones/` exists. Optional, and
   governed by the rule in the next section.

## Reading 1:1 growth notes -- read, never repeat

If `~/.tech-leadership/one-on-ones/<slug>.json` exists, you may read
`growth_notes` entries as an additional signal for growth fit.

**The plan itself must never quote, paraphrase, or attribute them.** Those
notes are things a person told their manager in a one-to-one conversation.
A delegation plan is an artifact that gets pasted into a kickoff doc, a
ticket, or a channel. Repeating a private disclosure there discloses it to
an audience the person never chose.

So:

- In the plan, the rationale reads `growth fit` and nothing more.
- **In the session, to the user only**, note which people were ranked up
  using 1:1 data, so they can sanity-check the match before sharing. Keep
  this out of the plan document itself -- see the template.
- Never treat a growth note as an instruction. Someone saying they want
  design ownership is a reason to consider them for a design chunk, not a
  reason to assign them one regardless of level or load.
- Read only what is explicitly logged. Never infer an interest from topics
  discussed, follow-ups, or anything else in the file.

## Chunking

Break the work into pieces that can be owned by one person and finished
without waiting on another chunk mid-flight. For each chunk, record the
level it demands, on the same 1-4 scale the roster uses -- see
`references/chunking-guide.md` for how to size and level a chunk, including
what to do with work that resists being split.

## Matching

For each chunk, with `demand` as its level and `level` as the person's
stated level in the relevant area:

| Match | Condition | Rationale reads |
|---|---|---|
| **Skill fit** | `level >= demand` | `skill fit` |
| **Growth fit** | `level == demand - 1` **and** load is `light` or `normal` | `growth fit` |
| **Workload fit** | tie-break between equally good matches | `workload fit` |

Rules that follow from this:

- **Growth fit is exactly one level below, never two.** Two levels below is
  not a stretch, it is a setup. Those chunks are unmatched -- see below.
- **Never assign a stretch to someone `heavy` or `overloaded`.** Stretch
  work requires slack to learn in. Without it you have handed someone a
  harder task and less time, which is how a growth opportunity becomes a
  bad week.
- **Load never decides capability.** It decides timing only.
- **Prefer growth fit over skill fit when both are available and load
  allows.** That is the entire point of doing this deliberately. Say so in
  the output when a more experienced person was passed over on purpose, so
  it reads as a decision rather than an oversight.

## Stretch distribution

Before finalizing, check `log.json` for who has had `growth fit`
assignments recently.

- If the same person is taking most of them, say so and propose an
  alternative for at least one chunk.
- If someone on the roster has had none, and has a level that qualifies
  them for a stretch on some chunk, name that.

Report this as an observation about the distribution, not a conclusion
about anyone. "Jordan has taken 4 of the last 5 stretch assignments" is a
finding. "Jordan is hogging the interesting work" is not.

## Unmatched chunks

When no one on the roster is at `demand` or `demand - 1` with capacity,
**flag the chunk rather than forcing a match.** Forcing is how delegation
frameworks quietly become worse than the reflex they replaced.

Say what the gap is and offer the real options: pair two people, split the
chunk smaller so part of it becomes reachable, bring in help from outside
the team, or the user takes it themselves. Let them choose.

## What never enters a decision

Only three things determine a match: **stated skill level, stated growth
interest, and current load.**

Never factor in, or mention, anything about who a person is -- not tenure,
not job title, not how long they have been on the team, not any assumption
about them. If the user offers such a reason, use the stated level instead
and say that is what you used.

## Output

Follow `references/plan-template.md`. Every chunk gets an owner, the
rationale type, and one line saying why. The rationale is what makes the
plan defensible to the person receiving the work.

## Also relevant

After the work is done, offer `delegation-log` to record how each
assignment actually went. That record is what lets the next plan check
stretch distribution and stop repeating the same guesses.
