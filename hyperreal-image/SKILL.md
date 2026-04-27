---
name: hyperreal-image
description: Generate a photorealistic AI image that doesn't read as AI. Bakes in mandatory skin / eyes / hair micro-rules, single-light aesthetic, candid framing, and the standard negative prompt for Nano Banana 2. Use for content where believability is the hook — UGC creative, candid social posts, start frames for hyperreal-video.
requires:
  env:
    - WAVESPEED_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# hyperreal-image

The opinionated cousin of `/generate-image`. Goal: produce images that
survive a scroll without anyone clocking them as AI. Bakes in the
mandatory skin / eyes / hair micro-rules, single-source-light
aesthetic, and the standard negative prompt for Nano Banana 2.

## Providers

- **Wavespeed (Nano Banana 2)** — pull `https://wavespeed.ai/docs` for the current API surface; model-specific endpoint under `https://wavespeed.ai/docs/docs-api/bytedance/bytedance-nano-banana-2`

## When to invoke (vs. `/generate-image`)

- UGC creative where the person needs to read as a real customer, not a model
- Candid social posts (selfies, phone-call shots, lifestyle scenes)
- Start frames for `/hyperreal-video` where character believability is the whole illusion
- Any image where AI-tells (plastic skin, multi-lit ad look, uncanny symmetry) would kill the post

For products, slides, infographics, or illustrations → use
`/generate-image` instead.

## Steps

1. **Capture the subject.** Person? Scene with a person? Solo or pair?
   Age range, ethnicity, hair, eye color, body type, vibe.
2. **Pick the setting.** One environment that anchors believability
   (bedroom, car interior, gym, kitchen, outdoors). Wardrobe matches
   the setting.
3. **Pick the light.** Single source, named direction — window from
   right, overhead fluorescents, side sun, lamp. Never multi-lit.
4. **Pick the framing.** Medium close-up by default (head to mid-chest,
   face fills 40–60% of frame). Adjust for full-body or wider scenes.
5. **Refine the prompt** using the template below. Read it back to the
   user; iterate before any provider call.
6. **Generate** via Nano Banana 2 with the standard negative prompt
   always included.
7. **Show the user the result** and offer to re-roll. See common
   failure modes at the bottom.

## The template (load-bearing — keep verbatim)

> [subject: age + ethnicity + hair + eye color + body] in [setting + wardrobe], [framing — e.g. medium close-up head to mid-chest, face fills 40–60%], [lighting — single source from direction]. Skin: subsurface scattering at nostrils and ear edges, dermal crosshatch micro-texture, natural skin sheen on forehead and cheekbones, color variation (warmer forehead, cooler orbital area, warm nose tip and cheeks), undereye translucency with faintest blue-purple veins, lip texture with deeper pigment at center and fine vertical lines, visible pores on nose bridge and inner cheeks, peach fuzz along jawline and upper lip catching backlight. Eyes: radial iris fibers with visible limbal ring, single natural catchlight shaped by the actual light source, waterline redness, individual lash roots, brow hairs with visible growth direction. Hair: individual strands at hairline and temples, baby hairs and flyaways catching light, visible darker roots if dyed, natural shine variation. Direct camera gaze. [aspect ratio]. 2K minimum.

## Standard negative prompt (always included)

> smooth plastic skin, airbrushed skin, beauty filter, porcelain doll skin, waxy skin, matte foundation, heavy makeup, studio ring light, multiple light sources, rim lighting, backlight, hair light, lens flare, specular highlights on skin, overly sharp, HDR look, oversaturated, digital noise reduction, frequency separation, skin smoothing, uncanny valley, 3D render, CGI, video game character, AI generated look, symmetrical face, perfect symmetry, glossy lips, lip gloss, painted on eyebrows, false eyelashes, mascara clumps, beauty retouching, dodge and burn skin, luminous glowing skin, angel light, butterfly lighting, glamour lighting, fashion lighting setup, softbox, octabox, beauty dish, catchlight rings in eyes, blemishes, acne, scars, moles, wrinkles, bags under eyes, oily skin

## Aesthetic principles (8 baked in)

1. **NOT portrait photography** — candid selfie / phone-call energy
2. **Single light source** — one window, one sun angle, one overhead. Never multi-lit
3. **Skin is the hero** — freckles, pores, natural sheen, subsurface scattering
4. **Imperfect hair** — flyaways, baby hairs, visible roots
5. **Environment in the blur** — recognizable but soft-focus, anchors believability
6. **Direct gaze** — looking at camera/phone, caught mid-thought
7. **Casual wardrobe** — lived-in, brand/item anchors identity, not styled
8. **Shallow depth of field** — face sharp, everything else soft

## Subject rules (when generating people)

- **Attractive but real** — naturally pretty person on a Tuesday morning, not a retouched ad
- **Age 22–32 default** — adjust if the brief calls for older or younger
- **Diverse across runs** — rotate ethnicities, hair types, skin tones
- **Slight asymmetry** — perfect symmetry kills believability
- **One outfit per character, one setting per character** — wardrobe is identity, setting is part of the character

## Input

- Subject (person, body, vibe — or scene description if no person)
- Setting (single environment)
- Lighting (single source + direction)
- Framing (medium close-up default)
- Aspect ratio (9:16 default for Reels/TikTok; accepts 1:1, 16:9, 4:5)

## Output

- 2K PNG at `CWD/hyperreal-image-<timestamp>/image.png`
- Wavespeed-hosted URL (reusable as a start frame for `/hyperreal-video`)
- Final prompt + negative prompt saved alongside for iteration

## Common failure modes

- **Smooth plastic skin** — check the negative prompt is included; strengthen the skin micro-rules in the template
- **Multi-lit ad look** — remove rim/backlight cues; specify a single direction explicitly
- **Salon-perfect hair** — add "flyaways at temples" + "baby hairs catching light"
- **Uncanny / too symmetric** — add "slight asymmetry" to the prompt; verify symmetry terms are in the negative
- **Reads retouched** — describe soft-focus environment items to anchor candid energy
