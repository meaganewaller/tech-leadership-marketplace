# Trends Report Template

```markdown
# Tech Debt Trends
**Repo:** [repo]  **Date:** [today]
**Register:** [n] items — [n] open · [n] scheduled · [n] resolved

## Where debt concentrates
| Area | Open | Resolved | Net |
|---|---|---|---|
| [area] | [n] | [n] | [+n or -n] |

[One line naming the area that accumulates fastest, or "No area stands out."]

## Quick-win follow-through
**Quick wins:** [n] resolved of [n] logged ([n]%)
**Everything else:** [n] resolved of [n] logged ([n]%)

[One line. If quick wins lag, say so directly and say what it suggests.]

## Age of open work
**Median age of open items:** [n] days
**Oldest open `Now`-tier items:**
- [id] [title] — [n] days open, tier [tier]

[If any Now item is older than ~90 days, name it as a finding.]

## Scoring drift
- [id] [title] — [factor] [old] → [new], [reason from rationale]
(If none: omit this section.)

## Not enough data
[Which analyses were skipped and why. Omit if all ran.]
```

## Worked example

```markdown
# Tech Debt Trends
**Repo:** meaganewaller/example-service  **Date:** 2026-11-02
**Register:** 14 items — 9 open · 2 scheduled · 3 resolved

## Where debt concentrates
| Area | Open | Resolved | Net |
|---|---|---|---|
| services/payments | 5 | 0 | +5 |
| services/auth | 2 | 2 | 0 |
| web/marketing | 2 | 1 | +1 |

Payments has accumulated five items and resolved none since the register
started. Every other area is roughly break-even.

## Quick-win follow-through
**Quick wins:** 1 resolved of 5 logged (20%)
**Everything else:** 2 resolved of 9 logged (22%)

Quick wins are not being picked up any faster than expensive work, despite
averaging under two days each. Four high-impact, low-effort items are
sitting open — that is roughly a week of work for the four combined.

## Age of open work
**Median age of open items:** 47 days
**Oldest open `Now`-tier items:**
- td-003 Payment retry logic silently drops failures — 118 days open, tier Now

td-003 has been tiered `Now` for four months. Either it isn't actually Now,
or the tier isn't driving what gets scheduled.

## Scoring drift
- td-002 Old templating engine — cost of delay 1 → 5, vendor announced EOL
  for 2027-06
```

Note the tone: every finding is a statement about the register, and the
sharpest one (`td-003`) offers two readings rather than assigning blame. The
question "either it isn't Now, or the tier isn't driving scheduling" is the
useful thing to put in front of a team -- both readings are actionable, and
neither is an accusation.
