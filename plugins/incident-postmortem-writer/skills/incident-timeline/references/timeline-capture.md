# Timeline Capture

## Incident record

Stored in `.claude/incidents/index.json` under `incidents`. Created by
`incident-timeline`, completed by `postmortem-writer`.

```json
{
  "id": "inc-001",
  "slug": "2026-09-19-checkout-unavailable",
  "title": "Checkout unavailable for 43 minutes",
  "severity": "sev2",
  "status": "active",
  "services": ["checkout", "payments"],
  "detected_at": "2026-09-19T14:12:00Z",
  "mitigated_at": null,
  "resolved_at": null,
  "timeline": [],
  "postmortem": null
}
```

| Field | Notes |
|---|---|
| `id` | `inc-NNN`, assigned in order, never reused. |
| `slug` | `YYYY-MM-DD-short-description`. Also the postmortem filename. |
| `severity` | Whatever vocabulary the team uses (`sev1`-`sev3`, `p1`-`p3`). Stay consistent within a repo -- `incident-history` groups on it. |
| `status` | `active`, `resolved`, or `postmortem_written`. |
| `services` | Affected services. `incident-history` groups on these to find repeat offenders, so keep the names consistent. |
| `detected_at` | When it became *known*, not when it started. Those differ and the gap is often the finding. |
| `mitigated_at` | When customer impact stopped. |
| `resolved_at` | Full recovery including cleanup and backfill. |
| `postmortem` | Relative path to the written document, once it exists. |

## Timeline entry

```json
{
  "at": "2026-09-19T14:12:00Z",
  "kind": "detection",
  "what": "PagerDuty alert: checkout 5xx rate above threshold",
  "who": "priya-n",
  "recorded_at": null
}
```

| Field | Notes |
|---|---|
| `at` | When it happened. |
| `kind` | `detection`, `escalation`, `action`, `mitigation`, `resolution`, or `note`. |
| `what` | One line. What happened, factually. |
| `who` | Optional. Who did it or was paged. A fact, never a verdict. |
| `recorded_at` | Set only when the entry was written well after the fact and `at` is a reconstruction. |

## Retroactive entries

During a live incident, `at` is now and `recorded_at` stays null.

When someone reconstructs a timeline afterward, `at` is their best estimate
and `recorded_at` is when it was written down. Keep this distinction:
a postmortem that says "alerting didn't fire for 20 minutes" rests on
whether that 20 minutes was measured or remembered, and a reader deserves
to know which.

If an estimate is genuinely uncertain, say so in `what` -- "roughly 14:30,
per Sam's recollection" -- rather than recording a precise-looking
timestamp nobody actually observed.

## Three timestamps that matter most

The rest of the timeline is context for these:

- **detected_at minus actual start** -- how long it ran unnoticed. Usually an
  alerting or monitoring gap.
- **mitigated_at minus detected_at** -- how long customers were affected once
  it was known. Usually a runbook, ownership, or access gap.
- **resolved_at minus mitigated_at** -- cleanup. Usually where hidden data
  problems live.

`postmortem-writer` computes and presents all three. Capture enough during
the incident that they can be computed honestly afterward.

## Worked example

```json
"timeline": [
  { "at": "2026-09-19T14:12:00Z", "kind": "detection", "what": "PagerDuty alert: checkout 5xx above threshold", "who": "priya-n", "recorded_at": null },
  { "at": "2026-09-19T14:14:00Z", "kind": "note", "what": "First customer report in #support, timestamped 13:58 -- 14 minutes before the alert", "who": null, "recorded_at": null },
  { "at": "2026-09-19T14:19:00Z", "kind": "escalation", "what": "Paged payments on-call; checkout errors traced to payments timeouts", "who": "sam-okafor", "recorded_at": null },
  { "at": "2026-09-19T14:31:00Z", "kind": "action", "what": "Rolled back payments deploy from 13:52", "who": "sam-okafor", "recorded_at": null },
  { "at": "2026-09-19T14:41:00Z", "kind": "mitigation", "what": "Checkout success rate back to baseline", "who": null, "recorded_at": null },
  { "at": "2026-09-19T15:20:00Z", "kind": "resolution", "what": "Replayed 1,204 failed checkout jobs from the queue", "who": "priya-n", "recorded_at": null }
]
```

The second entry is the valuable one: a customer noticed 14 minutes before
the alert did. Nobody would remember that an hour later, and it is very
likely the top action item.
