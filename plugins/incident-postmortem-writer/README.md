# Incident Postmortem Writer

Structures a blameless postmortem fast, while details are still
recoverable -- and keeps it blameless in practice, not just in the title.

## What's in this plugin

- **`skills/incident-timeline`** -- fast capture during or right after an
  incident: detection, escalations, actions, mitigation, resolution, each
  timestamped. Built to be usable in a second window *while* the incident
  is running, by someone whose attention belongs elsewhere. One line per
  entry.
- **`skills/postmortem-writer`** -- the core skill. Turns a timeline plus
  impact information into a full postmortem: summary, impact, timeline,
  root cause and contributing factors, what went well, action items with
  owners and due dates.
- **`skills/incident-history`** -- patterns across incidents: root cause
  categories that recur, services that show up repeatedly, and action items
  that get created and never close.

## Using it

- "Start an incident -- checkout is down" / "We just rolled back" /
  "Mark it mitigated" -- the timeline, live
- "Write the postmortem for yesterday's outage" -- the document
- "Are we actually fixing these?" / "Incident review for the quarter" --
  the cross-incident report

## How blameless is enforced

Not by tone. By three structural choices.

**Root causes are system and process gaps, always.** Even when a specific
person's action is in the causal chain, the root cause is whatever allowed
that action to have that consequence:

| Not this | This |
|---|---|
| Sam pushed a bad config | Config changes reach prod with no staging soak and no automated rollback |
| Priya missed the alert | Alerts route to a channel with no paging outside business hours |

The test: **if a different person had been on shift, would this still have
been possible?** If your answer depends on who it was, you haven't reached
the root cause yet.

**There is no root cause category for human error.** Causes take a
category from a fixed list -- `alerting`, `monitoring`, `runbook`,
`ownership`, `change-management`, `configuration`, `capacity`,
`dependency`, `testing`, `design`. Blame isn't discouraged, it's
unrepresentable. A cause that fits no category hasn't been reframed yet.

**Names are allowed in some places and not others.** Timeline entries,
action item owners, and the "what went well" section: yes, those are facts
and often worth recording. Root causes and contributing factors: never.
The asymmetry is deliberate -- naming someone for good work costs nothing,
naming them for a failure costs the next incident report.

If you describe something in blaming language, the skill reframes it to the
systemic gap and tells you once what it did. If you insist on naming
someone as the cause, it records the systemic framing anyway. That's the
one place this plugin won't follow an instruction, and the reason is that a
postmortem naming a culprit stops people reporting incidents at all.

## Where your data lives

`.claude/incidents/` in the repository for the affected service:

- `<slug>.md` -- the postmortem document
- `index.json` -- structured records that `incident-history` reads

Unlike `one-on-one-prep`'s notes, this is operational team data rather than
personal information, so it belongs with the code and commits with it --
the team is supposed to read these.

It is deliberately **not** inside this plugin's own folder. Installed
plugins are cached per version (`.../incident-postmortem-writer/0.1.0/`),
so the first release bump would create a fresh empty directory and orphan
every incident written under the previous version -- which is exactly the
history `incident-history` exists to read.

Always write both the Markdown and the `index.json` record. Writing only
the document leaves the pattern analysis blind.

## Getting incident data in

`incident-timeline` prefers a connected paging tool (PagerDuty, Opsgenie)
for detection and escalation times, since those are the timestamps people
reconstruct worst. Failing that it parses a pasted alert or channel
excerpt, and failing that it takes what you say.

**No paging connector is wired up by default**, so in practice today the
second and third paths are the real ones. The skill says so once and then
stops mentioning it -- during an incident, a reminder every turn is noise.

## Design principle: the vocabulary does the work

Three plugins in this marketplace now share one idea. `tech-debt-log` has
no factor for "I dislike this code." `delegation-log` has no outcome
meaning "did badly." This plugin has no root cause category for human
error.

In each case the constraint lives in the data model rather than in advice,
because advice gets skipped under pressure and a missing enum value
doesn't.

## Known limitations (v0.1.0)

- No paging-tool connector bundled. Detection times come from what you
  paste or describe unless you connect one.
- Severity vocabulary is whatever you use; nothing validates it, and
  `incident-history` groups on the exact string, so stay consistent within
  a repo.
- Incidents spanning several services get recorded in one repo. There's no
  cross-repo rollup.
- `incident-history` needs roughly four written postmortems before the
  pattern analyses mean anything. It reports action item status and says so
  rather than drawing a trend through three points.
