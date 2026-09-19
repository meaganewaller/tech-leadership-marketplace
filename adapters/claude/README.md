# Claude adapter

Claude needs no adapter script -- this marketplace's canonical format
(`.claude-plugin/plugin.json` + `skills/*/SKILL.md` per plugin, cataloged in
`.claude-plugin/marketplace.json` at the root) *is* Claude's native plugin
format. Every other adapter in this directory copies or repackages that same
content for a different tool.

## Install (once this repo is pushed to a host)

```bash
claude plugin marketplace add <git-url-or-local-path>
claude plugin install <plugin-name>@tech-leadership
```

Or, for local development against a clone of this repo:

```bash
claude plugin marketplace add /path/to/tech-leadership-marketplace
claude plugin install _template-plugin@tech-leadership   # sanity check only
```

## Validate before publishing

```bash
claude plugin validate .claude-plugin/plugin.json   # per plugin
```

If that command isn't available in your environment, check by hand:
`.claude-plugin/plugin.json` exists and parses as JSON with at least a
`name` field, kebab-case; every skill directory listed has a `SKILL.md`.

## Adding a plugin to the catalog

After creating a plugin under `plugins/<name>/` (see
`plugins/_template-plugin/README.md`), add an entry to
`.claude-plugin/marketplace.json`:

```json
{
  "name": "<name>",
  "description": "...",
  "version": "0.1.0",
  "source": "./plugins/<name>",
  "category": "development"
}
```
