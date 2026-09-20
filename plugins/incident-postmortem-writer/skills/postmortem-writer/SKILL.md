---
name: postmortem-writer
description: >
  Turns a captured incident timeline, or one described after the fact, into
  a full blameless postmortem -- summary, impact, timeline, root cause and
  contributing factors, what went well, and action items with owners and
  due dates. Use this skill when the user says "write the postmortem," "we
  need a postmortem for yesterday's outage," "do the incident writeup,"
  "what were the root causes," "draft the retro doc for the incident," or
  runs "/incident postmortem". Offer it once an incident is resolved, but
  let the user choose when.
---

# Postmortem Writer

## The job

Produce a document the team can read and learn from, whose root causes
point at systems and processes rather than at people. Blameless is a
constraint on the output, not a tone applied afterward.

## Inputs

1. **The incident record** in `.claude/incidents/index.json`, if
   `incident-timeline` captured one. Use it as the spine.
2. **What the user describes**, for an incident nobody captured live. This
   is common and fine -- reconstruct the timeline first, marking estimated
   timestamps as estimates (see `incident-timeline`'s schema rules).
3. **Impact information**: how many users, for how long, what they
   experienced. Ask if it isn't given; impact is what makes the rest of the
   document worth anyone's time.

## Where output goes

- The document: `.claude/incidents/<slug>.md` in the affected service's
  repository.
- The record: the incident's entry in `.claude/incidents/index.json`, with
  root causes, contributing factors, and action items filled in and
  `status` set to `postmortem_written`.

The structured record is what `incident-history` reads. Writing only the
Markdown leaves the pattern analysis blind, so always do both.

## The blameless rule

**Root causes are system and process gaps. Always.**

Even when a specific person's action is in the causal chain, the root cause
is what allowed that action to have that consequence:

| Not this | This |
|---|---|
| Sam pushed a bad config | Config changes deploy to prod with no staging soak and no automated rollback |
| Priya missed the alert | Alerts route to a channel nobody is required to watch outside business hours |
| Nobody knew who owned the service | Service ownership isn't recorded anywhere the on-call can reach during an incident |

The test: **if a different person had been on shift that day, would this
still have been possible?** If yes, you have found the system gap. If your
answer depends on who it was, keep going -- you haven't reached the root
cause yet.

`references/blameless-reframing.md` has the full reframing patterns,
including the harder cases where the user pushes back.

### When the user writes blame

Reframe it before recording, and say plainly what you did once:

> You described this as Sam pushing a bad config. I've recorded the action
> factually in the timeline and framed the cause as the missing staging
> soak, since that's what made a single push able to take checkout down.

Then continue. Say it once per postmortem, not per instance -- repeating it
becomes a lecture, and the user already agreed to the format by using this
skill.

If the user insists on naming someone as the cause, record the systemic
framing and tell them the document keeps it that way. This is the one place
this plugin doesn't follow an instruction, and the reason is that a
postmortem naming a culprit stops people reporting incidents, which costs
far more than any single outage.

### Names in the document

Names belong in the timeline and in action item owners -- who was paged,
who ran the failover, who is following up. Those are facts and they are
useful.

Names never appear in root causes or contributing factors.

## Root cause categories

Every root cause gets a category, from the fixed list in
`references/blameless-reframing.md`: `alerting`, `monitoring`, `runbook`,
`ownership`, `change-management`, `configuration`, `capacity`,
`dependency`, `testing`, `design`.

**There is no category for human error**, by design. The vocabulary makes
blame unrepresentable rather than merely discouraged. If a cause doesn't
fit any category, that's a signal it hasn't been reframed yet.

`incident-history` groups on these, so the categories are also what turns
one incident into a pattern.

## Contributing factors

Things that made it worse or longer but didn't cause it: a stale runbook, a
holiday weekend, a dependency that was already degraded. Same blameless
framing, same categories.

Keeping these separate from root causes matters -- a postmortem that lists
nine root causes has found none.

## What went well

Not a morale section. Record the things that worked so they don't get
refactored away: a rollback that was fast because someone automated it last
quarter, an alert that did fire correctly, a runbook that held up.

If nothing went well, say so briefly rather than manufacturing something.

## Action items

Each one needs an owner and a due date, or it isn't an action item. Write
them against root causes and contributing factors -- an action item that
doesn't trace to one is usually somebody's unrelated wish.

Prefer items that remove the possibility over items that ask people to be
careful. "Add staging soak to the config pipeline" is an action item.
"Be more careful with config changes" is not, and `incident-history` will
show it never closing.

## Output

Follow `references/postmortem-template.md`. That file is the single place
the structure is defined -- if a required org format shows up later, edit
it there rather than changing this skill.

## Also relevant

After writing, mention `incident-history` if this incident's root cause
categories or services have come up before. Don't run it automatically.
