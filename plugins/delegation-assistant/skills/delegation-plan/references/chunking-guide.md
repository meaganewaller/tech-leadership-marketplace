# Chunking Guide

How to split work into pieces that can actually be owned, and how to give
each one a level.

## What makes a good chunk

- **One owner can finish it.** If two people must work in the same files at
  the same time, it is one chunk, not two.
- **It doesn't stall mid-flight.** A chunk that stops halfway waiting on
  another chunk is really two chunks with a dependency between them. Split
  it there.
- **It has a visible end.** The owner can tell when they are done without
  asking.
- **It is worth a rationale.** If a chunk is ten minutes of work, fold it
  into a neighbor -- assigning it deliberately costs more than doing it.

## Levelling a chunk

Use the same 1-4 scale as the roster, and level the chunk by **what the
work demands**, not by how important it is. A critical one-line config
change is level 1. Important and hard are different axes.

| Level | The work demands |
|---|---|
| 1 | Following an existing pattern in the codebase. The answer is already there to copy. |
| 2 | Adapting a pattern to a new case. Judgment about where it does and doesn't fit. |
| 3 | Designing within a known area. No existing pattern to follow, but familiar ground. |
| 4 | Deciding the shape of something new, or untangling something nobody understands yet. |

Ask which of those the chunk actually is. The common error is levelling by
size -- a big chunk of level-1 work is still level 1, and should be
described as long rather than hard.

## Dependencies

Record them. A chunk that depends on another cannot start until that one
lands, which changes who can take it: the owner of a blocked chunk needs
availability *later*, not now.

If the dependency graph is mostly linear, say so. Work that cannot be
parallelized cannot really be delegated across a team, and the honest
answer may be that one or two people should own the whole line with the
rest doing something else.

## Work that resists splitting

Some work genuinely does not chunk. Signals:

- Every piece requires holding the same context in your head at once
- The interfaces between pieces are the hard part, and they aren't known yet
- Splitting it would take longer than doing it

When this happens, say so rather than producing chunks that look
delegable and are not. Useful alternatives: one owner with a reviewer,
two people pairing for the duration, or a spike first to discover the
interfaces, after which it chunks properly.

An honest "this doesn't split well yet" is a better answer than five
chunks that all block on each other.

## Worked example

Project: "Add SSO to the admin app."

| # | Chunk | Level | Depends on | Why that level |
|---|---|---|---|---|
| 1 | Add the SSO provider config and env plumbing | 1 | — | Existing config pattern to follow |
| 2 | Session handling for SSO logins | 3 | 1 | Designing within our auth code, no pattern for this case |
| 3 | Map provider groups to our roles | 4 | — | Nobody has decided what the mapping should be |
| 4 | Admin UI for the login flow | 2 | 2 | Adapting existing form patterns to a new flow |
| 5 | Migration for existing password users | 3 | 2 | Familiar ground, but no pattern and it's one-way |

Note chunk 3: it is small in code and the highest level in the list,
because the hard part is a decision nobody has made. That is exactly the
kind of chunk that gets handed to whoever is free and then stalls for two
weeks.
