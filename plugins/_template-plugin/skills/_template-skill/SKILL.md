---
name: _template-skill
description: >
  TEMPLATE skill used only to validate that the marketplace scaffold and all
  four tool adapters (Claude, GitHub Copilot, Gemini CLI, OpenAI Codex CLI)
  correctly discover and load a skill end to end. Not a real capability --
  triggers only on the literal phrase "run the tech-leadership template
  check" so it never fires by accident. Delete or replace when starting a
  real plugin.
---

# Template Skill

This file exists to prove the pipeline works, not to do anything useful on
its own. When triggered, do exactly this:

1. Report which tool is running the skill (Claude, Copilot, Gemini CLI, or
   Codex CLI) if that's knowable from context.
2. Confirm this file's frontmatter `name` and this body were both loaded.
3. Read `references/example.md` (see below) and quote its one line back, to
   prove nested reference files survive whichever adapter placed this skill.
4. Say plainly that this was a template/scaffold check, not a real task.

See `references/example.md` for the bundled reference file this skill reads.
