#!/usr/bin/env bash
# Adapts tech-leadership plugins for OpenAI Codex CLI.
#
# Codex CLI discovers skills as folders with a SKILL.md, either personally
# under ~/.codex/skills/<name>/ or per-repo under <repo>/.agents/skills/<name>/.
# It also reads AGENTS.md for repo-wide instructions -- that's separate from
# skills and isn't touched by this script (see marketplace root AGENTS.md).
#
# Usage:
#   adapters/codex/install.sh --personal [plugin-name ...]
#   adapters/codex/install.sh --repo <path-to-target-repo> [plugin-name ...]
#
# With no plugin names given, installs every plugin except ones tagged
# "do-not-install" in marketplace.json (i.e. the template). Naming a plugin
# explicitly installs it regardless of its tags.
#
# Example:
#   adapters/codex/install.sh --personal
#   adapters/codex/install.sh --repo ~/code/my-repo debug-session-tracker

set -euo pipefail

MARKETPLACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MARKETPLACE_JSON="$MARKETPLACE_ROOT/.claude-plugin/marketplace.json"
# shellcheck source-path=SCRIPTDIR
# shellcheck source=../lib/marketplace.sh
source "$MARKETPLACE_ROOT/adapters/lib/marketplace.sh"

if ! command -v jq > /dev/null 2>&1; then
  echo "Error: jq is required to read marketplace.json. Install it and retry." >&2
  exit 1
fi

MODE="${1:-}"
DEST=""

case "$MODE" in
  --personal)
    DEST="$HOME/.codex/skills"
    shift
    ;;
  --repo)
    TARGET_REPO="${2:-}"
    if [[ -z "$TARGET_REPO" || ! -d "$TARGET_REPO" ]]; then
      echo "Error: --repo requires an existing repo path." >&2
      exit 1
    fi
    DEST="$TARGET_REPO/.agents/skills"
    shift 2
    ;;
  *)
    echo "Usage:" >&2
    echo "  $0 --personal [plugin-name ...]" >&2
    echo "  $0 --repo <path-to-target-repo> [plugin-name ...]" >&2
    exit 1
    ;;
esac

REQUESTED_PLUGINS=("$@")
mkdir -p "$DEST"

installed=0
for plugin_dir in "$MARKETPLACE_ROOT"/plugins/*/; do
  plugin_name="$(basename "$plugin_dir")"

  # Skip anything the marketplace tags "do-not-install" -- the template today,
  # possibly more later -- unless the caller named it explicitly. Reading the
  # tag rather than hardcoding a name means a new non-installable entry needs
  # no change here.
  if [[ ${#REQUESTED_PLUGINS[@]} -eq 0 ]] &&
    marketplace_has_tag "$MARKETPLACE_JSON" "$plugin_name" "do-not-install"; then
    continue
  fi

  if [[ ${#REQUESTED_PLUGINS[@]} -gt 0 ]]; then
    match=0
    for want in "${REQUESTED_PLUGINS[@]}"; do
      [[ "$plugin_name" == "$want" ]] && match=1
    done
    [[ $match -eq 0 ]] && continue
  fi

  [[ -d "$plugin_dir/skills" ]] || continue

  for skill_dir in "$plugin_dir"skills/*/; do
    skill_name="$(basename "$skill_dir")"
    [[ -f "$skill_dir/SKILL.md" ]] || continue
    rm -rf "${DEST:?}/$skill_name"
    cp -R "$skill_dir" "$DEST/$skill_name"
    echo "Installed skill '$skill_name' (from plugin '$plugin_name') -> $DEST/$skill_name"
    installed=$((installed + 1))
  done
done

if [[ $installed -eq 0 ]]; then
  echo "No skills installed. Check the plugin name(s) you passed." >&2
  exit 1
fi

echo ""
echo "Done. Codex auto-detects new skills in $DEST on next run;"
echo "restart Codex only if a freshly added skill doesn't show up in /skills."
