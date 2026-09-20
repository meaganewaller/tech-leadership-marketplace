# Design Doc Checklist

What a design doc needs to cover before it goes to the team. Edit this file
directly, or ask Claude (e.g. "we always require a cost estimate," "stop
asking about non-goals"). **Commit it** so everyone reviews against the
same list.

Two things worth knowing before you edit:

- **Removing an item is as legitimate as adding one.** Mark anything this
  team doesn't do as `not required` and reviews will stop raising it.
- **Tiers keep this usable.** `T1` items are checked on every doc; `T2`
  items only on docs proposing something hard to undo -- a migration, a
  new external dependency, anything touching stored data or another team's
  system. A checklist that demands everything of every doc gets ignored.

This file starts as a general default. It is meant to stop looking generic
within about three reviews.

## Required on every doc (T1)

- **Problem statement** -- what problem, who it affects, stated before the
  solution
- **Proposal** -- what is actually being built or changed
- **Alternatives considered** -- at least one a reasonable person would
  pick, with a real reason it lost ("do nothing" counts)
- **Ownership** -- who owns this after it ships, and who gets paged

## Required when the change is hard to undo (T2)

- **Failure modes and blast radius** -- what breaks when this breaks, who
  notices, how far it spreads
- **Rollout plan** -- how it ships and how each step is verified
- **Rollback plan** -- how to undo it, and where the point of no return is
  if there is one
- **Data and migration** -- what happens to existing data; whether the
  migration is reversible
- **Dependencies** -- what must exist first, and confirmation the owning
  team agreed

## Situational

Checked when the doc's subject matter calls for them.

- **Security and privacy** -- new data collected, who can reach it, new
  attack surface
- **Observability** -- the specific signal that says it's working, and what
  alerts when it isn't
- **Cost** -- when the design materially changes infrastructure or vendor
  spend
- **Testing strategy** -- how correctness is established beyond unit tests
- **Scope and non-goals** -- what this explicitly does not do
- **Open questions** -- what's still undecided, and who decides

## Not required by this team

Mark items here and reviews will stop flagging them. Give a reason -- it's
what stops someone re-adding it in six months.

- (nothing yet -- e.g. "Cost: not required, infra spend is reviewed
  separately in the quarterly budget" or "Non-goals: not required, our
  template doesn't have the section")

## Team-specific requirements

Things the defaults don't cover.

- (nothing yet -- e.g. "Any doc touching billing needs a named reviewer
  from finance" or "Docs proposing a new service need an entry in the
  service catalog before review")
