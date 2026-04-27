---
name: hyperreal-video
description: Generate a photorealistic AI video that holds character identity from a start image. Image-to-video only, defaults to Kling 3.0 for character continuity, subtle motion vocabulary tuned for candid believability. Pairs with /hyperreal-image for the start frame.
requires:
  env:
    - WAVESPEED_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# hyperreal-video

The opinionated cousin of `/generate-video`. Always image-to-video
(never text-to-video). Defaults to Kling 3.0 because character
continuity from the start frame is non-negotiable for believability.
Subtle motion vocabulary tuned to match candid energy — not cinematic
camera moves that break the illusion.

## Providers

- **Wavespeed** — pull `https://wavespeed.ai/docs` for the current API surface; model-specific endpoints under `https://wavespeed.ai/docs/docs-api/...` (e.g. `kwai/kling-v3-pro`, `bytedance/bytedance-seedance-2.0-image-to-video`)

## When to invoke (vs. `/generate-video`)

- The video must read as real, not generated
- Character identity must hold from frame to frame — paired with a hyperreal start image
- AI-reveal Reels, candid talking-heads, lifestyle UGC
- The motion is small and natural (talking, looking around, sipping coffee), not cinematic

For multi-cut UGC ads, branded campaigns, or anything text-to-video →
use `/generate-video` instead.

## Required input

**A start image.** Hard requirement. If the user doesn't have one,
defer to `/hyperreal-image` first, then pass the result here. The skill
refuses to run text-to-video — that's where character believability
dies.

## Steps

1. **Confirm the start image.** Path or URL. If missing, route the user
   to `/hyperreal-image` and come back.
2. **Capture the motion.** What should the character do? Talk to
   camera? Look down at phone? Sip coffee? Adjust hair? Keep it small
   and natural — one or two beats, not a multi-shot scene.
3. **Capture the speech (optional).** If they're talking, get the
   dialogue. Note: Kling has no native audio — pair with `/clone-voice`
   + `/swap-voice` after generation if dialogue is needed.
4. **Refine the motion prompt** using the template and vocabulary
   below. Read it back; iterate before any provider call.
5. **Pick the model.** Kling 3.0 default (best character continuity
   from a start frame). Seedance 2.0 only if the user explicitly wants
   native audio and accepts identity-drift risk.
6. **Set the params.** Aspect ratio (matches the start image — 9:16
   default), duration (5–8s default for Kling believability sweet
   spot), resolution.
7. **Generate** via Wavespeed image-to-video. Download the MP4 to
   `CWD/hyperreal-video-<timestamp>/clip.mp4`.
8. **Show the user the result.** If dialogue was specified, prompt
   them to run `/clone-voice` + `/swap-voice` for audio.

## The template (load-bearing)

> Subtle natural motion: [character does WHAT — single beat], [camera — handheld micro-movement / static], [scene reads as candid phone capture]. Character identity locked from start frame. [duration] seconds. [aspect ratio].

## Motion vocabulary (use these — they preserve believability)

- `subtle natural motion`
- `small head turn`
- `slight head tilt`
- `looking down at phone`
- `talking to camera`
- `slight smile`
- `breathing`
- `adjusting hair`
- `sipping [coffee / drink]`
- `handheld micro-movement`
- `static frame, character motion only`

## Avoid (kills believability)

- `cinematic camera move`, `dolly`, `tracking shot`, `crane`, `drone`
- `multi-shot`, `cut to`, `then cuts to`
- `dramatic lighting change`
- `hair flip`, `dramatic gesture`
- Anything implying multiple shots, scene changes, or styled action

## Negative prompt

> CGI, 3D render, video game character, AI generated look, plastic skin, smooth plastic skin, beauty filter, multi-shot, cut, scene change, multiple lighting setups, dramatic camera move, dolly zoom, crane shot, tracking shot, cinematic, stylized motion, exaggerated facial expression, uncanny valley

## Pick the model

| Model | Best for | Trade-off |
|---|---|---|
| **Kling 3.0** (default) | Character continuity from start frame, natural micro-motion, subtle lip-sync | No native audio — pair with `/clone-voice` + `/swap-voice` for dialogue |
| **Seedance 2.0** | When native audio is required and you can accept some identity drift | Less reliable character consistency frame-to-frame |

## Defaults

| Param | Default |
|---|---|
| `model` | Kling 3.0 |
| `mode` | image-to-video (only — no text-to-video path) |
| `duration` | 5–8s |
| `aspect_ratio` | matches start image (9:16 typical) |
| `resolution` | 720p (1080p if upscaling) |

## Input

- Start image (path or URL — required)
- Motion description (what the character does)
- (Optional) Dialogue, if speech is needed
- Duration
- Aspect ratio (defaults to start image's ratio)

## Output

- MP4 at `CWD/hyperreal-video-<timestamp>/clip.mp4`
- Wavespeed-hosted URL
- Final motion prompt saved alongside
- If dialogue was specified, a follow-up note pointing to `/clone-voice` + `/swap-voice`

## Common failure modes

- **Character drifts after frame 1** — start image was too dynamic (extreme angle, motion blur). Use a clean medium close-up start frame.
- **Cinematic camera move appeared** — prompt mentioned "shot," "scene," or any cinematography term. Strip to motion-only vocabulary.
- **Robotic / unnatural motion** — described too many beats. Cut to one or two micro-actions.
- **Lips out of sync with intended dialogue** — Kling has no audio model; lips will move generically. Run `/swap-voice` to align dialogue precisely.

## How it pairs

The natural pipeline:

1. `/hyperreal-image` → 2K PNG of believable character in setting
2. `/hyperreal-video` → MP4 with subtle motion, character identity locked from the PNG
3. `/clone-voice` → voice ID
4. `/swap-voice` → MP4 with the right voice talking
5. `/add-captions` → final post-ready MP4
