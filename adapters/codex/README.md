# Codex CLI adapter

OpenAI Codex CLI discovers skills as folders with a `SKILL.md`, in one of
two places:

- **Personal**, available in every session regardless of repo:
  `~/.codex/skills/<name>/`
- **Per-repo**, checked in and shared with the team:
  `<repo>/.agents/skills/<name>/`

Codex reads the skill's description and decides when it's relevant, or you
invoke it explicitly with a `$` mention (e.g. `$review-diff`).

## Install

```bash
# Personal, available everywhere:
adapters/codex/install.sh --personal

# Per-repo, checked in and shared with the team:
adapters/codex/install.sh --repo /path/to/your/repo
```

Both accept specific plugin names to narrow the install, same as the other
adapters:

```bash
adapters/codex/install.sh --personal pr-review-copilot
```

## Also relevant to Codex

Codex also reads **AGENTS.md** for always-on, repo-wide instructions --
separate from the on-demand skill mechanism this adapter installs. See
`AGENTS.md` at the marketplace root for what belongs there instead of in a
skill (build/test commands, repo conventions -- not a specific workflow like
a PR review).

## Re-running after a plugin update

Re-run the same command -- it overwrites the matching skill directories and
leaves everything else in `~/.codex/skills/` or `.agents/skills/` untouched.
