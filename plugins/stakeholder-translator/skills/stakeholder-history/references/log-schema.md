# Communications Log Schema

The `communications` array in
`~/.tech-leadership/stakeholders/<slug>.json` -- never committed, never
carried by an adapter.

The profile fields in the same file belong to `stakeholder-profile` and are
documented in that skill's `references/profile-schema.md`. This skill
writes `communications` and nothing else.

## Entry fields

| Field | Type | Notes |
|---|---|---|
| `date` | string | ISO date it was actually sent or said. |
| `topic` | string | A few words. What it was about. |
| `format` | string | `chat`, `email`, `doc`, `spoken`, or `other`. Where it went, which matters when tracing who else may have seen it. |
| `summary` | string | One or two sentences of what was communicated. |
| `claims` | array | The revisable assertions made. See below -- this is the important one. |
| `commitments` | array | Things promised to this person. |

## `claims`

A claim is any statement that a later update could contradict: a date, a
number, a status, a scope.

| Field | Type | Notes |
|---|---|---|
| `claim` | string | What was said, in the words it was said in -- hedges included. |
| `kind` | string | `date`, `number`, `status`, or `scope`. |
| `superseded_by` | string or null | ISO date of the communication that revised it, or `null` while it still stands. |

**Record the hedge.** `"two to six weeks, depending on the backfill"` is the
claim; `"six weeks"` is not. A log that strips hedges will report a
contradiction where none exists, and -- worse -- will let a real one
through when the new estimate falls inside the original range.

**Never delete a superseded claim.** Set `superseded_by` and keep it. The
sequence of what someone was told is the whole point; a log that only holds
current values is just a status field.

## `commitments`

| Field | Type | Notes |
|---|---|---|
| `commitment` | string | What was promised, in the terms it was promised. |
| `due` | string or null | ISO date if one was given. |
| `status` | string | `open` or `closed`. |
| `closed` | string or null | ISO date it was delivered or withdrawn. |

A commitment is something *you* owe this person -- a number you said you'd
get, an update you said you'd send, a decision you said you'd bring back.
It is not a project deadline. Project dates are `claims` of kind `date`;
mixing the two makes check 3 fire on things nobody actually promised.

## Worked example

```json
{
  "name": "Priya Nadar",
  "slug": "priya-nadar",
  "fluency": 2,
  "communications": [
    {
      "date": "2026-08-12",
      "topic": "payments migration",
      "format": "email",
      "summary": "Outlined the migration and gave a first timeline.",
      "claims": [
        {
          "claim": "Should land in October, assuming the vendor's sandbox is ready in September",
          "kind": "date",
          "superseded_by": "2026-09-20"
        },
        {
          "claim": "Estimated $200k/year saved on instance costs, at current traffic",
          "kind": "number",
          "superseded_by": null
        }
      ],
      "commitments": [
        {
          "commitment": "Send the per-customer cost breakdown once the pricing model is built",
          "due": "2026-09-01",
          "status": "open",
          "closed": null
        }
      ]
    },
    {
      "date": "2026-09-20",
      "topic": "payments migration",
      "format": "email",
      "summary": "Reported the date moving to early December; vendor sandbox arrived four weeks late.",
      "claims": [
        {
          "claim": "Early December, now that the vendor sandbox landed four weeks late",
          "kind": "date",
          "superseded_by": null
        }
      ],
      "commitments": []
    }
  ]
}
```

Three things this example is doing:

- The October claim is kept with `superseded_by` pointing at the September
  entry, so the record shows the date moved and when Priya was told.
- The September update's summary names the revision explicitly, which is
  what check 1 exists to force.
- The cost-breakdown commitment is still `open` and its due date has
  passed. It has nothing to do with the migration timeline, and check 3
  will surface it on the next update regardless of what that update is
  about -- which is the point.
