---
name: newsjack-carousel
description: Turn any social post URL into a same-day reaction/announcement carousel for the user's brand. Drop a link to a launch, news drop, viral post, or product reveal — Scrape Creators pulls the post, Gemini analyzes the visuals + caption to figure out what's being announced, the skill writes 6–8 fresh slide specs that react to or announce the topic in the user's voice, optionally clones a second URL's visual format for the layout, generates slides with Wavespeed gpt-image-2 (typography baked in), hosts on VidJutsu CDN, and publishes via Zernio. Use when the user shares a URL and says "make a carousel announcing this," "react to this," "make a carousel about this drop," or "newsjack this for our account."
requires:
  env:
    - SCRAPE_CREATORS_API
    - GEMINI_API_KEY
    - WAVESPEED_API_KEY
    - VIDJUTSU_API_KEY
    - ZERNIO_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

## When to invoke

- The user shares a URL to a launch, news drop, model release, viral post, product reveal, or any topical event and wants a carousel ABOUT it for their account
- They want to react to or announce a third party's news (e.g., "Higgsfield just dropped MCP — make a carousel announcing it")
- The source post is video, reel, carousel, or single image — the skill adapts to all four
- They optionally provide a second URL as the visual format reference (e.g., "match the format of this carousel")

This is the topical / newsjack sibling of `clone-carousel`. Difference:

- `clone-carousel` — input MUST be a carousel; output reuses its FORMAT for the user's own brand niche (no relation to the source's subject matter)
- `newsjack-carousel` — input can be ANY post; output is ABOUT the source's subject matter (the source is the topic seed, not the format seed); a second optional URL provides the format

If the user wants to clone a format and keep it niche-agnostic, use `clone-carousel`. If the user wants to react to / announce a specific topic from a URL, use this skill.

## Required environment variables

- `SCRAPE_CREATORS_API` — required. Pulls the topic post (and optional format reference).
- `GEMINI_API_KEY` — required. Analyzes frames + caption to determine the announcement, key facts, and visual style.
- `WAVESPEED_API_KEY` — required. Slide generation via gpt-image-2.
- `VIDJUTSU_API_KEY` — required. CDN hosting for stable public slide URLs.
- `ZERNIO_API_KEY` — required. Publishes to the user's connected account.

The skill checks all five before any provider call. If a key is missing it stops with a signup link.

## The pipeline (6 steps)

1. **Fetch the topic post** → `recipes/01-fetch-topic.md` — Scrape Creators handles video / reel / carousel / image. Downloads media + caption + author handle.
2. **Analyze the topic** → `recipes/02-analyze-topic.md` — Gemini reads frames (or carousel slides) + caption and returns structured JSON: announcement summary, key features, visual style, and a one-line carousel angle.
3. **Optionally fetch a format reference** → `recipes/03-pick-format.md` — if the user provided a second URL, pull and analyze it the same way `clone-carousel` does. Otherwise pick a default tech-announcement format (black bg, brand-color heading, white body, photo card lower half).
4. **Write slide specs** → `recipes/04-write-slide-specs.md` — 6–8 slides in the user's brand voice: cover (announcement), 4–6 capability/proof slides drawn from the analysis, CTA closer. Brand color is the user's, NOT the source's — match Higgsfield green for Higgsfield news, Anthropic orange for Claude news, etc.
5. **Generate, host, draft caption** → `recipes/05-generate-and-host.md` — Wavespeed gpt-image-2 in parallel → VidJutsu CDN upload → caption drafted in the user's voice mirroring the format reference's caption pattern.
6. **Confirm and publish** → `recipes/06-publish.md` — Surface payload (caption + slide order + target account + schedule) for approval. Fire `POST /v1/posts` with `publishNow: true`. Stop polling on the permalink — surface the post ID and let Zernio finalize asynchronously.

## Working directory layout

```
CWD/newsjack-carousel-<YYYYMMDD-HHMM>/
├── topic/
│   ├── post_<shortcode>.json       # Scrape Creators full body
│   ├── reference.mp4               # if video/reel
│   ├── frames/frame_*.jpg          # extracted via ffmpeg fps=1/3
│   └── analysis.json               # Gemini structured output
├── format/                         # only if user gave a 2nd URL
│   ├── post_<shortcode>.json
│   └── images/slide_*.jpg
├── specs/
│   └── slide_<N>_<role>.json       # one per slide
├── frames/
│   └── slide_<N>_<role>.png        # final 4:5 2K renders
├── caption.md
├── publish_payload.json
└── post.md                         # zernio post id + permalink + slide URLs
```

## Schema and endpoint references

- `references/slide-spec.md` — JSON schema for one slide
- `references/typography-rules.md` — baking type into gpt-image-2 in a single pass
- `references/wavespeed-gpt-image-2.md` — endpoint, params, parallelism, content-flag retry
- `references/vidjutsu-cdn.md` — uploading PNGs for stable public URLs
- `references/zernio-publish.md` — create-post payload, the `publishNow` gotcha, stuck-publish recovery
- `references/scrapecreators-instagram.md` — post-fetch endpoint shapes for video, reel, carousel, image

## Style guardrails

- **Brand color belongs to the user, not the source.** If the topic post is from Higgsfield (neon lime), the user posts in their own brand color. Pull the user's brand color from `MEMORY.md` or ask once and remember.
- **Announcement framing.** The cover headline names the topic + drops the news. The body slides are concrete value (features, prompts to try, before/after, proof points). The closer is a CTA.
- **Source attribution in the caption opening line.** Lead with `@<source-handle> just shipped X` — gives credit, signals topical relevance, and improves IG ranking via the @-mention.
- **No reproduction of source visuals.** The carousel is ABOUT the topic; never reuse the source's photographs, logos, or screen recordings beyond a small attribution mark if the user explicitly asks.
- **Polling discipline.** Per user preference: do not start tight poll loops on Zernio/Wavespeed/Meta without surfacing the cadence and total duration first. Default to ScheduleWakeup at 2–10 min intervals over short-sleep loops.
- **Confirmation before publish.** Surface the full payload (caption, slide order, target @username, schedule). Wait for explicit go.

## Cost and time expectations

- Scrape Creators: ~$0.01 per post (×1 if no format ref, ×2 if user provided one)
- Gemini 2.5 Pro analysis: ~$0.02–0.05 per analysis (depends on # of frames passed)
- Wavespeed gpt-image-2 at 2K, 4:5: ~$0.02 per slide
- VidJutsu CDN: free
- Zernio publish: free

A typical 8-slide newsjack carousel: ~$0.20 in API costs, ~6–10 min wall time, including a single regen on one slide if typography misfires.

## Failure modes worth knowing upfront

- **Source URL is a Reel/video and user asked clone-carousel** — wrong skill; this one handles it.
- **Source is a paywalled or private post** — Scrape Creators returns 404; tell user and stop.
- **Gemini SSL cert error from system Python** — use `curl` via subprocess instead of `urllib.request`. See `recipes/02-analyze-topic.md`.
- **Zernio dedup error after a stuck publish** — DELETE the stuck post first, tweak the caption (one sentence is enough), then re-POST. Don't try to PUT-then-publish — it stays as a draft.
- **Brand color mismatch.** If user has not set a brand color, ask once and save to memory; don't guess.
