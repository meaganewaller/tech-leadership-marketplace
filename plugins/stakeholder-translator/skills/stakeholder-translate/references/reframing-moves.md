# Reframing Moves

Before-and-after pairs by update type, plus the rewrites that look right
and aren't. The pattern in every one: the technical statement describes a
mechanism, and the translation describes what the mechanism does to
somebody.

## A shipped change or PR

| Technical | Translated |
|---|---|
| "Replaced the synchronous webhook dispatch with a queue." | "Partner integrations no longer slow down checkout when a partner's system is having a bad day." |
| "Added indexes to the orders table." | "The order history page loads in under a second now, down from eight." |
| "Refactored the billing module, no functional change." | "No visible change — this was cleanup that makes the next round of pricing work faster and less risky." |

That third one matters. Work with no user-visible outcome should say so
plainly rather than being dressed up. "Improved billing architecture" tells
a reader nothing and trains them to skim past everything you write.

## An incident

| Technical | Translated |
|---|---|
| "Cascading failure from a dependency timeout in the payments service." | "Payments went down for 40 minutes, which took checkout down with it. Customers couldn't complete orders during that window." |
| "Root cause was a missing null check introduced in last Tuesday's deploy." | "A bug shipped last Tuesday. It only triggered for a specific kind of order, which is why it took four days to surface." |
| "We've added alerting on the 5xx rate." | "We'd have caught this in minutes instead of hours. We didn't have that alarm before; we do now." |

Lead with the customer impact and the duration, then the cause. A reader
who gets the mechanism first spends the whole update waiting to find out
whether it mattered.

## An architecture decision

| Technical | Translated |
|---|---|
| "We're going with event sourcing for the ledger." | "We're building it so every balance change is permanently recorded and auditable. Slower to build, and the thing finance asked for." |
| "We'd rather not introduce a second message broker." | "Adding a second system here means another thing to run, monitor, and get paged for. The one we have is adequate." |
| "This couples us to their API contract." | "If they change how their service works, we have to change with them, on their schedule rather than ours." |

For a decision, the reader wants the tradeoff, not the choice. Name what
the alternative would have bought and what it would have cost -- an update
that presents one option as obviously correct reads as a decision already
made, which makes asking about it feel like second-guessing.

## A sprint or status update

| Technical | Translated |
|---|---|
| "Eight of twelve story points completed." | "Two of the three things we planned are done. The third slipped to next week." |
| "Blocked on the vendor's staging environment." | "We're waiting on the vendor. Nothing we can do to speed it up — I'll escalate on Thursday if it's still down." |
| "Carrying over the search work." | "Search didn't get started. We pulled that time onto the checkout bug instead, which I think was the right call." |

Velocity, points, and ticket counts are internal instruments. They measure
a team against its own past estimates and mean nothing outside that
context. Translate them into things and dates.

## Rewrites that look right and aren't

| Looks like translation | What's actually wrong |
|---|---|
| "We had a minor issue with data access." (from: an exposed bucket) | Severity gone. The reader now can't act on it. |
| "The fix will be done in about a month." (from: "two to six weeks") | A range became a point estimate. The uncertainty was the content. |
| "This will save us significant money." (from: no figure given) | An impact claim the source never made. Invented. |
| "We're still investigating, but it looks like it was a config error." (from: "cause unknown") | Speculation presented as a lead. Early in an incident, the first theory is usually wrong and always quoted. |
| "The team is working hard on it." | Says nothing. Filler like this is what gets skimmed, and it teaches the reader to skim the rest too. |
| "Jordan's deploy caused the outage." | Names an individual. See `careful-topics.md` -- systems and decisions have names, people don't. |

## The test

Read the rewrite back and ask: **could this reader now make the same
decision an engineer who read the original would make?**

Not "would they understand the words," and not "would they feel
reassured." If the answer is no, something in the right-hand column of the
skill's change table went missing -- go find it.
