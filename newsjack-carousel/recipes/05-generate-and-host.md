# 05 — Generate, host, and draft caption

- `references/wavespeed-gpt-image-2.md` — endpoint, params, parallel submission, content-flag retry
- `references/vidjutsu-cdn.md` — `vidjutsu upload` per PNG, capture stable URL

## Generate (parallel)

Submit all slide prompts to Wavespeed gpt-image-2 in a single shell run with `&` and `wait`. 8 slides at 2K usually finishes in 1–3 min wall time.

For each spec:

1. Flatten the JSON via the `wavespeed-gpt-image-2.md` flattener
2. POST to `/api/v3/openai/gpt-image-2/text-to-image` with `aspect_ratio: "4:5"`, `resolution: "2k"`, `quality: "high"`, `negative_prompt` = comma-joined `forbidden_elements`
3. Capture the task ID

Then poll each task until `status: completed`, download `outputs[0]` to `frames/slide_<N>_<role>.png`. **Polling cadence: surface to the user before starting** ("polling 5 slides every 3s for up to 3 min"). Default to ScheduleWakeup at 2-min intervals over tight loops.

## Host

For each rendered PNG:

```
vidjutsu upload frames/slide_<N>_<role>.png
```

Capture the `url` field. Save the full ordered list to `slide_urls.json`:

```json
{
  "slides": [
    { "n": 1, "role": "cover",   "url": "https://cdn.vidjutsu.ai/uploads/.../<uuid>.png" },
    ...
  ]
}
```

This file is the input to the publish step.

## Draft caption

Read `format/format.md` for the caption pattern. Mirror the STRUCTURE, not the words:

- Lead with `@<source-handle> just shipped X` — gives credit, signals topical relevance, improves IG ranking
- Mid: 2–4 lines of concrete value — the same payoff length the format reference uses
- CTA: matches the closer slide ("Comment 'MCP' and we'll send you the install link")
- Hashtags: same category mix as the format reference (5–10 total, niche + broad)

Cap at 2200 chars total. Save to `caption.md`.

### Tone calibration

The caption is for the user's brand, not the source's. Don't write `@higgsfield.ai` voice — write the user's voice reacting to higgsfield's news. Punchy, declarative, present-tense. The reader should feel "this is news; I should swipe."

## Output

```
frames/slide_*.png       # local renders
slide_urls.json          # CDN URLs in carousel order
caption.md               # publish-ready caption
```
