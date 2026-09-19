#!/usr/bin/env bash
# Adapts tech-leadership plugins for GitHub Copilot.
#
# Copilot reads skills from .github/skills/<name>/SKILL.md in a repo (same
# SKILL.md format everyone else uses: YAML frontmatter with name+description,
# then Markdown instructions). This script copies every skill from every
# plugin in this marketplace into a target repo's .github/skills/, so
# Copilot picks them up without any manual transformation.
#
# Usage:
#   adapters/copilot/install.sh <path-to-target-repo> [plugin-name ...]
#
# With no plugin names given, installs every plugin except ones tagged
# "do-not-install" in marketplace.json (i.e. the template).
#
# Example:
#   adapters/copilot/install.sh ~/code/my-repo
#   adapters/copilot/install.sh ~/code/my-repo debug-session-tracker

set -euo pipefail

MARKETPLACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET_REPO="${1:-}"
shift || true
REQUESTED_PLUGINS=("$@")

if [[ -z "$TARGET_REPO" ]]; then
  echo "Usage: $0 <path-to-target-repo> [plugin-name ...]" >&2
  exit 1
fi

if [[ ! -d "$TARGET_REPO" ]]; then
  echo "Error: target repo '$TARGET_REPO' does not exist." >&2
  exit 1
fi

DEST="$TARGET_REPO/.github/skills"
mkdir -p "$DEST"

installed=0
for plugin_dir in "$MARKETPLACE_ROOT"/plugins/*/; do
  plugin_name="$(basename "$plugin_dir")"

  # Skip the template unless explicitly requested by name.
  if [[ "$plugin_name" == "_template-plugin" && ${#REQUESTED_PLUGINS[@]} -eq 0 ]]; then
    continue
  fi

  if [[ ${#REQUESTED_PLUGINS[@]} -gt 0 ]]; then
    match=0
    for want in "${REQUESTED_PLUGINS[@]}"; do
      [[ "$plugin_name" == "$want" ]] && match=1
    done
    [[ $match -eq 0 ]] && continue
  fi

  if [[ ! -d "$plugin_dir/skills" ]]; then
    echo "Skipping $plugin_name -- no skills/ directory" >&2
    continue
  fi

  for skill_dir in "$plugin_dir"skills/*/; do
    skill_name="$(basename "$skill_dir")"
    if [[ ! -f "$skill_dir/SKILL.md" ]]; then
      echo "Skipping $plugin_name/$skill_name -- no SKILL.md" >&2
      continue
    fi
    rm -rf "${DEST:?}/$skill_name"
    cp -R "$skill_dir" "$DEST/$skill_name"
    echo "Installed skill '$skill_name' (from plugin '$plugin_name') -> $DEST/$skill_name"
    installed=$((installed + 1))
  done
done

if [[ $installed -eq 0 ]]; then
  echo "No skills installed. Check the plugin name(s) you passed, or that plugins/ has real content yet." >&2
  exit 1
fi

echo ""
echo "Done. Commit .github/skills/ in '$TARGET_REPO' so Copilot and your"
echo "teammates all see the same skills. Copilot needs no restart -- it"
echo "reads .github/skills/ from the repo it's working in."
