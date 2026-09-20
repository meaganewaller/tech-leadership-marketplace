---
name: design-doc-checklist
description: >
  Reads and edits the team's list of what a design doc must cover, stored in
  the project's .claude/design-doc-checklist.md, so reviews check against
  what this team actually requires rather than a generic list. Use this
  skill when the user says "set up our design doc checklist," "we always
  require a rollback plan," "stop flagging missing cost estimates," "we
  don't do non-goals," "what's on our checklist," or runs
  "/design-doc checklist". Also use it when design-doc-review reports that
  no project checklist exists.
---

# Design Doc Checklist

## Where it lives

`.claude/design-doc-checklist.md` in the repo the design doc belongs to.
Resolve it against the repo root (`git rev-parse --show-toplevel`), or the
working directory outside a git repo.

**It lives in the project rather than in this plugin's directory** because
plugin updates install each version into a fresh directory -- anything
saved inside the plugin is lost on the next release. Putting it in the
repo also gets the behavior you want anyway: the team commits it, everyone
reviews against the same list, and changing it is a reviewable diff rather
than a private setting.

The team hand-edits it over time. It is never regenerated from scratch.

## What a checklist entry is for

A design doc checklist has two jobs, and the second one is the one people
forget:

1. **Add** what this team requires that the defaults don't cover -- a
   compliance section, a cost estimate over some threshold, a named
   reviewer from another team.
2. **Remove** what this team has decided it doesn't need. A team that
   ships behind flags and reverts freely may genuinely not need a rollback
   section on every doc. Marking that as not required is how reviews stop
   raising it every single time.

Without the second job the checklist only ever grows, reviews get noisier,
and people stop reading them.

## Reading it (used by design-doc-review)

If the file doesn't exist, the project has no checklist: review against the
default categories in `design-doc-review/references/gap-categories.md`
and mention that a checklist can be set up.

If it exists, it wins. An item marked **not required** is not a gap, and
`design-doc-review` must not flag it -- even when the default categories
would. A required item the defaults don't mention gets checked like any
other.

The one thing a checklist entry cannot do is mark a *correctness* problem
as acceptable. "We don't require a rollback plan" is a legitimate team
decision about documentation. "Ignore that this migration is irreversible"
is not something a checklist can settle in advance, because that's a
per-design judgment the review exists to surface.

## Editing it

When the user says "we always require X," "stop asking about Y," or runs
the skill directly:

1. Show the current file. If it doesn't exist, create it (and `.claude/`
   if needed) from `references/default-checklist.md`, and say you created
   it.
2. Get the change in one line: what's required or not required, and
   optionally why. The why is what stops a future reader from reverting it
   six months later.
3. Edit the relevant section, replacing any placeholder.
4. Confirm back what changed, and say to commit the file so the rest of
   the team reviews against the same list.

Keep entries to one line. This is a checklist, not the team's design doc
guide -- if an entry needs real explanation, link to the actual guide.

## Scaling by blast radius

The most useful thing a team can put here is **when an item applies**,
rather than whether it exists at all. A one-page proposal for a reversible
internal change should not be held to the same list as a data migration.

The default checklist ships with a tier marker for this, and a review
respects it -- see `references/default-checklist.md`. A team that ignores
tiers and requires everything on every doc will get accurate reviews and
stop reading them by the third one.

## Also relevant

`design-doc-history` surfaces the gap categories that keep recurring across
the team's docs. A category showing up in review after review usually means
one of two things: the doc template is missing a section, or the checklist
is asking for something the team has quietly decided it doesn't do. Both
get fixed here.
