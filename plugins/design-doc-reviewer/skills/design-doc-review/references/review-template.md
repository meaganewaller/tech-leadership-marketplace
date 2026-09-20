# Review Template

````markdown
# Design Doc Review: [doc title]
**Source:** [link, or "pasted text"]  **Reviewed:** [date]
**Checklist:** [`.claude/design-doc-checklist.md`, or "project default"]

## Understanding
[2-4 sentences: what the doc proposes, what problem it says it solves, and
what decision it is asking the reader to make. If this can't be written
from the doc, say so -- that is finding #1.]

## Findings Summary

| # | Section | Severity | Category | Summary |
|---|---------|----------|----------|---------|
| 1 | (absent) | Blocking | Rollout and rollback | No way back once the backfill starts |
| 2 | Alternatives | Should-address | Alternatives considered | Both alternatives dismissed without tradeoffs |

(If nothing was found, say that plainly instead of printing an empty table.)

## Finding Details

### #1 — [section or "(absent)"] [Severity / Category]
**Reasoning:** [why this gap matters for the review -- what the team can't
evaluate, or what happens later because it isn't written down. If history
shows this category recurring across the team's docs, say so here.]

**Draft question** (reword before raising):
> [1-3 sentences, phrased as a question to the author. The author may well
> have an answer that never made it into the doc.]

---
[repeat per finding, same order as the table]

## Design opinions (not gaps)
[Anything that is a view about the design rather than a hole in the
document. Clearly separated so the user can decide whether to raise it as
themselves. Omit the section entirely when there are none.]
````

## Worked example

````markdown
# Design Doc Review: Move session storage to Redis
**Source:** https://linear.app/acme/document/move-session-storage
**Reviewed:** 2026-09-20
**Checklist:** `.claude/design-doc-checklist.md`

## Understanding
Proposes moving user session storage out of Postgres into Redis to cut
login latency and reduce database load. Asks for approval to start in the
next sprint. The problem is stated up front with current p99 numbers.

## Findings Summary

| # | Section | Severity | Category | Summary |
|---|---------|----------|----------|---------|
| 1 | Migration | Blocking | Rollout and rollback | No stated way back after sessions are cut over |
| 2 | Alternatives | Should-address | Alternatives considered | Neither alternative has a stated advantage |
| 3 | (absent) | Should-address | Failure modes | Nothing on what happens when Redis is unavailable |
| 4 | (absent) | Nice-to-have | Ownership | No owner named for the new Redis instance |

## Finding Details

### #1 — Migration [Blocking / Rollout and rollback]
**Reasoning:** The doc describes cutting sessions over to Redis in one
step, and rollback is "revert the deploy." Once sessions are written to
Redis and not Postgres, reverting logs out every active user -- and if
Redis has already dropped keys under memory pressure, those sessions are
not recoverable from Postgres either. The team can't approve a migration
without knowing whether the point of no return is the deploy or the first
write.

**Draft question** (reword before raising):
> If we need to roll this back an hour after cutover, what happens to
> sessions created in that hour? Is there a window where we can still fall
> back to Postgres, or are we committed once the first session is written?

### #2 — Alternatives [Should-address / Alternatives considered]
**Reasoning:** Two alternatives are listed -- Memcached and "keep Postgres,
add an index" -- and each gets one sentence ending in why it's worse.
Neither has a stated advantage, so there's no tradeoff for the reader to
weigh. The Postgres option in particular is the cheapest thing on the list
and is dismissed in six words.

**Draft question** (reword before raising):
> What's the strongest case for just adding the index and staying on
> Postgres? Want to make sure we've given the cheap option a fair run
> before we take on a new piece of infrastructure.

### #3 — (absent) [Should-address / Failure modes]
**Reasoning:** Nothing in the doc covers Redis being unavailable. For
session storage that's the difference between degraded service and every
user being logged out simultaneously, and it determines whether this needs
replication, a fallback path, or neither. This is the third doc this
quarter with no failure-mode section -- worth raising as a template gap
rather than with this author.

**Draft question** (reword before raising):
> What's the behavior if Redis is down or unreachable -- do users get
> logged out, or do we fall back to Postgres? Worth writing down even if
> the answer is "accept the outage."

### #4 — (absent) [Nice-to-have / Ownership]
**Reasoning:** The doc says the auth team will build it but doesn't say who
runs the Redis instance afterward or who gets paged when it saturates.

**Draft question** (reword before raising):
> Who owns the Redis instance once this ships -- is that us, or does infra
> pick it up?

## Design opinions (not gaps)
Nothing about the design itself concerned me. Worth noting these are all
document gaps, not objections to moving sessions to Redis.
````

Note what the example does: every finding is about the document, every
draft is a question rather than a verdict, finding #3 names the recurrence
as a template problem rather than an author problem, and the design-opinion
section is explicitly empty rather than padded with second-guessing.
