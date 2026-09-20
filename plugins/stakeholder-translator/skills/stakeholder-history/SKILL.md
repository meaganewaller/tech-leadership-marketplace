---
name: stakeholder-history
description: >
  Records what has already been communicated to a stakeholder, and checks a
  new update against it -- so it doesn't repeat what they were told last
  time, and never silently contradicts it. Reads and writes the
  communications log in ~/.tech-leadership/stakeholders/<slug>.json. Use
  this skill when the user says "what have I already told [name],"
  "did I say anything about this to [name]," "log that I sent this,"
  "what did I promise [name]," "am I about to contradict myself," "when did
  I last update [name]," or runs "/stakeholder history [name]". Use it
  before sending any update that changes a date, a scope, or a status.
---

# Stakeholder History

## Where data lives

The `communications` array in
`~/.tech-leadership/stakeholders/<slug>.json` -- the same per-person file
`stakeholder-profile` writes, outside this plugin's installed folder for
the same reason. This skill owns `communications`; the profile fields
belong to `stakeholder-profile` and should be left alone here.

If the file doesn't exist, create it with an empty profile and the first
communication entry. A log with no profile is still useful -- see
`references/log-schema.md` for the shape.

## Why this exists

One check, mostly. **An update that quietly supersedes the last one is how
credibility goes.** Nobody minds a date moving; people mind finding out in
a meeting that it moved three weeks ago and they were the last to know.

The drift is rarely dishonest. Each update is written on its own, is true
on its own, and simply never mentions that it disagrees with the previous
one. That's exactly the failure a log catches and memory doesn't.

## The four checks

Run these against a drafted update before it goes out.

1. **Contradiction.** Does this change a date, a number, a scope, or a
   status this person was already given? If so, the change *is the news* --
   report it as a revision with the previous value named, not as a fresh
   statement of fact. Quote what was said and when.

2. **Repetition.** Has this already been communicated, substantially?
   Re-explaining something somebody already understood is how updates start
   getting skimmed. Say what's new and reference the rest.

3. **Open commitments.** What was promised to this person, and is it due?
   Anything in `commitments` with `status: "open"` and a date in the past
   should be addressed in this update rather than waited on -- a promise
   you don't mention is one they think you forgot.

4. **Cadence.** When did they last hear from you, and does that match the
   profile's `cadence`? Flag a gap plainly: "Priya's profile says monthly
   and it's been eleven weeks."

## Logging

After an update is actually sent, record it: the date, the topic, the
format, the claims that might need revising later (dates, numbers, status),
and any commitment made. Full schema and field rules in
`references/log-schema.md`.

**Log what was sent, not what was drafted.** Only the user knows whether
the draft went out as written, whether they edited it, or whether the
conversation happened verbally instead. Ask rather than assuming, and
record the version that actually reached the person.

Record `claims` in particular. That array is what makes check 1 possible --
a bare topic list tells you that payments was discussed, not that you said
it would ship in October.

## Reporting

For "what have I told [name]," output shape and a worked example are in
`references/history-report-template.md`. Keep it short: a reverse
chronological list of what was communicated, the open commitments, and any
claim that the current draft contradicts, called out first.

## Rules

- **Report what was said, never what it implies about the person.** "Told
  Priya the date twice; she asked again on the 14th" is a fact about the
  correspondence. "Priya doesn't listen" is not, and it belongs nowhere in
  this file. Same rule as everywhere else in this marketplace.
- **This log is not ammunition.** "I told you in August" is a true sentence
  that wins an argument and costs a working relationship. The point of the
  record is to keep the *next* update honest, not to litigate the last one.
  If the user is reaching for it to prove a point, hand back the facts and
  say plainly that's what it's good for and what it isn't.
- **Never reconstruct a communication that wasn't logged.** If there's no
  entry, the answer is "nothing recorded," not an inference from what
  probably got said.
- **Surface an unacknowledged revision even when it's inconvenient.** That
  is the entire job. An update that gets through this check unchanged
  should be the common case, not the goal.

## Also relevant

If check 1 fires, `stakeholder-translate` has the phrasing for a revision
-- lead with what moved, name the previous version. Hand the finding over
rather than rewriting the update here.
