# Gap Categories

The default passes, used when the project has no
`.claude/design-doc-checklist.md`, and as the vocabulary for the
`category` field in the history log.

**The most common failure is not a missing section. It's a section that
exists and does no work.** A doc with an "Alternatives Considered" heading
over two strawmen has the heading a checklist looks for and none of the
thinking a reviewer needs. Each category below therefore lists what real
coverage looks like, what the gap looks like, and **the tell** -- how the
empty version reads.

## 1. Problem statement

**Covered:** The problem is stated before any solution, in terms of who is
affected and what it costs. A reader who disagrees with the proposal can
still tell what problem was being solved.

**Gap:** The doc opens with the solution. The problem is implied, or it's
stated as "we don't have X" -- which is a missing feature, not a problem.

**The tell:** You can't finish the sentence "this matters because ___"
from the doc alone. Also: the problem is defined as the absence of the
proposed solution, which makes the proposal true by construction and
unreviewable.

## 2. Alternatives considered

**Covered:** At least one alternative a reasonable person would actually
pick, described well enough that its advocate would recognize it, with a
stated reason it lost. "Do nothing" counts and is often the strongest one.

**Gap:** No alternatives, or only alternatives nobody proposed.

**The tell:** Every alternative is dismissed in one line, and none has a
real advantage listed. If the chosen option wins on every axis, the
alternatives weren't weighed -- they were staged. Ask what the chosen
approach is *worse* at; a design with no tradeoff listed usually has one
that hasn't been found yet.

## 3. Failure modes and blast radius

**Covered:** What breaks when this breaks, who notices, and how far it
spreads. Names the dependencies that can fail and what happens to callers
when they do.

**Gap:** Only the happy path. Errors are mentioned as "handle errors."

**The tell:** No sentence in the doc contains the word "fails," "times
out," "unavailable," or an equivalent. Or: failure is discussed for the
new component only, with nothing about what depends on it.

## 4. Rollout and rollback

**Covered:** How this ships (all at once, flagged, phased), how it's
verified at each step, and specifically **how to undo it** -- including
whether undo is still possible after data has been written or migrated.

**Gap:** A ship date with no plan. Or a rollout plan with no rollback.

**The tell:** The rollback section says "revert the PR." That works for
stateless code and not for anything that has changed data, published
events, or made a one-way change to a system somebody else depends on. If
the change is genuinely irreversible past a point, the doc should say where
that point is -- that's the sentence the review most needs.

## 5. Ownership

**Covered:** Who owns this after it ships -- named team or person -- and
who gets paged. Distinguishes who builds it from who maintains it, when
those differ.

**Gap:** No owner, or "the platform team" where no such team has agreed.

**The tell:** The doc names an owner who wasn't involved in writing it.
Worth a question rather than an assumption: they may not know.

## Secondary passes

Lighter-weight, flagged when the doc's subject matter calls for them.

| Category | Covered when | Typical gap |
|---|---|---|
| **Scope and non-goals** | States what this explicitly does *not* do | No non-goals, so scope creeps through the review itself |
| **Dependencies** | Names what must exist first, and who owns it | Assumes another team's timeline with no evidence they agreed |
| **Data and migration** | Says what happens to existing data, and whether the migration is reversible | Migration described as a single step with no dual-write, backfill, or verification |
| **Security and privacy** | Addresses new data collected, who can reach it, what the new attack surface is | Only mentioned if the doc is *about* security |
| **Observability** | Says how anyone will know it's working, and what alerts on it failing | "We'll add metrics" with no named signal |
| **Cost** | States the cost shape when the design changes it materially | Infrastructure cost never mentioned for a design that multiplies it |
| **Testing** | Says how correctness is established beyond unit tests | Testing strategy is "write tests" |
| **Open questions** | Lists what's still undecided and who decides it | No open questions listed on a genuinely early proposal, which usually means they're unstated rather than absent |

## Rules for all passes

- **Flag what the document supports, nothing more.** If a section is thin
  but present and adequate, it isn't a finding.
- **A short doc is not a gappy doc.** A two-page proposal for a small,
  reversible change may legitimately have no alternatives section and no
  rollback plan beyond "revert." Scale the expectations to the blast
  radius of what's being proposed, and say so when you do.
- **Don't flag the same underlying gap in three categories.** A doc with no
  failure analysis will trip failure modes, observability, and testing.
  Report the root gap once, at the severity it deserves, and mention the
  knock-on effects in its reasoning.
- **Never characterize the author.** Every finding is a statement about the
  document.
