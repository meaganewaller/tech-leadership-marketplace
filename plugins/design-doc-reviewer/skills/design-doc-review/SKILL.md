---
name: design-doc-review
description: >
  Reviews a design doc, RFC, or technical proposal for structural and
  completeness gaps before it goes to the team -- unclear problem statement,
  alternatives never really weighed, missing failure modes and blast radius,
  no rollout or rollback plan, unnamed ownership. Produces a findings table
  with a draft question per gap. Use this skill when the user says "review
  this design doc," "check this RFC," "is this proposal ready to send,"
  "what's missing from this design," "poke holes in this before I share it,"
  or runs "/design-doc review". Check the team checklist first, and check
  history before calling a gap new.
---

# Design Doc Review

Produce a review document, not a rewritten doc and not line edits. The user
reads it, decides which gaps are real, rewords the questions in their own
voice, and raises them. **Nothing here gets sent or posted to anyone.**

## What this checks, and what it doesn't

This is a check for **whether the doc covers what a design review needs to
cover** -- not whether the design is good, and not whether the prose is
tight.

| In scope | Out of scope |
|---|---|
| Is the problem stated before the solution? | Whether the proposed solution is the right one |
| Were real alternatives weighed, with reasons? | Grammar, wording, formatting, house style |
| Are failure modes and blast radius addressed? | Whether the author is a good writer |
| Is there a rollout and a rollback plan? | Re-architecting the proposal for them |
| Is ownership named? | Approving or rejecting the design |

The distinction matters because the two get confused constantly. "I'd have
done this differently" is a design opinion and belongs in the review
conversation, from the user, as themselves. "This doesn't say what happens
if the migration fails halfway" is a gap in the document, and that is what
this skill finds.

When a genuine design concern surfaces while reading, don't suppress it --
hand it to the user separately, clearly labeled as an opinion about the
design rather than a gap in the doc, and let them decide whether to raise
it.

## Inputs

Accept any of:

- **Pasted text** -- the doc body, pasted directly
- **A link** -- fetch it if reachable this session; if it's behind auth,
  say so and ask for a paste rather than guessing at the contents
- **A Linear document** -- if the Linear connector is active, pull the
  document or project doc directly by link or search
- **A Google Doc** -- if the Google Drive connector is active and
  authenticated, read it directly; if it isn't, say the connector needs
  authenticating and fall back to a paste
- **A Claude document or artifact** -- read it directly when the user
  points at one

If the doc is long, read all of it before writing any finding. A gap
"found" in section 2 that section 7 actually covers is the fastest way to
lose the user's trust in the whole review.

## Workflow

1. **Load the checklist.** Read `.claude/design-doc-checklist.md` from the
   repo root (`git rev-parse --show-toplevel`, or the working directory
   outside a repo). It is the team's own list of what a design doc must
   cover. If it doesn't exist, use the default categories in
   `references/gap-categories.md` and mention that a project checklist can
   be created with `design-doc-checklist`.

   A checklist entry marked as not required for this team is not a gap.
   Don't flag it.

2. **Write the understanding.** Two to four sentences: what the doc
   proposes, what problem it says it solves, and what decision it is asking
   the reader to make. Put this first, and keep it short.

   If you can't write those sentences from the doc, that is itself the
   first and most important finding -- say so plainly, because a reviewer
   who can't tell what is being proposed can't review anything else.

3. **Run the gap passes** in `references/gap-categories.md`. Only flag what
   the doc's actual contents support. Do not manufacture a finding per
   category to make the table look thorough -- a doc that covers a category
   well gets no row, and a short clean doc should produce a short table.

4. **Check history.** If `.claude/design-doc-history.json` shows this gap
   category recurring across the team's recent docs, note it in that
   finding's reasoning -- a gap appearing for the fourth time is a template
   or checklist problem, not an author problem. See `design-doc-history`.

5. **Assign severity** per finding:

   | Severity | Meaning |
   |---|---|
   | **Blocking** | The team can't meaningfully review or approve without this. A reader cannot tell what is being decided, or the doc commits to something irreversible with no stated way back. |
   | **Should-address** | A real gap that will cause questions in the review or problems after it. The doc is reviewable without it, but worse. |
   | **Nice-to-have** | Would improve the doc. Safe to ship without. |

   Be honest with `Blocking` -- if everything is blocking, nothing is, and
   the author stops reading.

6. **Write the review** using `references/review-template.md`.

7. **Offer to log** the findings via `design-doc-history`. Offer; don't log
   automatically -- the user may discard findings they disagree with, and
   logging those would poison the recurrence data the checklist is built
   from.

## Draft questions, not verdicts

Every finding carries a **draft question the user will reword** before
raising it. Two rules about how those are written:

- **Ask, don't conclude.** "What happens if the backfill fails partway
  through?" -- not "The rollback plan is inadequate." The author may have
  an answer that never made it into the doc, and that is a different fix
  than a missing plan.
- **Never imply it has been or will be sent.** These are drafts for the
  user to say in their own voice. This skill posts nothing, comments
  nowhere, and never contacts the author.

## What this skill does not do

- **It does not rewrite the doc.** No suggested prose, no edited sections.
  Findings point at what's missing; the author writes it.
- **It does not approve or reject a design.** It reports gaps and hands
  back the judgment.
- **It does not assess the author.** A doc with many gaps is a doc with
  many gaps. Nothing in the output characterizes the person who wrote it,
  and the history log has no field for one -- see `design-doc-history`.
- **It does not send anything.**

## Also relevant

If a gap category keeps coming up across reviews, that's a signal the
team's doc template is missing a section -- `design-doc-history` surfaces
those, and `design-doc-checklist` is where the answer gets written down.
