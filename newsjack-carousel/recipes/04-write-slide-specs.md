# 04 — Write the slide specs

Turn the analysis brief + format brief into 6–8 slide JSON specs the gpt-image-2 flattener can consume.

## Slot count

- 1 cover
- 4–6 body slides — drawn one-per-feature from `analysis.json.key_features`. If the analysis returned 6 features, write 6 body slides; if 3, write 3.
- 1 closer (CTA)

Cap at 8 total — Instagram caps carousels at 10 but engagement falls off after 8.

## Body-slide angles

Pick the framing that fits the news:

- **Capability tour** — each slide is one feature/capability + a representative visual (good for product launches with multiple features)
- **Prompts to try** — each slide is a concrete prompt + a teaser of what it produces (good for AI tools, APIs, MCP-style releases — what we did for Higgsfield MCP)
- **Before / after** — each slide is a paired comparison (good for new model releases vs. old generation)
- **Use-case spotlight** — each slide is one user / one case study (good for platform launches, success-story angles)

Pick one angle and hold it across all body slides. Don't mix capability with use-case in the same carousel.

## Spec structure

Use the schema from `references/slide-spec.md` verbatim. Every slide has all fields. Save to `specs/slide_<N>_<role>.json`.

## Continuity

Hold these constant across every spec in the carousel:

- `aspect.ratio` — `4:5 vertical`
- `colors_and_tone.palette` — same family on every slide (e.g., "pure black background with [brand-color] accents")
- Typography color — one across all slides
- Brand-mark placement — same corner on every slide that has one

Vary scene, camera, pose, prop. Never vary palette mid-carousel.

## Brand voice in the typography strings

For body slides built around `key_features`:

```
"typography": "Render editorial typography DIRECTLY IN THE IMAGE on top of the photograph. Three layers on the upper black half. (1) HEADING top-left in heavy bold sans-serif <brand-color>, two lines: '<N>. <feature title>' then '<continuation>' with a period at the end. (2) SUBHEAD heavy bold sans-serif white uppercase, one line: '<MODEL/TOOL — VALUE PROP>.' (3) PROMPT/BODY in white sans-serif regular weight, three lines indented in quotation marks: '<concrete prompt or proof point>.' All rendered text must be perfectly spelled, sharp, and legible. Typography MUST appear in the final rendered image, not as a placeholder."
```

Cap each line at ~30 characters. Long lines garble.

## Cover-slide rule

Cover headline = topic + value prop. Examples:

- "HIGGSFIELD MCP / JUST DROPPED. / HERE ARE 6 PROMPTS / TO TRY RIGHT NOW"
- "CLAUDE OPUS 4.7 / IS HERE. / 5 THINGS / IT CAN DO TODAY"
- "SORA HIT 1B GENERATIONS. / HERE'S WHAT / CREATORS ARE / SHIPPING"

Brand-color the proper noun + the verb-of-the-news. White on connectives. Match the source's news urgency — if it's a launch-day post, the cover says "JUST DROPPED"; if it's a one-week-after take, "1 WEEK IN."

## Closer-slide rule

Closer = single CTA tied to caption mechanic. The caption asks "Comment X for the link" → the closer slide has a "COMMENT X" pill or outlined keyword. Don't introduce a new CTA the caption doesn't reinforce.

## Validate before generating

Before submitting any spec to gpt-image-2:

- All headlines ≤ 3 lines, ≤ 30 chars per line
- One typography color across all slides
- Negative prompt includes `misspelled text, garbled letters, fake characters, extra characters in the headline, text in the wrong place, watermark, low resolution`
- Brand color named consistently — "neon-lime green," not "lime green" on slide 2 and "neon green" on slide 5; gpt-image-2 reads these as different colors

## Output

```
specs/
├── slide_1_cover.json
├── slide_2_body.json
├── ...
└── slide_<N>_closer.json
```
