# Careful Topics

Four kinds of content where a translated update can do real damage, and the
rule for each. Run this pass on any rewrite that touches one of them.

What unites them: each has a rewrite that is *more readable, more
reassuring, and wrong*. That rewrite is the default one. These rules exist
to stop it.

## Security incidents

**Never soften severity to make an update easier to read.** If the honest
description is "an attacker could have read any customer's order history,"
that is the sentence. "A permissions issue affected some account data" is
the same event described so that nobody acts on it.

**Never state a cause, a scope, or an exposure that isn't confirmed** --
in either direction. "No customer data was accessed" and "customer data was
stolen" are both claims, and early in an incident you usually have evidence
for neither. Write what is known, and write the unknowns as unknowns:

> We know the misconfigured bucket was publicly reachable for about six
> hours. We do not yet know whether anyone accessed it -- we're pulling
> access logs now and expect an answer by Thursday.

**Say what is unknown explicitly**, rather than leaving a gap. A reader who
finds no mention of data exposure will assume there wasn't any, and an
omission that reads as reassurance is functionally a false statement.

**Legal, PR, and regulatory timing is not this skill's call.** If the
update is headed outside the company, say so plainly: a breach disclosure
has notification deadlines and wording requirements this skill knows
nothing about. Hand back a draft, flag it as needing that review, and don't
imply it's ready to send.

## Financial figures and cost

**Never introduce a number the source didn't contain.** Not an estimate,
not an order of magnitude, not "roughly." If the user hasn't said what the
outage cost, the rewrite doesn't say either.

**Never round or firm up a number in the direction that reads better.**
"$40-90k/year depending on traffic growth" does not become "about $90k" and
does not become "around $50k." A range is a statement about uncertainty,
and collapsing it deletes the statement.

**Keep the basis attached to every estimate.** A figure with no basis gets
quoted as fact the moment it leaves the room:

| Wrong | Right |
|---|---|
| "The migration saves about $200k." | "We estimate $200k/year saved, based on current instance costs -- which assumes traffic stays roughly flat." |
| "This costs three engineer-months." | "Three engineer-months is our estimate; we haven't scoped the data backfill yet, so that's the part likeliest to grow." |

**Distinguish the three things that get conflated:** money already spent,
money committed, and money at risk. Executives act very differently on
each, and "this is a $2M problem" hides which one it is.

## Anything customer-facing or quotable

Assume the rewrite gets forwarded verbatim, out of context, to somebody the
user didn't choose. Write it so that's survivable.

- **No internal blame and no named individuals.** Not the engineer, not the
  team, not the vendor's on-call. Systems, decisions, and processes have
  names in this register; people don't.
- **No commitment that hasn't actually been made.** "We're looking at
  supporting SSO" must not become "SSO is coming." If the user wants to
  make the commitment, they can -- but the rewrite doesn't make it on their
  behalf.
- **No speculation about other companies**, vendors, or customers.
- **Nothing that reads as an admission of liability** where none was
  stated. "We failed to protect customer data" is a legal sentence; if the
  source didn't say it, the rewrite doesn't introduce it.
- **Flag it when it's headed outside.** Say plainly that a customer-facing
  or press-facing draft usually needs support, legal, or comms eyes on it
  before it ships.

## Timelines and dates

**A hedged date stays hedged.** This is the most frequently broken rule in
the whole skill, because hedges are the first thing editing removes.

| The source said | Do not write | Write |
|---|---|---|
| "Probably late Q4, depends on the vendor." | "December." | "Late Q4, though it depends on the vendor's timeline -- which is the part we don't control." |
| "Two to six weeks." | "About a month." | "Two to six weeks. The spread is the data backfill; we'll know more after this week's test run." |
| "Should be done by Friday if nothing else breaks." | "Done Friday." | "On track for Friday, assuming nothing else comes up." |

**Uncertainty is the substance, not filler.** The reason a date is a range
is that somebody made a judgment about what they don't know. Collapsing the
range throws away the judgment and keeps only its most optimistic edge.

**Name what the date depends on.** A bare date invites planning against it;
a date with its dependency attached invites the right question instead.

**Never let a date drift upward silently between updates.** If last
month's "late Q4" has become "early December," say that it moved. See
"Revisions" in the skill body -- an unacknowledged slip is worse than the
slip.
