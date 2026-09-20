# Postmortem Template

The single definition of the structure. If a required org format shows up,
edit this file -- `postmortem-writer` reads it rather than hardcoding
sections.

Written to `.claude/incidents/<slug>.md`.

```markdown
# Postmortem: [title]

**Date:** [incident date]  **Severity:** [sev]  **Services:** [list]
**Status:** [resolved date]

| | |
|---|---|
| Undetected | [detected_at minus start, or "unknown"] |
| Customer impact | [mitigated_at minus detected_at] |
| Time to full recovery | [resolved_at minus detected_at] |

## Summary
[Two or three sentences. What broke, what users saw, what fixed it. A
reader who stops here should still know what happened.]

## Impact
- **Who:** [affected users, how many]
- **What they experienced:** [concrete, not "degraded service"]
- **Duration:** [when impact started and stopped]
- **Data:** [loss, corruption, or backfill needed -- state "none" explicitly]

## Timeline
| Time | What happened |
|---|---|
| [HH:MM] | [entry] |
[Mark estimated times as estimates.]

## Root cause
### [one-line statement] — `[category]`
[A paragraph on the system or process gap. No names.]

## Contributing factors
- **[factor]** — `[category]`. [What it made worse or longer.]
(If none: "None identified beyond the root cause.")

## What went well
- [Thing that worked, and why it existed -- so it doesn't get removed.]
(If nothing: say so in one line.)

## Action items
| Item | Addresses | Owner | Due | Status |
|---|---|---|---|---|
| [removes the possibility, not "be careful"] | [root cause or factor] | [name] | [date] | open |
```

## Worked example

```markdown
# Postmortem: Checkout unavailable for 43 minutes

**Date:** 2026-09-19  **Severity:** sev2  **Services:** checkout, payments
**Status:** resolved 2026-09-19 15:20 UTC

| | |
|---|---|
| Undetected | 14 minutes (est. start 13:58, alert 14:12) |
| Customer impact | 29 minutes (14:12 to 14:41) |
| Time to full recovery | 68 minutes |

## Summary
A payments deploy at 13:52 introduced a timeout in the checkout path.
Checkout returned 5xx for roughly 43 minutes. A rollback of the payments
deploy restored service, and 1,204 queued checkout jobs were replayed.

## Impact
- **Who:** all users attempting checkout, roughly 2,900 sessions
- **What they experienced:** checkout returned an error page; payment was
  not taken
- **Duration:** 13:58 to 14:41 UTC
- **Data:** no loss. 1,204 jobs queued and replayed successfully by 15:20.

## Timeline
| Time | What happened |
|---|---|
| 13:52 | Payments deploy goes out |
| 13:58 (est.) | First customer report in #support |
| 14:12 | PagerDuty alert on checkout 5xx rate |
| 14:19 | Payments on-call paged; traced to payments timeouts |
| 14:31 | Payments deploy rolled back |
| 14:41 | Checkout success rate back to baseline |
| 15:20 | 1,204 queued jobs replayed |

## Root cause
### Payments deploys reach production without a soak period or automated rollback — `change-management`
A change altering timeout behavior went from merge to full production in
under a minute, with no intermediate stage where the error rate would have
been visible against real traffic, and no automatic rollback on an error
budget breach. Any change with this shape could have produced this outcome.

## Contributing factors
- **Checkout 5xx alerting fires on a 15-minute window** — `alerting`. A
  customer reported the problem 14 minutes before the alert did.
- **No runbook entry for checkout errors originating in payments** —
  `runbook`. The first 7 minutes went to locating the right on-call.

## What went well
- The rollback took 10 minutes and was scripted, from work done in Q2.
- The job queue held every failed checkout, so no orders were lost. That
  durability was a deliberate choice made when the queue was introduced.

## Action items
| Item | Addresses | Owner | Due | Status |
|---|---|---|---|---|
| Add a 10-minute soak stage to the payments deploy pipeline | root cause | priya-n | 2026-10-03 | open |
| Alert on checkout 5xx over a 2-minute window | alerting factor | sam-okafor | 2026-09-26 | open |
| Add payments-timeout symptoms to the checkout runbook | runbook factor | jordan-lee | 2026-09-26 | open |
```

Note what the root cause does **not** say: who deployed. That person
appears nowhere in the document, and the action item removes the
possibility rather than asking anyone to take more care.
