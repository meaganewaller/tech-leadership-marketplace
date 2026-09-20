---
name: stakeholder-translate
description: >
  Rewrites a technical update -- a PR summary, an incident, an architecture
  decision, a sprint status -- for a specific non-technical audience,
  reframing it around business impact, risk, timeline, and cost. Use this
  skill when the user says "explain this to [name]," "rewrite this for the
  exec team," "how do I tell [name] about this," "make this non-technical,"
  "translate this for leadership," "turn this into a status update," "draft
  the customer-facing version," or runs "/stakeholder translate". Check for
  a saved profile on the named stakeholder first, and check what they were
  told last time before writing anything that revises it.
---

# Stakeholder Translate

The job is translation, not dilution. A translated update is one the reader
can act on correctly -- not merely a shorter update, and never a gentler
one. If the reader finishes it less able to make a good decision than
someone who read the original, the rewrite failed, however well it reads.

## What may change, and what may not

| Free to change | Must survive intact |
|---|---|
| Vocabulary -- jargon, acronyms, system and tool names | **Severity.** A serious problem reads as serious. |
| Structure -- what leads, what's grouped, what's cut | **Uncertainty.** A maybe stays a maybe. |
| Length, in either direction | **Numbers and dates**, exactly as given. |
| Framing -- impact and risk instead of implementation | **Commitments** -- never add one nobody made. |
| Level of detail | **Caveats that would change a decision.** |

The failure mode this guards against is the one that feels like good
editing. A hedge looks like clutter, a range looks vague, a caveat
interrupts the flow -- so they get tidied away, and the update reads better
while saying something the source did not. Every item in the right-hand
column is there because cutting it improves the prose and corrupts the
substance in the same stroke.

## Where stakeholder profiles live

`~/.tech-leadership/stakeholders/<slug>.json` -- **outside this plugin's
installed folder, deliberately.** These files describe specific people and
must never be committed to a shared repo, or copied alongside shareable
skill content into a team's `.github/skills/`, a Gemini extension, or
`~/.codex/skills/` the way this plugin's instructions are. Same reasoning
and the same directory root as `one-on-one-prep`'s per-person notes.

A missing profile is normal -- see "When there's no profile" below. Never
fail on it, and never invent one.

## Workflow

1. **Identify the audience** -- a named person, or a group ("the exec
   team," "the board," "customers"). If the user hasn't said, ask.
   Audience changes the output more than any other input, and a generic
   "non-technical" rewrite is the vague one nobody can use.

2. **Load the profile**, if one exists. `fluency` sets the vocabulary,
   `cares_about` and `leads_with` set what goes first, `format` picks the
   shape. No profile is fine -- see below.

3. **Check history before revising anything.** Run the check in
   `stakeholder-history` whenever this update moves a date, a scope, or a
   status this person already has -- see "Revisions" below.

4. **Find the decision.** What does this reader have to do with it: approve
   something, fund something, answer for it in a meeting, or simply not be
   blindsided later? Write to that. An update with no decision behind it is
   a status ping, and should be one line.

5. **Reframe** implementation into consequence (next section).

6. **Run the careful-topics pass** whenever the content touches security,
   money, customers, or dates -- `references/careful-topics.md`. Not
   optional, and not a matter of style: it is where translated updates do
   real damage.

7. **Write it in the shape it's going out in.** Templates for chat, email,
   written doc, and spoken talking points are in
   `references/output-formats.md`, with one update rendered all four ways.

8. **Hand back a cut list** ("Show your work" below).

## Reframing: implementation into consequence

Business impact means one of five things -- **money** (incurred, avoided,
at risk), **customers** (who, how many, how badly), **time** (what slips,
what speeds up), **risk** (what could go wrong, how likely, how bad), or
**capacity** (what the team can't take on because of it). If you can't name
which one, you haven't finished translating: say so and ask, rather than
shipping "improves reliability," which is filler that reads like substance.

Worked before-and-after pairs for the update types this skill sees most --
a shipped change, an incident, an architecture decision, a sprint status --
are in `references/reframing-moves.md`, along with the rewrites that look
right and aren't.

**Never invent the impact.** If the source doesn't say how many customers
were hit or what it cost, don't supply a number to make the sentence land.
Name the shape of it ("customers checking out during peak hours"), mark the
unknown explicitly, and ask the user if they know. A fabricated figure is
the most damaging thing this skill could produce, because it is exactly the
part that gets quoted onward.

## Revisions: when this contradicts the last update

If this update changes something the stakeholder was already told, the
change is the news. Lead with it, name the previous version, and say what
moved:

> Last month I said this would land in October. It's now looking like
> early December -- the vendor migration took four weeks longer than
> their estimate.

Not: "This is on track for early December." That sentence is true, reads
well, and is how somebody finds out in a board meeting that the date moved.

## When there's no profile

Ask two or three questions, not a survey:

- How technical is this person -- can they read "API" and "database," or
  does it need to be "the system that stores orders"?
- What do they own, and what decision is this feeding?
- Where is this going -- chat, email, a written doc, or said out loud?

Then write the update, and offer once to save the answers via
`stakeholder-profile` so the next one doesn't start from zero.

**Never infer fluency from a job title.** A CFO may have written firmware;
a VP of Product may not know what a queue is. A title tells you what
somebody owns, not what they understand. Guessing high and guessing low
both cost you -- over-explaining to a fluent reader reads as condescension,
and that gets paid for on every update after this one.

## Show your work

End every rewrite with a short note **to the user, not part of the
message** -- what you cut and why:

```markdown
---
Cut from the original: the rollback mechanics, the name of the library,
the two paragraphs on why the first fix didn't work.
Kept deliberately: that the root cause is still unconfirmed.
```

This is the check on everything above. Cutting detail for length is the
whole point of the skill; cutting a caveat because it complicated a clean
paragraph is the thing to catch -- and far easier to catch in a three-line
list than inside finished prose.

## What this skill does not do

- **It does not make bad news sound good.** Softening severity for an
  audience is not translating for them, it's managing them -- and it fails
  the moment they learn what was actually going on.
- **It does not decide what to withhold.** Cutting for length is a
  judgment it makes freely; cutting because something is inconvenient is
  not, and any real caveat that comes out gets named in the cut list.
- **It does not name individuals** in anything headed outside the team.
  Systems and decisions have names here; people don't.
- **It does not send anything.** It hands back text for the user to read,
  change, and send themselves.

## Also relevant

After a rewrite, offer `stakeholder-history` to record what was
communicated -- that record is what makes the next update's revision check
possible. Offer it rather than logging automatically: only the user knows
whether the draft went out as written.
