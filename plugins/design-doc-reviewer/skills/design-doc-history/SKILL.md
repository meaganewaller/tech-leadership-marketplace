---
name: design-doc-history
description: >
  Logs the gap categories found in each design doc review into the project's
  .claude/design-doc-history.json and reports which gaps keep recurring
  across the team's docs -- surfacing candidates for a new checklist item or
  a missing section in the doc template. Use this skill after a
  design-doc-review run, or when the user asks "what do our design docs keep
  missing," "is this a recurring gap," "should we update our doc template,"
  "what keeps coming up in reviews," or runs "/design-doc history".
---

# Design Doc History

## Where it lives

`.claude/design-doc-history.json` in the repo the docs belong to. Resolve
it against the repo root (`git rev-parse --show-toplevel`), or the working
directory outside a git repo.

It lives in the project rather than in this plugin's directory because
plugin updates install each version into a fresh directory -- anything
saved inside the plugin is lost on the next release, which would be exactly
the history this skill exists to read.

Create it as an empty JSON array if it doesn't exist. Schema in
`references/history-schema.md`.

## There is no author field

**The schema has no place to record who wrote a doc, and that is
deliberate.**

The moment this log can answer "whose docs are missing rollback plans," it
stops being a tool for improving a template and becomes a tool for
evaluating people -- and the reviews feeding it get quietly gamed or
avoided. A team that learns their doc gaps are being tallied against them
writes docs that pass the checklist, not docs that help a reviewer.

So the constraint lives in the schema rather than in a rule somebody has
to remember under pressure. If the user asks for a per-author breakdown,
say plainly that the log doesn't carry that and why, and offer the
cross-team view instead. That's the same reason `incident-postmortem-writer`
has no root cause category for human error.

The file names documents and gap categories only, so it commits with the
repo like the checklist does.

## Logging (after a review)

`design-doc-review` offers to log; it never logs automatically, because the
user may have discarded findings they disagreed with and those would poison
the recurrence data.

Append one entry per finding the user kept, with the review's date, the
doc title, the gap category, and the severity. Use the category names from
`design-doc-review/references/gap-categories.md` or the team's
checklist -- consistency is what makes recurrence detectable at all, so
reuse an existing category name rather than coining a near-duplicate.

## Reporting

Output shape and a worked example are in
`references/trends-report-template.md`. Three things to surface:

1. **Recurring categories** -- a gap appearing across multiple docs, most
   frequent first, with the docs it appeared in. This is the main output.

2. **Checklist and template candidates.** A category recurring in three or
   more docs is usually one of two problems, and it's worth naming which:
   - The **doc template** is missing the section, so authors don't know to
     write it. Fix the template.
   - The **checklist asks for something the team has decided it doesn't
     do**, and reviews keep raising it anyway. Mark it not required in
     `design-doc-checklist`.

   Both are fixes to the system. Neither is a fix applied to a person.

3. **Severity mix** -- whether the recurring gaps are `Blocking` or mostly
   `Nice-to-have`. A category recurring at nice-to-have is a template
   nicety; the same category recurring at blocking means docs keep going
   out unreviewable in the same way.

## Rules

- **Say when the sample is too small.** Under about four reviewed docs,
  report the raw list and say the pattern analysis isn't meaningful yet.
  Two docs sharing a gap is a coincidence presented as a trend.
- **Report the records, not what they imply about the team.** "Failure
  modes missing in 4 of 6 docs" is a finding. "The team doesn't think
  about failure" is not.
- **Name the uncomfortable pattern plainly.** A trends report that only
  says encouraging things isn't worth running.
- **Never reconstruct history that wasn't logged.** No entries means
  "nothing recorded," not an inference from memory of past reviews.

## Also relevant

When a category recurs enough to act on, the action lands in
`design-doc-checklist` -- either as a new required item, a tier change, or
a removal. Offer to make that edit rather than leaving the finding as a
report nobody acts on.
