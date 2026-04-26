# AI Creative Lab

Claude Code skills for AI video creation. Each skill is one end-to-end
workflow that ships a finished output — clone an ad, build a carousel,
produce a wide-cam podcast clip — using a small, locked provider stack
(Wavespeed, VidJutsu, Scrape Creators, Zernio, Gemini).

## Install

Open Claude Code and paste this:

> Install AI Creative Lab: run `git clone --single-branch --depth 1 https://github.com/tfcbot/ai-creative-lab.git ~/.claude/skills/ai-creative-lab && cd ~/.claude/skills/ai-creative-lab && ./setup`, then add an "AI Creative Lab" section to CLAUDE.md listing the available skills: /clone-ad, /generate-carousel, /wide-cam-podcast.

Claude clones the repo, runs `setup`, and updates your `CLAUDE.md`.

Cross-agent install (Cursor, Codex, OpenCode):

```bash
npx skills add tfcbot/ai-creative-lab
```

See [`docs/INSTALL.md`](docs/INSTALL.md) for manual install and
troubleshooting.

## Skills

| Slash command | What it ships |
|---|---|
| `/clone-ad` | 15-second AI clone of a reference ad for your own product. |
| `/generate-carousel` | 3–10 slide Instagram carousel with typography baked in and a caption draft. |
| `/wide-cam-podcast` | ~60-second wide-cam two-host AI podcast clip with optional compliance scan and disclaimer burn. |

Full descriptions in [`AGENTS.md`](AGENTS.md).

## Configure

Skills require provider API keys. Copy `.env.example` to `.env` in your
project working directory and fill in the keys you need. See
[`docs/PROVIDERS.md`](docs/PROVIDERS.md) for signup links and expected
cost per provider.

Each skill validates its keys before any provider call. Missing keys
stop the run gracefully with a signup link — no partial runs that burn
credits.

## Layout

Each top-level directory is one skill:

```
<skill>/
├── SKILL.md            # Entry point — Claude reads this
├── recipes/            # Numbered step-by-step procedures
└── references/         # Provider docs, schemas, rules
```

## Contributing

Read [`ETHOS.md`](ETHOS.md) before adding a skill. The eight principles
are non-negotiable: ≤5min finished output, self-contained, verb-first
naming, locked provider stack, cost transparency, key validation, output
conventions, one-skill-per-release.

[`CLAUDE.md`](CLAUDE.md) has the SKILL.md frontmatter schema and editing
rules.

## License

[Apache 2.0](LICENSE).
