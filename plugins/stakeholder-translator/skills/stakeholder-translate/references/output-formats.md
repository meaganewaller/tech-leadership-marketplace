# Output Formats

Four destinations, four shapes. The substance is identical in all of them;
what changes is how much of it survives a reader who stops early.

Pick from the profile's `format` when there is one. Otherwise ask -- it's
one short question and it changes the whole output.

## Chat / Slack

Short, scannable, no headers, readable on a phone. **Lead with the answer**,
because for many readers the first line is the whole message.

```markdown
[The answer or the news, one line.]

[Two or three lines of what it means for them.]

[The ask, or "no action needed" -- say which, explicitly.]
```

Threads are where detail goes. Put the headline in the message and offer
the rest rather than posting six paragraphs into a channel.

## Email to execs or leadership

```markdown
Subject: [The news, not the topic -- "Payments migration slipping to
December," not "Payments migration update"]

[One-paragraph summary: what happened or what's needed, and the impact.]

[What's changed since they last heard, if anything.]

[2-4 short paragraphs of substance, most important first.]

**What I need from you:** [the decision, the approval, or "nothing --
this is for awareness."]
```

State the ask explicitly, even when it's nothing. An exec reading an update
with no stated ask will spend the whole message looking for it.

## Written status doc or weekly report

Stands on its own for a reader with no context, and gets skimmed rather
than read.

```markdown
## [Project or area]
**Status:** [On track / At risk / Blocked] — [one line of why]

### Where things stand
[Two or three sentences a reader with no prior context can follow.]

### What changed since last time
[Only real changes. "No change" is a legitimate and useful entry.]

### Risks and unknowns
- [Risk] — [likelihood and what it would mean]

### Decisions needed
- [Decision] — [who, by when, and what happens if it waits]
```

A status label is a claim. "On track" after a slip needs the slip named in
the same line, or the label is doing the lying.

## Spoken talking points

Notes to say out loud, not a paragraph to read aloud. Short sentences,
plain words, no clause stacking.

```markdown
**Opening (15 seconds):**
- [The headline, in speakable words]

**If they ask "why":**
- [The cause, one sentence]

**If they ask "when":**
- [The date and its dependency -- hedged exactly as the source hedged it]

**If they ask "what's it costing us":**
- [The honest answer, including "we don't have that number yet"]

**Don't get pulled into:**
- [Detail that will eat the meeting without changing the decision]
```

Always include the honest answer to the uncomfortable question. The point
of talking points is being ready for the question you'd rather not get --
a set that only covers the easy ones is worse than none, because it
produces false confidence walking in.

## One update, four ways

Source (from an engineer): *"The Postgres connection pool is exhausting
under peak load because the new reporting queries hold connections for
30+ seconds. We've added a statement timeout as a stopgap. Real fix is
moving reporting to a read replica -- probably two to three weeks, could
be longer if the replication lag turns out to be a problem."*

**Chat:**

> Checkout errors during the morning peak: cause found and stopgap shipped
> this morning, so it shouldn't recur this week. Permanent fix is two to
> three weeks out. No action needed from anyone -- I'll flag it if the
> timeline moves.

**Email:**

> Subject: Morning checkout errors -- cause found, stopgap in place
>
> The checkout failures customers hit during the last two morning peaks
> came from our new reporting feature holding onto database capacity that
> checkout needed. We shipped a limit this morning that should stop it
> recurring.
>
> The permanent fix moves reporting onto its own copy of the database. Two
> to three weeks, possibly longer -- we won't know until we test how
> quickly that copy keeps up.
>
> **What I need from you:** nothing right now. I'll come back if the
> timeline moves.

**Status doc:**

> ## Checkout reliability
>
> **Status:** At risk — mitigated today, permanent fix 2-3 weeks out
>
> ### Where things stand
>
> New reporting queries were consuming database capacity checkout depends
> on, causing failures during morning traffic peaks on two days. A limit
> shipped this morning caps how long a reporting query can hold that
> capacity.
>
> ### What changed since last time
>
> Cause identified (was unknown last week); stopgap shipped.
>
> ### Risks and unknowns
>
> - Permanent fix depends on how quickly a database copy stays current
>   under our load — untested. If it lags, the fix takes longer than
>   2-3 weeks.
>
> ### Decisions needed
>
> - None this week.

**Talking points:**

> **Opening:** Checkout was failing for some customers during the morning
> rush, twice. We found it, and we've capped it as of this morning.
>
> **If they ask why:** A new reporting feature was using up database
> capacity that checkout needed at the same time.
>
> **If they ask when it's properly fixed:** Two to three weeks. Could be
> longer -- there's one thing we haven't tested yet.
>
> **If they ask how many customers:** I don't have that number yet. I can
> get it.
>
> **Don't get pulled into:** how connection pooling works.

Note what holds across all four: the two-to-three-week estimate never
becomes "a couple of weeks," the "could be longer" never disappears, and
the customer-count question is answered with "I don't have that number"
rather than a guess.
