# 03 — Pick the visual format

Two paths depending on whether the user provided a second URL as a format reference.

## Path A — User provided a format reference URL

Fetch and analyze it the same way `clone-carousel` does:

1. Scrape Creators GET on the format URL (must return `XDTGraphSidecar` — single images and videos can't carry format signal).
2. Download every slide to `format/images/slide_<N>.jpg`.
3. Read the slides yourself and write `format/format.md` answering:
   - Background color
   - Brand-color usage (heading? accent words? logo?)
   - Body-copy color
   - Photograph treatment (full-bleed? rounded card lower half? overlapping logo?)
   - Typography hierarchy (heading style, body style, accent motif like single-italic-word)
   - Cover rule, middle-slide rule, closer rule
   - Caption pattern (hook shape, payoff length, CTA mechanic, hashtag mix)

Steal everything except the brand color and the words.

## Path B — No format reference

Default to a clean tech-announcement format that works for any AI/SaaS news:

- 4:5 vertical, pure-black background
- **Brand color** = user's own (pull from memory; ask once if unknown). For the cover and headings; never the source's color.
- White body copy
- Photograph lower-half in a rounded-corner card (50% of frame); top half is solid black with text
- Cover: 4-line headline, brand color on the news + the value-prop verbs, white on connectives. Small "AI / creative / LAB"-style brand mark top-left. Small white "SWIPE" pill bottom-right.
- Body slides: brand-color two-line heading top-left, white uppercase one-line subhead, 3-line body in regular-weight white sans, photo card lower half.
- Closer: 3-line headline (brand color on the question word), white CTA pill anchored lower-third, optional small icon mid-frame.

Save the resolved format to `format/format.md` regardless of path so the slide-spec writer reads from one source.

## Brand color resolution

Check memory for the user's brand. If unknown:

1. Ask once: "What's your account's primary brand color (hex or natural-language description)?"
2. Save the answer to `~/.claude/projects/<project>/memory/user_brand_color.md` so this never asks twice.
3. Use that color for headings + accent words across every slide.

## Output

```
newsjack-carousel-<ts>/format/
├── post_<shortcode>.json     # only if Path A
├── images/slide_*.jpg        # only if Path A
└── format.md                 # always — the resolved format brief
```

## Why this exists separate from analysis

The analysis step describes the SOURCE's visual style (which we ignore for format). This step describes the OUTPUT's visual style. Keeping them separate prevents "make our carousel look like Higgsfield's" mistakes — we keep their color out of our brand.
