---
name: delegation-roster
description: >
  Maintains the team roster used for delegation -- each person's skill
  areas with a stated level, growth interests they have said out loud, and
  current workload -- at ~/.tech-leadership/delegation/roster.json. Use this
  skill when the user says "set up my team roster," "add [name] to the
  roster," "update what [name] is working on," "[name] is at capacity,"
  "[name] wants to learn Terraform," "who's on my team," or runs
  "/delegate roster". Also use it when delegation-plan reports the roster is
  missing or stale.
---

# Delegation Roster

## Where data lives

`~/.tech-leadership/delegation/roster.json` -- **outside this plugin's
installed folder, deliberately.**

This is information about specific people you work with. It must never end
up committed to a shared marketplace repo, or copied alongside shareable
skill content into a team's `.github/skills/`, a Gemini extension, or
`~/.codex/skills/` the way this plugin's instructions are. The adapters in
this marketplace carry skill *instructions* only; this file is created
fresh, locally, wherever the tool runs.

Same reasoning as `one-on-one-prep`'s per-person notes, and the same
directory root.

## What a level means -- and what it does not

`level` records **stated experience with a kind of work**. It is not a
performance rating, not a ranking of people, and not a judgment about
anyone's potential.

| Level | Meaning |
|---|---|
| 1 | New to this. Would be learning from scratch. |
| 2 | Can do it with support or review from someone more experienced. |
| 3 | Works independently here. |
| 4 | Can lead the work and bring others along in it. |

Record what the person or the user states. Never infer a level from
tenure, job title, how long someone has been on the team, or anything about
who they are. If a level is unknown, leave the area off the roster rather
than guessing -- `delegation-plan` handles a missing area correctly, and a
guessed 3 is indistinguishable from a stated one once it's written down.

## Schema

Full field-by-field rules in `references/roster-schema.md`. The short
version:

```json
{
  "updated": "2026-09-19",
  "people": [
    {
      "name": "Jordan Lee",
      "slug": "jordan-lee",
      "skills": { "backend": 3, "api-design": 2, "infra": 1 },
      "growth_interests": ["design-level ownership", "infra"],
      "load": "normal",
      "notes": null
    }
  ]
}
```

`load` is `light`, `normal`, `heavy`, or `overloaded`.

## Growth interests -- stated only

`growth_interests` holds things the person has said they want, in their own
framing. "Wants to learn Terraform." "Asked to lead a design review."

Never write an interest the user inferred rather than heard. If the user
says "I think Jordan would be good at infra," that is the user's read, not
Jordan's stated interest -- it does not belong here. Ask whether Jordan has
actually said anything about infra, and record that instead if so.

This matters beyond tidiness: `delegation-plan` treats a growth interest as
a reason to hand someone harder work. An inferred interest becomes a real
assignment the person never asked for.

## Load

`load` is the user's current read of how busy someone is, and it goes stale
fast. When the roster's `updated` date is more than about two weeks old,
say so and offer to refresh loads before planning.

Load never determines whether someone is *capable* of a chunk -- only
whether now is the right time to hand it to them.

## Workflow

1. Load the roster, or create it if this is first-time setup.
2. For first-time setup, go person by person: name, the skill areas that
   matter for the work they do with a level each, anything they have said
   they want to grow into, and current load. Ask for areas rather than
   proposing them, so the vocabulary matches how the team actually talks.
3. For an update, change only what the user names and leave the rest.
4. Set the top-level `updated` date.
5. Confirm back what changed, so the user can correct it before it's saved.

## Also relevant

Once the roster exists, `delegation-plan` can use it. If the user is
setting up the roster in order to plan something specific, offer to run
that next.
