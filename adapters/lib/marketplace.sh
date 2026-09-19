#!/usr/bin/env bash
# Shared helpers for reading .claude-plugin/marketplace.json.
#
# Sourced by the copilot and codex adapters, which both need to honor the
# tags the marketplace sets on a plugin. Not executable on its own.
#
# Requires jq.

# marketplace_has_tag <marketplace.json> <plugin-name> <tag>
#
# Succeeds when the named plugin carries the tag. Fails when it does not, when
# the plugin has no entry at all (an unlisted directory is untagged rather than
# tagged), and when the manifest is missing or unreadable -- callers treat a
# failure as "install it", so an unreadable manifest can never silently hide a
# plugin the caller asked for.
marketplace_has_tag() {
  local manifest="$1" plugin="$2" tag="$3"

  [[ -f "$manifest" ]] || return 1

  local matches
  matches="$(
    jq -r --arg n "$plugin" --arg t "$tag" '
      [.plugins[]? | select(.name == $n) | .tags[]? | select(. == $t)] | length
    ' "$manifest" 2> /dev/null
  )" || return 1

  [[ "${matches:-0}" -gt 0 ]]
}
