# Trends Report Template

```markdown
## Design Doc Gaps: [repo or team]
**Docs reviewed:** [n] between [date] and [date]

### Recurring gaps
| Category | Docs | Severity mix | Appeared in |
|---|---|---|---|
| [category] | [n] | [e.g. 1 blocking, 2 should-address] | [doc titles] |

[One line naming the category that recurs most, or "Nothing recurs yet."]

### Worth acting on
- **[Category]** appeared in [n] of [n] docs. [Whether this reads as a
  template gap or a checklist item the team has outgrown, and the specific
  change to make.]

### Not enough data
[Which analyses were skipped and why. Omit when all ran.]
```

## Worked example

```markdown
## Design Doc Gaps: acme/platform
**Docs reviewed:** 6 between 2026-06-02 and 2026-09-20

### Recurring gaps
| Category | Docs | Severity mix | Appeared in |
|---|---|---|---|
| Failure modes | 4 | 1 blocking, 3 should-address | Notifications, Redis sessions, Export v2, Webhooks |
| Rollout and rollback | 3 | 2 blocking, 1 should-address | Redis sessions, Export v2, Billing migration |
| Alternatives considered | 3 | 3 nice-to-have | Notifications, Webhooks, Search rebuild |
| Cost | 2 | 2 nice-to-have | Search rebuild, Export v2 |

`Failure modes` is missing from four of six docs, and three of those four
were T2 changes where the checklist requires it.

### Worth acting on
- **Failure modes** appeared in 4 of 6 docs, 3 of them T2. The checklist
  already requires it for T2, so this isn't a checklist gap -- authors
  aren't being prompted. The doc template has no failure-modes heading.
  Adding one is the fix.
- **Rollout and rollback** appeared in 3 of 6, twice as blocking. Same
  template problem, higher stakes: both blocking instances were data
  migrations where the point of no return wasn't written down.
- **Alternatives considered** appeared in 3 of 6 but every instance was
  nice-to-have, and all three docs were T1 changes that were small and
  reversible. This is the opposite problem -- the checklist requires
  alternatives on every doc and reviews keep raising it on docs where it
  doesn't earn its place. Worth moving to T2, or marking not required.

### Not enough data
None -- all analyses ran.
```

What the example is doing:

- **It separates the two causes.** `Failure modes` and `Alternatives
  considered` both recur three or four times, and the right response is
  opposite in each case: add a template section for one, relax the
  checklist for the other. A report that just ranked frequency would treat
  them the same and get one of them wrong.
- **It uses severity and tier to tell them apart.** Recurring at
  nice-to-have on small reversible docs is the signature of a checklist
  asking too much. Recurring at blocking on migrations is the signature of
  a template that doesn't prompt for it.
- **Nothing anywhere names a person**, including the doc whose review
  produced two blocking findings.
