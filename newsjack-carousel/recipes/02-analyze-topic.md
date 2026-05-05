# 02 — Analyze the topic with Gemini

Gemini reads the media + caption and returns a strict JSON brief of what's being announced, the key features, the visual style, and a one-line carousel angle.

## Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=$GEMINI_API_KEY
```

## Pick frames

- **Carousel** — pass all slide JPEGs (every slide IS the message)
- **Video/reel** — pass 4–6 evenly-spaced frames from the extracted set (skip the first second; opening logos rarely carry signal)
- **Single image** — pass the single JPEG

Cap at 8 inline images. More than that wastes tokens and degrades attention.

## Prompt body

```
Analyze this <type> from @<author> announcing/showing <topic>.

Caption:
<verbatim caption>

Return strict JSON ONLY (no prose):
{
  "announcement": "one-sentence summary of what is being launched/shown",
  "key_features": ["...", "..."],
  "visual_style": {
    "color_palette": "...",
    "type_treatment": "...",
    "imagery": "...",
    "mood": "..."
  },
  "frame_descriptions": ["frame 1...", "frame 2..."],
  "carousel_angle": "one-sentence pitch on the angle a 6–8 slide carousel should take to react to / announce this"
}
```

Pass the prompt as the first `parts[]` entry, then each image as `{ inline_data: { mime_type: "image/jpeg", data: <base64> } }`. Set `generationConfig.responseMimeType: "application/json"` to force a parseable response.

## Implementation note

System Python (`urllib.request`) trips an SSL cert verify error on macOS. Use `curl` via `subprocess.run` to dodge it:

```python
body = json.dumps({"contents":[{"parts": parts}], "generationConfig":{"responseMimeType":"application/json"}})
open("/tmp/gem.json","w").write(body)
r = subprocess.run([
  "curl","-sS","-X","POST",
  f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={key}",
  "-H","Content-Type: application/json","--data-binary","@/tmp/gem.json"
], capture_output=True, text=True)
text = json.loads(r.stdout)["candidates"][0]["content"]["parts"][0]["text"]
```

Save raw output to `topic/analysis.json`.

## Validate

The JSON must contain non-empty `announcement`, `key_features` (length ≥ 2), and `carousel_angle`. If any are missing, the analysis is junk — re-prompt once with sharper instructions, then bail and ask the user.

## Output

`topic/analysis.json` is the source of truth for the rest of the pipeline. The next step (slide-spec writing) reads this — never re-derive the announcement from the caption + frames yourself once Gemini has structured it.

## Cost

~$0.02–0.05 per call depending on frame count. 8 frames at 2.5 Pro = ~$0.05.
