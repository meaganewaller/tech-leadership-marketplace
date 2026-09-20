# Plan Template

The plan is a **shareable artifact**. Write it so it can be pasted into a
kickoff doc or a ticket without disclosing anything from a 1:1.

```markdown
# Delegation Plan: [project]
**Date:** [today]  **Chunks:** [n]  **Roster updated:** [date, or "stale -- [n] days old"]

## Assignments
| # | Chunk | Level | Owner | Why | Depends on |
|---|---|---|---|---|---|
| 1 | [chunk] | [1-4] | [name] | [skill fit / growth fit / workload fit] — [one line] | — |

## Stretch assignments
- [name] — chunk [n]. [What support they'll need, and from whom.]
(If none: "None. Every chunk went to someone already at level.")

## Unmatched
### [chunk] (level [n])
Nobody on the roster is at level [n] or [n-1] with capacity.
**Options:** [pair X and Y / split further / outside help / you take it]
(If none: omit this section.)

## Distribution note
[Stretch assignments across recent plans, if log.json has enough history.
A statement about the distribution, never about a person.]
```

## What stays out of the plan

- Any quote, paraphrase, or attribution of a 1:1 growth note
- That 1:1 data was consulted at all
- Anything about a person other than their stated level and load

Growth-fit rationale reads `growth fit` and a line about the work -- not
about what the person wants.

## The separate in-session note

After presenting the plan, tell the **user** (not the document):

```markdown
Heads up before you share this: [name] ranked up on chunk [n] partly from
growth notes logged in one-on-one-prep. The plan doesn't say so, but you
may want to confirm they still want that kind of work before it lands as an
assignment.
```

Omit this entirely when no 1:1 data was used.

## Worked example

```markdown
# Delegation Plan: Add SSO to the admin app
**Date:** 2026-09-19  **Chunks:** 5  **Roster updated:** 2026-09-16

## Assignments
| # | Chunk | Level | Owner | Why | Depends on |
|---|---|---|---|---|---|
| 1 | SSO provider config and env plumbing | 1 | Sam | workload fit — light load, and it unblocks chunk 2 | — |
| 2 | Session handling for SSO logins | 3 | Priya | skill fit — level 3 in auth | 1 |
| 3 | Map provider groups to our roles | 4 | — | unmatched | — |
| 4 | Admin UI for the login flow | 2 | Jordan | growth fit — level 1 in frontend, one step up with review | 2 |
| 5 | Migration for existing password users | 3 | Priya | skill fit — level 3, and owns chunk 2's session model | 2 |

## Stretch assignments
- Jordan — chunk 4. Review from Priya on the form patterns; Jordan's load is
  normal, so there's room to learn in it.

## Unmatched
### Map provider groups to our roles (level 4)
Nobody on the roster is at level 4 in auth, and the one level-3 (Priya)
already owns two chunks.
**Options:** you decide the mapping and hand chunk 3 down as level 2; or
Priya takes it and chunk 5 moves to next sprint; or pair Priya and Sam on
the decision.

## Distribution note
Jordan has taken 3 of the last 4 stretch assignments logged. Sam is level 2
in backend and hasn't had one — chunk 2 would have been a stretch fit for
Sam if Priya weren't already on the session model.
```

Note what the example does: chunk 3 is left unowned with options rather
than forced onto Priya, and the distribution note names a pattern without
characterizing anyone. Both are the format working as intended.
