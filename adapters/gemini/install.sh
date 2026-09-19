#!/usr/bin/env bash
# Adapts tech-leadership plugins for Gemini CLI.
#
# Gemini CLI doesn't install bare skill folders -- it installs *extensions*,
# each its own directory with a gemini-extension.json manifest, from which it
# auto-discovers a bundled skills/ directory. So for Gemini, each plugin in
# this marketplace becomes one generated extension: this script builds that
# extension directory (manifest + copied skills) and prints the install
# command -- it does not require the `gemini` CLI itself to be present here.
#
# Usage:
#   adapters/gemini/install.sh <plugin-name> [output-dir]
#
# output-dir defaults to ./.gemini-extensions-build/<plugin-name>
#
# Example:
#   adapters/gemini/install.sh debug-session-tracker
#   gemini extensions install ./.gemini-extensions-build/debug-session-tracker

set -euo pipefail

MARKETPLACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PLUGIN_NAME="${1:-}"
OUT_DIR="${2:-$MARKETPLACE_ROOT/.gemini-extensions-build/$PLUGIN_NAME}"

if [[ -z "$PLUGIN_NAME" ]]; then
  echo "Usage: $0 <plugin-name> [output-dir]" >&2
  echo "" >&2
  echo "Available plugins:" >&2
  for d in "$MARKETPLACE_ROOT"/plugins/*/; do
    basename "$d"
  done >&2
  exit 1
fi

PLUGIN_DIR="$MARKETPLACE_ROOT/plugins/$PLUGIN_NAME"
PLUGIN_JSON="$PLUGIN_DIR/.claude-plugin/plugin.json"

if [[ ! -f "$PLUGIN_JSON" ]]; then
  echo "Error: no plugin.json at $PLUGIN_JSON" >&2
  exit 1
fi

name="$(jq -r '.name' "$PLUGIN_JSON")"
version="$(jq -r '.version // "0.1.0"' "$PLUGIN_JSON")"
description="$(jq -r '.description // ""' "$PLUGIN_JSON")"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR/skills"

# Copy every skill this plugin has.
copied=0
if [[ -d "$PLUGIN_DIR/skills" ]]; then
  for skill_dir in "$PLUGIN_DIR"/skills/*/; do
    skill_name="$(basename "$skill_dir")"
    [[ -f "$skill_dir/SKILL.md" ]] || continue
    cp -R "$skill_dir" "$OUT_DIR/skills/$skill_name"
    copied=$((copied + 1))
  done
fi

if [[ $copied -eq 0 ]]; then
  echo "Error: plugin '$PLUGIN_NAME' has no skills/*/SKILL.md to bundle." >&2
  exit 1
fi

# Generate gemini-extension.json. contextFileName is omitted unless the
# plugin ships a shared context file (rare for this marketplace -- most
# plugins are skill-only); add "contextFileName" here by hand if a plugin
# later needs one.
jq -n \
  --arg name "$name" \
  --arg version "$version" \
  --arg description "$description" \
  '{name: $name, version: $version, description: $description}' \
  > "$OUT_DIR/gemini-extension.json"

echo "Built Gemini extension for '$PLUGIN_NAME' ($copied skill(s)) at:"
echo "  $OUT_DIR"
echo ""
echo "Install it with:"
echo "  gemini extensions install $OUT_DIR"
echo ""
echo "Or, for local development where edits here should take effect without"
echo "reinstalling:"
echo "  gemini extensions link $OUT_DIR"
