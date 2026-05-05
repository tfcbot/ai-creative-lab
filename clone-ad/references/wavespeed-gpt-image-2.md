# Wavespeed — GPT Image 2 (`openai/gpt-image-2/text-to-image`)

Alternative to Nano Banana 2 for the start image — preferred when the start frame includes a person + a brand-labeled product (gpt-image-2 renders typography much more cleanly than Nano Banana). Use Nano Banana 2 for product-only hero shots; use gpt-image-2 for talking-head + branded-product start frames or any time legible label text matters.

## Endpoint

```
POST https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image
Authorization: Bearer $WAVESPEED_API_KEY
Content-Type: application/json
```

## Request body

```json
{
  "prompt": "<positive prompt — see prompt rules below>",
  "aspect_ratio": "9:16",
  "resolution": "1k",
  "quality": "medium",
  "num_images": 1
}
```

## Param notes (this is where Nano Banana 2's params diverge — do not copy that schema)

- **`aspect_ratio`** (string, optional) — accepted values: `"1:1"`, `"3:2"`, `"2:3"`, `"3:4"`, `"4:3"`, `"4:5"`, `"5:4"`, `"9:16"`, `"16:9"`, `"21:9"`. **Use `"9:16"` for vertical UGC start frames.** Do NOT pass `size: "720*1280"` — that's the Nano Banana 2 schema and gpt-image-2 will silently fall back to 1024×1024 square.
- **`resolution`** (string, optional) — `"1k"` (default), `"2k"`, `"4k"`. `"1k"` is sufficient for Seedance i2v; higher costs more credits with no Seedance benefit.
- **`quality`** (string, optional) — `"low"`, `"medium"` (default), `"high"`. `"medium"` works for most cases; bump to `"high"` for hero-frame work with fine label typography.
- **`enable_sync_mode`** (boolean, optional) — default `false`. Leave false for the standard async/poll flow.
- **`enable_base64_output`** (boolean, optional) — default `false`.
- **`num_images`** — 1 unless multiple variations needed.

## Response (submission)

```json
{
  "code": 200,
  "data": {
    "id": "<task_id>",
    "status": "created"
  }
}
```

## Polling

```
GET https://api.wavespeed.ai/api/v3/predictions/<task_id>/result
Authorization: Bearer $WAVESPEED_API_KEY
```

Poll every ~3 seconds. Status walks `created` → `processing` → `completed`. On completion, `outputs[0]` is a CloudFront PNG URL.

## Render time

- 1k / medium — typically 20 to 60 seconds
- 2k or `quality: "high"` — 60 to 120 seconds
- Occasional spikes; just wait

## Prompt rules for the i2v start frame

Use the same structural rules as `references/product-image-rules.md` (single subject, clean background, product fills 60–80% of frame), with these gpt-image-2-specific additions:

- **State label text in quotes inside the prompt** so gpt-image-2 treats it as a render directive, e.g. `the can shows the wordmark "BLOOM" in white sans-serif on a matte black label`. Without quotes, the model paraphrases.
- **For talking-head + product frames:** describe the person and the product separately, then specify the relationship (`holding the product at chest height with the label facing camera`). Avoid `looking at` or other ambiguous spatial cues — gpt-image-2 will sometimes turn the product away.
- **Avoid logos that aren't pure typography.** Iconographic logos (e.g. an apple silhouette, a swirl mark) tend to render as approximate. Wordmarks and short text-only logos render cleanly.

## Output

Single PNG. At `aspect_ratio: "9:16"` and `resolution: "1k"`, native dimensions are 720×1280. Download to `product/product.png` so the rest of the clone-ad pipeline finds it at the same path it expects from Nano Banana 2.

## When to use gpt-image-2 over Nano Banana 2

| Situation | Model |
|---|---|
| Product-only hero shot, no people, no label text in frame | Nano Banana 2 |
| Product-only hero with a wordmark on the label that must read | gpt-image-2 (`quality: "high"`) |
| Talking-head holding a branded product | gpt-image-2 |
| Person + product in any environment (kitchen, gym, bathroom) | gpt-image-2 |
| Pure white seamless studio shot, no typography | Nano Banana 2 (cleaner edges) |

## Failure modes

- **Square 1024×1024 returned despite `aspect_ratio: "9:16"`** — you passed `size: "720*1280"` (Nano Banana 2 schema) instead of `aspect_ratio`. gpt-image-2 ignores `size`. Drop `size`, pass `aspect_ratio` + `resolution`.
- **Label text mangled or paraphrased** — bump `quality` to `"high"` and put the wordmark in quotes inside the prompt. If still mangled, regenerate; gpt-image-2 has stochastic typography failures even with the right prompt.
- **Person's hands warp around the product** — describe the grip explicitly (`right hand on the cap, left hand cradling the base`) instead of just `holding`. Vague grip descriptions produce six-finger artifacts.
- **HTTP 400 invalid aspect_ratio** — only the values listed above are accepted. `2:1`, `5:1`, custom ratios all fail.

## Cost

| Quality | 1k | 2k | 4k |
|---|---|---|---|
| low | $0.010 | $0.020 | $0.030 |
| medium | $0.060 | $0.120 | $0.180 |
| high | $0.220 | $0.440 | $0.660 |

Default for clone-ad start frames: **`quality: "medium"`, `resolution: "1k"` ≈ $0.06 per image.** Bump to `high` only when the wordmark must read perfectly.

## When to skip this step

If the user already has a clean start frame — person + product framed cleanly, label legible if relevant — skip the call and use their image. Verify it meets the rules in `references/product-image-rules.md` first.
