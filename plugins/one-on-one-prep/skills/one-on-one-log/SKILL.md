---
name: one-on-one-log
description: >
  Logs what was discussed after a 1:1 -- topics covered, follow-ups (open or
  closed), and any growth goals the person stated themselves -- to
  ~/.tech-leadership/one-on-ones/<person-slug>.json. Use this skill right
  after a 1:1 wraps, when the user says "log my 1:1 with [name]," "here's
  what we talked about," "[name] wants to try X," "close out that follow-up
  from last time," or runs "/1-1 log [name]".
---

# One-on-One Log

## Where data lives

`~/.tech-leadership/one-on-ones/<person-slug>.json` -- outside this skill's
own installed folder, deliberately, since this is personal data about a
specific report and must never be bundled into shareable skill content. If
the file doesn't exist yet, create it with the schema below.

## Schema

```json
{
  "name": "Jordan Lee",
  "sessions": [
    {
      "date": "2026-09-19",
      "topics": ["auth refactor review progress", "interest in design ownership"],
      "follow_ups": [
        {
          "item": "Jordan wants to try leading the migration design review",
          "status": "open",
          "raised": "2026-09-05",
          "closed": null
        }
      ],
      "growth_notes": ["Said directly they want more design-level ownership"]
    }
  ]
}
```

`status` is `"open"` or `"closed"`. When the user says a follow-up was
resolved, set `status` to `"closed"` and fill `closed` with today's date --
never delete a closed follow-up, since `one-on-one-history` uses the full
record to spot recurring themes.

## Logging rules -- facts only

- **`topics`**: what was actually discussed, in a few words each. Neutral,
  factual phrasing.
- **`follow_ups`**: concrete commitments or things to check on next time --
  "Jordan will draft the RFC by Friday," not "Jordan seemed motivated."
- **`growth_notes`**: only things the person said about themselves directly
  (a goal, an interest, a request). Never a note about their mood,
  engagement, or what Claude infers they were feeling. If the user describes
  something interpretive ("I think Jordan is getting burned out"), log the
  observable facts they give as support, if any, and leave the
  interpretation itself out of the record -- interpretation is for the
  manager to sit with, not to encode as a stored judgment about a person.

## Workflow

1. Identify the person and load their file (or start a new one).
2. From what the user describes, extract topics, follow-ups (new ones as
   `"open"`, and mark any prior open follow-up as `"closed"` if the user
   says it was resolved), and any self-stated growth notes.
3. Append a new session entry with today's date.
4. Confirm back to the user what was logged, in the same factual terms --
   this is also a chance for them to correct anything before it's saved.

## Also relevant

After logging, mention `one-on-one-history` if this looks like the 2nd+
time a similar topic has come up -- but don't run it automatically; let the
user ask when they want the cross-session view.
