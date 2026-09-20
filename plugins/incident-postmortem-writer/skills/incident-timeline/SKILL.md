---
name: incident-timeline
description: >
  Captures an incident timeline fast -- detection, escalations, actions,
  mitigation, resolution -- each entry timestamped, short enough to write
  while the incident is still running. Use this skill when the user says
  "start an incident," "we're in an incident," "log this to the timeline,"
  "we just failed over," "mark it mitigated," "capture what happened,"
  "note that for the postmortem," or runs "/incident start" or
  "/incident log". Reach for it the moment an incident begins, not after --
  the details that matter are the ones nobody writes down later.
---

# Incident Timeline

## The job

Get facts on the record while they are still recoverable. An hour after
resolution, nobody remembers whether the alert fired before or after the
first customer report, and that ordering is usually the finding.

Entries are **terse**. This skill is meant to be usable in a second window
during an incident, by someone whose attention belongs elsewhere. One line
per entry. Prose comes later, in `postmortem-writer`.

## Where data lives

`.claude/incidents/index.json` in the repository for the affected service.

Incidents are operational team data: they belong with the code, commit with
it, and stay readable by everyone who works on the service. Deliberately
**not** inside this plugin's own folder -- installed plugins are cached per
version (`.../incident-postmortem-writer/0.1.0/`), so the first release bump
would orphan every incident written under the previous version, which is
exactly the history `incident-history` exists to read.

If the working directory isn't a repository, ask where to write rather than
guessing. Create the file and directory if they don't exist.

## Getting detection and escalation times

In order of preference:

1. **A connected paging tool** (PagerDuty, Opsgenie). If one is connected,
   pull alert fire time, acknowledgement, and escalation steps -- these are
   the timestamps humans reconstruct worst. Confirm what you pulled before
   recording it.
2. **A pasted alert or channel excerpt.** Parse timestamps out of it and
   ask about gaps.
3. **What the user says.** Normal during a live incident.

**No paging connector is available by default**, so assume 2 or 3 unless
one is actually present in the session. Say once that you're working from
what the user gives, then stop mentioning it -- during an incident, a
reminder every turn is noise.

## Entry kinds

| Kind | What it records |
|---|---|
| `detection` | How the incident became known. Alert, customer report, someone noticing. |
| `escalation` | Who was brought in, and when. |
| `action` | Something someone did. A rollback, a failover, a config change, a query run. |
| `mitigation` | The thing that stopped customer impact. |
| `resolution` | Full recovery, including any backfill or cleanup. |
| `note` | An observation worth keeping that isn't an action. |

Every entry gets a timestamp. If the user doesn't give one, use now, and
mark it as recorded-at rather than happened-at when they differ -- see
`references/timeline-capture.md` for the schema and the retroactive-entry
rules.

## Recording actions and names

Names go in an entry when they are a fact about what happened: who was
paged, who ran the failover, who to ask later. That is useful and not
blame.

What never goes in is framing that assigns fault. If the user types
"Sam broke prod with a bad config push," record the action -- `Sam pushed
config change X at 14:06` -- and drop the judgment. The causal question
belongs in the postmortem, and it is *what made it possible for that push
to take prod down*, not who pushed it.

Do this silently during a live incident. Reframe, record, move on. A
correction mid-incident is a lecture at the worst possible moment; the
reframing rules get applied properly in `postmortem-writer`, when there is
time to think.

## Workflow

1. **Starting**: create the incident record -- slug, title, severity if
   known, affected services. Severity and title can be rough; they get
   revised.
2. **During**: append entries as the user reports them. Keep
   acknowledgements to a few words so the flow doesn't cost attention.
3. **Mitigated**: record the mitigation entry and its time. This is the
   number that matters most for impact, so confirm it explicitly.
4. **Resolved**: record resolution, set the incident `status` to
   `resolved`.
5. Offer `postmortem-writer` once resolved -- but only offer. The user
   decides when they have the capacity for it.

## Also relevant

If the user starts describing root causes mid-incident, capture them as
`note` entries and say they'll be picked up properly in the postmortem.
Analysis during an incident is usually wrong and always a distraction.
