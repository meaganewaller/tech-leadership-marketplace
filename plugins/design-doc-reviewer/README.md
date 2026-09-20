# Design Doc Reviewer

Checks a design doc, RFC, or technical proposal for structural and
completeness gaps before it goes to the team -- is the problem stated
before the solution, were real alternatives weighed, are failure modes and
blast radius addressed, is there a way back, is ownership named.

It is not a line edit and not a verdict on the design. It produces a
findings table and a draft question per gap, which you reword and raise
yourself.

## What's in this plugin

- **`skills/design-doc-review`** -- the core skill. Takes a doc (pasted,
  linked, or from Linear / Google Docs / Claude Docs when connected) and
  produces a review document: what the doc proposes, a findings table, and
  per-finding reasoning plus a draft question.
- **`skills/design-doc-checklist`** -- what this team requires a design doc
  to cover, and just as importantly what it has decided it doesn't.
- **`skills/design-doc-history`** -- which gap categories keep recurring
  across the team's docs, and whether that points at the doc template or at
  the checklist.

## Using it

- "Review this design doc before I send it to the team"
- "What's missing from this RFC?" / "Poke holes in this before I share it"
- "We always require a named reviewer from finance on billing docs"
- "Stop asking about non-goals, our template doesn't have that section"
- "What do our design docs keep missing?"

## Where your data lives

Two files, both in the repo the design docs belong to:

- `.claude/design-doc-checklist.md` -- the team's checklist
- `.claude/design-doc-history.json` -- gap categories found per review

Both are meant to be **committed**. The checklist is a team agreement, and
changing it should be a reviewable diff rather than a private setting; the
history is what tells you the doc template needs a new section.

They live in the project rather than in this plugin's own folder for a
concrete reason: installed plugins are cached per version
(`design-doc-reviewer/0.1.0/`, then `0.2.0/`, and so on), so anything
written inside the plugin is orphaned by the next release -- taking with it
exactly the history `design-doc-history` exists to read. Same reasoning as
`tech-debt-prioritizer`'s register and `incident-postmortem-writer`'s
incident records.

## Design principle: gaps in the document, not judgments about the author

Two constraints hold this plugin together.

**The review is about the document.** "I'd have done this differently" is a
design opinion; "this doesn't say what happens if the migration fails
halfway" is a gap. The first belongs in the review conversation, from you,
as yourself -- the skill hands those back separately and clearly labeled,
rather than smuggling them into a findings table where they read as
objective.

**The history log has no author field.** Not "we don't report by author" --
the schema has no place to put a name. The moment a log like this can
answer "whose docs keep missing rollback plans," it stops improving a
template and starts evaluating people, and the docs that follow are written
to pass the checklist rather than to help a reviewer. The constraint lives
in the schema so it can't be skipped under pressure, the same way
`incident-postmortem-writer` has no root cause category for human error.

A third, smaller one worth knowing: **the most common gap is not a missing
section but a section that does no work.** An "Alternatives Considered"
heading over two strawmen passes any checklist and tells a reviewer
nothing. Each gap category in `references/gap-categories.md` therefore
documents the tell -- how the empty version reads.

## Known limitations (v0.1.0)

- No connectors bundled. It reads what you paste or point it at; Linear,
  Google Docs, and Claude Docs work only when those connectors are active
  in your session, and Google Drive needs authenticating separately.
- It can't see what the doc doesn't mention but the team already knows.
  Context living in someone's head, a prior meeting, or a linked doc it
  wasn't given will read as a gap. Say so when that happens -- the fix is
  usually a link in the doc, which is a real finding anyway.
- Tiers are a blunt instrument. `T1` and `T2` cover "small and reversible"
  versus "hard to undo," which is most of the distinction that matters, but
  a team with genuinely three or four classes of doc will want to edit the
  checklist rather than fight the default.
- No template linting. It reviews a doc's contents, not whether your
  organization's doc template is any good -- though `design-doc-history` is
  the input you'd use to decide that.
