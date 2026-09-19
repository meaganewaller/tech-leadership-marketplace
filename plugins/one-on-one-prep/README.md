# One-on-One Prep

Prepares for 1:1s with direct reports by pulling recent PR/ticket activity
and prior 1:1 history into talking points that go beyond "what did you work
on this week" -- then logs what was actually discussed so nothing raised in
a 1:1 quietly gets dropped.

## What's in this plugin

- **`skills/one-on-one-prep`** -- the core skill. Pulls recent activity and
  prior history for a person, produces a short prep doc with talking points
  and things worth asking about (not conclusions).
- **`skills/one-on-one-log`** -- logs topics discussed, follow-ups
  (open/closed), and self-stated growth notes after a 1:1.
- **`skills/one-on-one-history`** -- surfaces stale follow-ups, recurring
  topics, and stated growth trajectory across a person's history.

## Using it

- "Prep for my 1:1 with Jordan" -- pulls activity + history, produces the
  prep doc
- "Log my 1:1 with Jordan -- we talked about the auth refactor, and Jordan
  wants to lead the next design review" -- logs the session
- "What keeps coming up with Jordan?" / "What follow-ups are still open for
  Jordan?" -- cross-session summary

## Where your data lives -- read this before installing

Per-person notes are stored at `~/.tech-leadership/one-on-ones/<person-slug>.json`,
**outside this plugin's own installed folder, on purpose.** 1:1 notes are
personal and sometimes sensitive information about specific people you
manage. They must never end up:

- Committed into a shared marketplace repo
- Copied alongside shareable skill content into a team's `.github/skills/`,
  a Gemini extension, or `~/.codex/skills/` the way this plugin's actual
  instructions are
- Compared or shared across different reports

If you use any adapter in this marketplace to install this plugin into
another tool, only the skill *instructions* travel with it -- the data
directory is created fresh, locally, wherever that tool runs, and stays
private to whoever is running it.

## Design principle: facts over inference

Every skill in this plugin is written to log and surface what was actually
said or observed -- never to infer mood, engagement, motivation, or
performance. If you tell it something interpretive ("I think Jordan's
burned out"), it logs whatever factual support you give and leaves the
interpretation out of the stored record. That judgment stays yours.

## Known limitations (v0.1.0)

- No git/ticket connector bundled -- if one isn't connected in your session,
  it'll ask you to describe recent activity instead of pulling it
  automatically.
- No cleanup or archiving step for the per-person JSON files yet -- prune
  manually if a file gets large.
- Doesn't handle skip-levels or peer 1:1s differently from direct reports --
  treat those as a plain per-person history if you use it that way.
