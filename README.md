# ai-creative-lab

A marketplace of AI video skills from the **AI Creative Lab** livestream. Install only the skills you want.

## Install the marketplace (once)

In Claude Code:

```
/plugin marketplace add tfcbot/ai-creative-lab
```

## Install a specific skill

```
/plugin install <skill>@ai-creative-lab
/reload-plugins
```

Each skill is its own plugin, so you only get what you pick.

## Browse what's available

```
/plugin
```

Open the plugin manager and go to the **Discover** tab.

## Update

```
/plugin marketplace update ai-creative-lab
```

Pulls new skills published since you last updated.

## Remove a skill

```
/plugin uninstall <skill>@ai-creative-lab
```

## Cross-agent install (Cursor, Codex, OpenCode, etc.)

Skills can also be installed via the [vercel-labs skills CLI](https://github.com/vercel-labs/skills):

```
npx skills add tfcbot/ai-creative-lab --skill <skill>
```

This copies raw SKILL.md files into the agent's skills directory and invokes them flat (`/<skill>` instead of `/<skill>:<skill>`).

## Repo layout

Each skill lives in its own folder under `skills/` with two files:

```
skills/<name>/
├── .claude-plugin/plugin.json    # marks the folder as a Claude Code plugin
└── SKILL.md                      # the workflow itself
```

The marketplace manifest at `.claude-plugin/marketplace.json` lists every skill as its own plugin entry.

## The show

AI Creative Lab is a livestream about building with AI video tools and agent workflows. Skills from the stream land here.
