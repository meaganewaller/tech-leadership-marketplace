# Stakeholder Translator

Rewrites a technical update -- a PR summary, an incident, an architecture
decision, a sprint status -- for a specific non-technical audience,
reframing it around business impact, risk, timeline, and cost.

The point is translation, not dilution. Jargon goes; severity, uncertainty,
real numbers, and any caveat that would change a decision stay exactly as
they were.

## What's in this plugin

- **`skills/stakeholder-translate`** -- the core skill. Takes technical
  content plus a target audience and rewrites it for them, using their
  profile if one exists and asking two or three questions if it doesn't.
- **`skills/stakeholder-profile`** -- what a given stakeholder cares
  about, how technical they are, and where and how often they want
  updates.
- **`skills/stakeholder-history`** -- what's already been communicated to
  them, so a new update doesn't repeat itself and never silently
  contradicts the last one.

## Using it

- "Rewrite this incident summary for the exec team"
- "How do I explain this architecture decision to Priya?"
- "Turn this sprint update into something I can send to leadership"
- "Priya always asks about cost -- remember that"
- "What have I already told Priya about the payments migration?"
- "Am I about to contradict myself here?"

## Where your data lives -- read this before installing

Stakeholder profiles and communication logs are stored at
`~/.tech-leadership/stakeholders/<slug>.json`, **outside this plugin's own
installed folder, on purpose.** These files describe specific people --
how technical you think they are, what goes wrong when you communicate with
them, what you've told them and when. They must never end up:

- Committed into a shared marketplace repo
- Copied alongside shareable skill content into a team's `.github/skills/`,
  a Gemini extension, or `~/.codex/skills/` the way this plugin's actual
  instructions are
- Shared with the team, or with the stakeholder's own reports

If you use any adapter in this marketplace to install this plugin into
another tool, only the skill *instructions* travel with it -- the data
directory is created fresh, locally, wherever that tool runs, and stays
private to whoever is running it.

Same directory root and the same reasoning as `one-on-one-prep`'s
per-person notes and `delegation-assistant`'s roster.

## Design principle: the substance survives the rewrite

Every skill here is written against one failure mode, and it's the one that
feels like good editing. A hedge looks like clutter. A range looks vague.
A caveat interrupts the flow. Tidy all three away and the update reads
better while saying something the original didn't -- and the reader acts on
the version that isn't true.

So severity, uncertainty, numbers, dates, and decision-changing caveats are
fixed points. Vocabulary, structure, length, and framing are free. Every
rewrite ends with a short list of what was cut, handed back to you rather
than to the audience, because a caveat dropped for flow is much easier to
spot in a three-line list than inside finished prose.

A related principle in `stakeholder-profile`: **write a profile as though
the person will read it.** "Asks for a single number whenever given a
range" is a communication preference. "Impatient" is a judgment about
someone, and it makes the rewrite worse, not better.

## Known limitations (v0.1.0)

- No connectors bundled. It works on content you paste or point it at --
  it won't go fetch the PR, the incident channel, or the ticket itself.
- Profiles are per-person and hand-maintained. Nothing detects that
  somebody changed roles or got more technical; the file says what it said
  until you update it.
- The contradiction check only sees what's been logged. Anything you told a
  stakeholder verbally and never recorded is invisible to it, so the check
  is only as good as the logging habit behind it.
- No redaction pass. It won't catch a customer name, an unreleased
  product, or an internal codename inside content you hand it -- read
  anything customer-facing before it goes out.
- Group profiles ("the exec team") are a single fluency level written to
  the least technical reader. It doesn't produce per-person variants of one
  update.
