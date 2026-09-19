# Copilot adapter

GitHub Copilot reads skills from `.github/skills/<name>/SKILL.md` in a
repository -- the same frontmatter-plus-Markdown format as everywhere else
in this marketplace, discovered and invoked automatically (or via
`/<skill-name>`) once committed to the repo.

## Install

```bash
adapters/copilot/install.sh /path/to/your/repo
```

Installs every real plugin's skills (the template is skipped by default).
To install only specific plugins:

```bash
adapters/copilot/install.sh /path/to/your/repo pr-review-copilot debug-session-tracker
```

This copies each `plugins/<plugin>/skills/<skill>/` directory into
`.github/skills/<skill>/` in the target repo. Commit the result so the whole
team's Copilot sees the same skills.

## Also relevant to Copilot

- **`.github/copilot-instructions.md`** -- repo-wide custom instructions,
  Copilot's equivalent of AGENTS.md. If a plugin needs an always-on rule
  (not just an on-demand skill), add it there by hand; this adapter doesn't
  touch that file, since it's meant to be one file per repo, hand-curated.
- **Path-specific instructions** (`.github/instructions/*.instructions.md`)
  and **prompt files** (`.github/prompts/*.prompt.md`) are separate Copilot
  mechanisms this adapter does not generate. Most of this marketplace's
  content fits the on-demand skill model instead.

## Re-running after a plugin update

Re-run the same command -- it overwrites the matching skill directories in
`.github/skills/` and leaves everything else untouched.
