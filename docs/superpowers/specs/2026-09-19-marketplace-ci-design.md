# Marketplace CI and unit tests

Status: approved 2026-09-19

## Problem

The repository ships Markdown, JSON, and three bash adapter scripts, with no
automated checks of any kind. Three classes of breakage are currently
invisible:

1. **Cross-file drift.** A plugin's version and description live in both
   `.claude-plugin/marketplace.json` and `plugins/<name>/.claude-plugin/plugin.json`
   with nothing keeping them equal. The sibling repository
   (`meaganewaller/marketplace`) hit exactly this: eight of nine entries sat
   frozen while the plugins moved on.
2. **An unenforced manual step.** Registering a plugin in
   `release-please-config.json` is documented in `AGENTS.md` and nowhere
   enforced. A plugin added without it silently never releases.
3. **Adapter regressions.** `adapters/*/install.sh` are the load-bearing code
   of this repo and are exercised only by hand, against a scratch directory,
   when someone remembers.

A real instance of (3) already exists: `adapters/copilot/install.sh` documents
that it skips plugins tagged `do-not-install` in `marketplace.json`, but
`marketplace.json` appears only in that comment. Both it and the codex adapter
hardcode `_template-plugin`. The `do-not-install` tag is decorative.

## Approach

Mirror the sibling repository's stack so both marketplaces behave the same and
there is one thing to learn: `mise` pins the toolchain, `bun test` runs
TypeScript tests, and a two-job GitHub Actions workflow gates pull requests.

Bash adapters are covered by spawning the real scripts into temporary
directories and asserting on the resulting file tree, rather than adding a
second test framework. `HOME` is overridden in those spawns so the codex
`--personal` path is exercised without writing to the developer's real
`~/.codex`.

## Scope

### Toolchain

- `mise.toml` pins `bun`, `shfmt`, `shellcheck`, `jq`.
- `package.json` (private) with devDependencies: `@biomejs/biome`,
  `@commitlint/cli`, `@commitlint/config-conventional`, `markdownlint-cli2`,
  `npm-run-all2`.
- `biome.json`, `.markdownlint-cli2.yaml`, `.commitlintrc.js`, `tsconfig.json`.
- `node_modules/` added to `.gitignore`.

Deliberately excluded: `cspell` and `knip`. Both need curation and have little
to analyze in a two-plugin repository. Revisit when the repo grows.

### Behavior change: adapters honor `do-not-install`

`adapters/copilot/install.sh` and `adapters/codex/install.sh` stop hardcoding
`_template-plugin` and instead read `tags` from `marketplace.json`, skipping
any plugin tagged `do-not-install` unless it is named explicitly on the command
line. This implements the contract the headers already describe and scales to
future non-installable entries. Adds `jq` as a runtime dependency of those two
adapters, pinned in `mise.toml`.

The explicit-name escape hatch is preserved: naming a plugin on the command
line installs it regardless of its tags.

### Tests

`test/marketplace-integrity.test.ts`

- each `marketplace.json` entry and its `plugin.json` agree on `version`
- each pair agrees on `description`
- `source` is exactly `./plugins/<name>`; `plugin.json.name` matches directory
- no `plugins/` directory missing from `marketplace.json`
- no `marketplace.json` entry pointing at a missing directory
- every installable plugin has a `release-please-config.json` package whose
  `component` matches, with both `extra-files`: `.claude-plugin/plugin.json`
  at `$.version`, and `/.claude-plugin/marketplace.json` at
  `$.plugins[?(@.name=='<name>')].version`
- `_template-plugin` is absent from the release config (asserts the deliberate
  exclusion so it is not "fixed" later)
- `.release-please-manifest.json` keys equal the config's package keys
- each manifest version equals the corresponding `plugin.json` version

`test/skill-frontmatter.test.ts`

- every `plugins/*/skills/*/` contains a `SKILL.md`
- frontmatter parses and carries non-empty `name` and `description`
- frontmatter `name` equals the skill directory name
- every `references/...` path cited in a SKILL.md body exists on disk
- `CATALOG.md` has a row for every plugin and names every one of its skills

`test/adapters.test.ts`

- every adapter passes `bash -n` and is executable
- copilot writes `.github/skills/<skill>/SKILL.md` for each skill
- codex `--repo` writes `.agents/skills/<skill>/SKILL.md`
- codex `--personal` writes under an overridden `HOME`, never the real one
- a plugin tagged `do-not-install` is excluded by default
- naming that plugin explicitly installs it anyway
- missing or invalid target directory exits non-zero with usage on stderr
- gemini writes `gemini-extension.json` that parses and whose `name` and
  `version` match `plugin.json`
- running an adapter twice is idempotent

`test/workflow-integrity.test.ts`

Assertions run against the parsed YAML, never substring matches over raw text,
because comments and structure are indistinguishable to `toContain`.

- `release.yml` grants `contents: write`, `pull-requests: write`,
  `issues: write` — the permissions release-please needs
- `release.yml` triggers on push to `main`
- `ci.yml` triggers on pull request and on push to `main`
- `ci.yml` pins every `uses:` to a 40-character commit SHA

### CI workflow

`.github/workflows/ci.yml`, two jobs:

- **quality** — `bun install --frozen-lockfile`, then `bun run lint` (biome,
  markdownlint, shellcheck, shfmt) and `bun test`. The test step runs even when
  lint fails, so one run reports both, but stays skipped if install failed.
- **commit-messages** — pull requests only. Lints the PR title and every commit
  with commitlint.

The PR trigger includes `edited`. This repository squash-merges and
release-please reads the resulting subject, which GitHub seeds from the PR
title; without a rerun on `edited`, a PR can pass CI under a good title and be
renamed to `chore:` before merge, suppressing a release behind a stale green
check.

`cancel-in-progress` applies to pull requests only. On `main`, `github.ref`
collapses every merge into one concurrency group, so cancelling would leave a
merged commit with no green record.

Actions are pinned by commit SHA. `persist-credentials: false` on checkout,
because `bun install` runs the root `prepare` script, which a PR author can
change — leave no job token in `.git/config` for it to find.

## Out of scope

- `cspell`, `knip`, husky/lint-staged pre-commit hooks
- Renovate configuration
- Pinning `release.yml`'s `release-please-action@v4` to a SHA — a separate
  decision

## Verification

The suite is meaningful only if it fails on real breakage. Before declaring
done, deliberately break each invariant class and confirm a red test:
version drift, a missing release-please package, a `do-not-install` plugin
leaking into an adapter's output.

This work lands through a pull request rather than a push to `main`, so the
new CI gates their own introduction.
