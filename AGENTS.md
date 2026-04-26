# AI Creative Lab — Workflows

Claude Code skills for AI video creation. Each skill is one
end-to-end workflow that ships a finished output.

## Skills

| Slash command | What it ships |
|---|---|
| `/clone-ad` | 15-second AI clone of a reference ad for your own product. Reference fetched (Scrape Creators) or local MP4, analyzed (Gemini), shot list rewritten for the product, generated (Wavespeed Nano Banana 2 + Seedance 2.0), verified against the reference's shot density. |
| `/generate-carousel` | 3–10 slide Instagram carousel. Niche research, format pattern detection, slide JSON specs, single-pass image generation (Wavespeed gpt-image-2) with typography baked in, caption draft, publish or save as drafts (Zernio). |
| `/wide-cam-podcast` | ~60-second wide-cam two-host AI podcast clip. Characters and set defined as JSON, starting frames generated (Wavespeed gpt-image-2 or Nano Banana 2), clips generated (Seedance 2.0), optional VidJutsu compliance scan, fine-print disclaimer burn. |

## Provider stack

Shared across skills:

- **Wavespeed** — video and image generation (Seedance 2.0, Nano Banana 2, gpt-image-2)
- **VidJutsu** — visual QA, compliance, disclaimer overlay
- **Scrape Creators** — reference fetching from Meta Ad Library, TikTok, Instagram, YouTube
- **Zernio** — publishing and scheduling
- **Gemini** — video analysis (reference shot extraction)

Skills declare which providers they use in their SKILL.md frontmatter.
See [`docs/PROVIDERS.md`](docs/PROVIDERS.md) for the full list and signup links.

## Layout

Each top-level directory is one skill. Inside each skill:

```
<skill-name>/
├── SKILL.md            # Entry point — Claude reads this
├── recipes/            # Numbered step-by-step procedures
│   ├── 01-…md
│   └── …
└── references/         # Provider docs, schemas, rules
    ├── …md
    └── …
```

## Adding a skill

1. Create a new top-level directory named after the use case (verb-first: `clone-ad`, not `ad-cloner`).
2. Add `SKILL.md` with frontmatter (`name`, `description`, `requires.env`).
3. Break the procedure into numbered files under `recipes/`.
4. Put provider docs and schemas in `references/`.
5. Read [`ETHOS.md`](ETHOS.md) before shipping.

## Install

See [`README.md`](README.md) for the install flow. Short version:

```
git clone --single-branch --depth 1 https://github.com/tfcbot/ai-creative-lab.git ~/.claude/skills/ai-creative-lab
cd ~/.claude/skills/ai-creative-lab && ./setup
```
