---
name: stakeholder-profile
description: >
  Maintains what a specific stakeholder cares about, how technical they
  are, and how they prefer to receive updates, at
  ~/.tech-leadership/stakeholders/<slug>.json. Use this skill when the user
  says "set up a profile for [name]," "[name] always asks about cost,"
  "[name] prefers Slack," "[name] is more technical than I assumed,"
  "remember that [name] hates surprises on dates," "who do I have profiles
  for," or runs "/stakeholder profile [name]". Also use it when
  stakeholder-translate reports that no profile exists for a stakeholder
  the user just named.
---

# Stakeholder Profile

## Where data lives

`~/.tech-leadership/stakeholders/<slug>.json` (slug = lowercase name,
spaces as hyphens, e.g. `priya-nadar`) -- **outside this plugin's installed
folder, deliberately.**

This is information about specific people you work with, some of it
politically sensitive. It must never be committed to a shared marketplace
repo, or copied alongside shareable skill content into a team's
`.github/skills/`, a Gemini extension, or `~/.codex/skills/` the way this
plugin's instructions are. The adapters in this marketplace carry skill
*instructions* only; these files are created fresh, locally, wherever the
tool runs.

Same reasoning and the same directory root as `one-on-one-prep`'s
per-person notes and `delegation-assistant`'s roster.

`stakeholder-history` writes the `communications` array in this same file.
This skill owns everything else in it and should leave that key alone.

## The test every entry has to pass

**Write the profile as though the person will read it.**

They might. These files live on a laptop that gets screen-shared, and the
skill quotes them back to you in output. More to the point, the entries
that would embarrass you are the same ones that are wrong: judgments about
a person dressed up as communication preferences.

| Belongs in a profile | Does not |
|---|---|
| "Asks for a single number whenever given a range." | "Impatient." |
| "Reads the first line and replies; rarely opens the thread." | "Doesn't pay attention." |
| "Has said twice that they want to hear about risks early." | "Gets anxious." |
| "Wrote the original billing service." | "Actually knows what he's talking about, unlike most of them." |

The left column describes **how to communicate with someone**. The right
column describes what you think of them, and it has no effect on the
rewrite except to poison it.

## Fluency

`fluency` is the single field that changes output most. It records
**what vocabulary this person can read**, not how smart they are and not
how senior.

| Level | Meaning |
|---|---|
| 1 | Non-technical. System names have to be replaced with what they do. |
| 2 | Technically literate. Fine with "API," "database," "deploy." Not with architecture tradeoffs. |
| 3 | Technical, different domain. Reads code somewhere else; doesn't know this system. |
| 4 | Technical in this domain. Wants the detail; simplifying costs credibility. |

**Never infer this from a job title or from seniority.** Record what you
have actually seen the person read, write, or ask about. If you don't
know, leave it unset -- `stakeholder-translate` asks when fluency is
missing, which is the correct behavior, and a guessed 2 is indistinguishable
from an observed one once it's written down.

A single number is a simplification on purpose: someone can be a 4 on
infrastructure and a 1 on the ML pipeline. When that gap matters, put it in
`notes` rather than averaging it away.

## What they care about

`cares_about` holds what this person has actually asked about or acted on,
in their own framing -- "cost per customer," "the compliance audit in
March," "whether we can hire against this." Not a category you assigned
them, and not what you think somebody in their role ought to care about.

`leads_with` is narrower: the one thing that goes in the first line. Most
readers stop there, so this field does more work than its size suggests.

## Cadence and format

`format` is where updates to this person usually go -- `chat`, `email`,
`doc`, or `spoken`. `cadence` is how often they expect to hear from you,
and `avoid` is the short list of things that reliably go wrong with this
person:

> "Quotes the optimistic end of any range back to the board -- give a
> single date with a confidence rather than a range."

An `avoid` entry is a pattern you've observed more than once, phrased as a
consequence. It's the most valuable field in the file and the easiest to
turn into a grudge, so keep it to what happened and what to do about it.

## Workflow

1. Load the profile, or create it if this is first-time setup.
2. For setup, ask the small set that matters: how technical they are (with
   an example, not a self-report), what they consistently ask about, where
   updates go, and how often. Four questions, not an intake form -- a
   half-filled profile is useful and a stalled one isn't.
3. For an update, change only what the user names and leave the rest.
4. Set `updated` to today's date.
5. Confirm back what changed, so the user can correct it before it's saved.

Full field-by-field rules and a worked example are in
`references/profile-schema.md`.

## Groups

A recurring audience that isn't one person -- "the exec team," "the
board," "customers" -- gets a profile too, under its own slug. Fluency for
a group is the floor, not the average: write for the least technical person
who will read it, because they're the one who will act on a misreading.

## Also relevant

Once a profile exists, `stakeholder-translate` picks it up automatically.
If the user is setting one up in order to write something specific, offer
to do that next.
