# History Report Template

```markdown
# Incident History
**Repo:** [repo]  **Date:** [today]
**Incidents:** [n] — [n] with postmortems · [n] still open

## Recurring root causes
| Category | As root cause | As contributing factor | Incidents |
|---|---|---|---|
| [category] | [n] | [n] | [ids] |

[One line naming the category that recurs most, or "No category recurs."]

## Action item follow-through
**Closed:** [n] of [n] ([n]%)
**Overdue:** [n]

| Item | From | Owner | Due | Days overdue |
|---|---|---|---|---|
| [item] | [inc-id] | [owner] | [date] | [n] |

[Call out any overdue item whose category has recurred since.]

## Service concentration
| Service | Incidents | Categories |
|---|---|---|
| [service] | [n] | [categories, or "varied"] |

## Detection gap
**Median time undetected:** [n] minutes across [n] incidents with an
estimated start.
[Whether it's shrinking, and how that squares with alerting action items.]

## Not enough data
[Which analyses were skipped and why. Omit if all ran.]
```

## Worked example

```markdown
# Incident History
**Repo:** meaganewaller/example-service  **Date:** 2026-12-01
**Incidents:** 7 — 6 with postmortems · 1 still open

## Recurring root causes
| Category | As root cause | As contributing factor | Incidents |
|---|---|---|---|
| change-management | 3 | 0 | inc-001, inc-004, inc-006 |
| alerting | 1 | 4 | inc-002, inc-001, inc-003, inc-005, inc-006 |
| runbook | 1 | 2 | inc-003, inc-001, inc-004 |

`change-management` is the root cause of three of six. `alerting` has been a
contributing factor in four incidents while causing only one -- it isn't
starting incidents, it's lengthening them.

## Action item follow-through
**Closed:** 4 of 13 (31%)
**Overdue:** 6

| Item | From | Owner | Due | Days overdue |
|---|---|---|---|---|
| Add soak stage to payments deploy pipeline | inc-001 | priya-n | 2026-10-03 | 59 |
| Alert on checkout 5xx over 2-minute window | inc-001 | sam-okafor | 2026-09-26 | 66 |
| Add rollback automation to the deploy job | inc-004 | priya-n | 2026-11-14 | 17 |

The soak-stage item has been overdue 59 days, and `change-management` has
since caused two more incidents (inc-004, inc-006). The postmortems found
the gap correctly; the fix hasn't shipped.

## Service concentration
| Service | Incidents | Categories |
|---|---|---|
| payments | 4 | change-management (3), capacity (1) |
| checkout | 2 | dependency (both, on payments) |
| search | 1 | capacity |

Both checkout incidents originated in payments. Checkout's record largely
reflects payments' deploy process rather than anything in checkout.

## Detection gap
**Median time undetected:** 11 minutes across 5 incidents with an estimated
start. Unchanged since the first three (12 minutes), while `alerting` action
items from inc-001 and inc-003 remain open.
```

Note what the example does: every finding is a statement about the records,
the strongest one pairs an overdue item with a recurring category, and
nothing anywhere characterizes a person -- including the owner who appears
on two overdue items.
