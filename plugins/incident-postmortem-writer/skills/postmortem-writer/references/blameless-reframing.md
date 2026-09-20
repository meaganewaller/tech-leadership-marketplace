# Blameless Reframing

## Root cause categories

The fixed vocabulary. Every root cause and contributing factor takes one.

| Category | Covers |
|---|---|
| `alerting` | Didn't fire, fired late, fired to nobody, too noisy to notice |
| `monitoring` | The signal that would have shown it wasn't being collected |
| `runbook` | No procedure, wrong procedure, or one nobody could find |
| `ownership` | Unclear who owns the service, the decision, or the call to escalate |
| `change-management` | Deploy, rollback, review, or release process gaps |
| `configuration` | Config drift, unsafe defaults, no validation before apply |
| `capacity` | Limits, quotas, saturation, scaling that didn't happen |
| `dependency` | Upstream service, third party, or library behavior |
| `testing` | A gap in what gets verified before shipping |
| `design` | Architectural property that made the failure possible or wide |

**There is deliberately no `human_error` category.** The vocabulary makes
blame unrepresentable rather than merely discouraged, the same way
`delegation-log` has no outcome meaning "did badly" and `tech-debt-log`
has no factor for "I dislike this code." If a cause won't fit a category,
it hasn't been reframed yet -- that's the signal, not an argument for a
new category.

## The test

**If a different person had been on shift, would this still have been
possible?**

- Yes -> you've found the system gap.
- Your answer depends on who it was -> keep going, you're not there yet.

Applied honestly, this almost always terminates in a category above.

## Reframing patterns

| What the user says | What goes in the postmortem | Category |
|---|---|---|
| "Sam pushed a bad config" | Config changes reach prod with no staging soak and no automated rollback | `change-management` |
| "Priya missed the alert" | Alerts route to a channel with no paging outside business hours | `alerting` |
| "They should have checked the dashboard" | The saturation signal wasn't on any dashboard the on-call opens | `monitoring` |
| "Nobody knew who owned it" | Service ownership isn't recorded anywhere reachable during an incident | `ownership` |
| "The new person didn't know the procedure" | The runbook for this failure mode didn't exist | `runbook` |
| "Someone forgot to scale it up" | Scaling for the sale was manual with no checklist and no alert on headroom | `capacity` |
| "QA missed it" | No test covers the empty-cart path this touched | `testing` |
| "He was careless" | *Not reframeable as written.* Ask what the action was, then reframe the action. | — |

That last row matters: a characterization isn't a fact, so there's nothing
to reframe yet. Ask what was actually done, record that in the timeline,
and find what made it consequential.

## Harder cases

**The action really was avoidable.** Someone skipped a step they knew
about. The system question is still available and still better: why was
skipping possible, why was the step skippable under time pressure, what
made the pressure. A step that can be skipped when someone is in a hurry
will be skipped again by someone else.

**The user pushes back: "but it genuinely was their mistake."** Don't
argue the ethics. Say what a named cause costs: people stop reporting
incidents, and near-misses stop surfacing entirely, which is where the
cheap learning is. Then offer the systemic framing and move on. Agreement
isn't required -- the document keeps the framing either way.

**Malice or policy violation.** Out of scope for a postmortem. Record the
timeline factually and tell the user that's a management or security
matter, handled elsewhere. Don't write it up as a reliability finding and
don't editorialize.

**The person writing it is the person who acted.** Self-blame reads as
humility and produces the same bad document. "I broke it" gets the same
reframing as "Sam broke it" -- the system question doesn't change because
the answer is uncomfortable.

## Names

| Where | Allowed |
|---|---|
| Timeline entries | Yes -- who was paged, who ran the failover. Factual. |
| Action item owners | Yes -- somebody has to own it. |
| Summary | Only if unavoidable, and never as a cause. |
| Root causes | Never. |
| Contributing factors | Never. |
| What went well | Yes -- credit is fine, and worth giving. |

The asymmetry is deliberate. Naming someone for good work costs nothing;
naming them for a failure costs the next incident report.
