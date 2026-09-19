---
name: one-on-one-prep
description: >
  Prepares for an upcoming 1:1 with a direct report by pulling their recent
  PR/ticket activity and prior 1:1 history into a short prep doc with talking
  points that go beyond "what did you work on this week." Use this skill
  when the user says they have a 1:1 coming up, asks to "prep for my 1:1
  with [name]," "get ready to meet with [name]," "what should I talk to
  [name] about," or runs "/1-1 prep [name]". Always check for prior history
  on this person before writing talking points, so open follow-ups from
  last time aren't dropped.
---

# One-on-One Prep

Produce a short prep doc, not a script to read verbatim -- the point is to
walk in with real talking points instead of defaulting to status-update
questions.

## Where person history lives

Per-person notes live outside this skill's own folder, at
`~/.tech-leadership/one-on-ones/<person-slug>.json` (slug = lowercase name
with spaces as hyphens, e.g. `jordan-lee`). This is deliberate: 1:1 notes
are personal and sometimes sensitive, and must never end up inside a
shared/installable skill directory that could get copied into a team repo
or a marketplace. If this directory or file doesn't exist yet for a person,
treat them as new -- create it via the `one-on-one-log` skill's schema,
starting empty, rather than failing.

## Workflow

1. **Identify the person.** If ambiguous (multiple similarly-named reports),
   ask which one.

2. **Load prior history.** Read `~/.tech-leadership/one-on-ones/<slug>.json`
   if it exists. Pull:
   - Open (unresolved) follow-ups from past 1:1s
   - Recurring themes noted across multiple past 1:1s (see `one-on-one-history`
     skill for how themes are tagged)
   - The date and topics of the most recent 1:1, so this one doesn't
     retread the same ground from scratch

3. **Pull recent activity**, in this order of preference:
   - A connected git/PR tool (GitHub, GitLab, etc.) -- if available, pull
     this person's PRs opened/reviewed/merged and commit activity since the
     last 1:1's date (or the last ~1-2 weeks if no prior 1:1 exists)
   - A connected ticket/project tracker (Jira, Linear, etc.) -- tickets
     picked up, completed, or stalled in the same window
   - If neither connector is available, ask the user to paste or describe
     recent activity rather than guessing or skipping this section

4. **Look for signal, not just a list.** Don't just enumerate PRs and
   tickets -- look for things worth actually discussing:
   - A ticket that's been in progress much longer than similar ones (worth
     asking about, not assuming why)
   - A PR with an unusually large number of review rounds (could be a
     design misunderstanding worth walking through)
   - A stretch of small, safe tickets when this person usually takes on
     more (could be worth asking if they want more challenge, or if
     something's blocking them)
   - Report these as observations to ask about, never as conclusions.
     "Worth asking why X took a while" -- not "X seems disengaged."

5. **Write the prep doc** using the template in `references/prep-template.md`.

## What this skill does not do

- It does not infer mood, engagement, or motivation from activity data or
  from anything logged in past 1:1s. Silence in the data is not evidence of
  a problem -- it's a prompt to ask, not a conclusion to state.
- It does not rank or compare this person against other reports.
- It does not draft anything to be said word-for-word -- talking points are
  starting points for a real conversation, not a script.

See `references/prep-template.md` for the exact output format and a worked
example.
