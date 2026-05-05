# 01 — Fetch the topic post

Take the URL the user gave you. Scrape Creators handles every IG post type (`/p/`, `/reel/`, `/tv/`); for TikTok and X, Scrape Creators has parallel endpoints — the one for IG is shown here.

## Endpoint

```
GET https://api.scrapecreators.com/v1/instagram/post?url=<post URL>
x-api-key: $SCRAPE_CREATORS_API
```

Strip query params (e.g. `?img_index=7&igsh=…`) before passing — they break the lookup.

## Branch on `__typename`

The response under `.data.xdt_shortcode_media.__typename` tells you the media type:

| `__typename` | Means | What to grab |
|---|---|---|
| `XDTGraphSidecar` | Carousel | `edge_sidecar_to_children.edges[].node.display_url` (1-indexed) |
| `XDTGraphVideo` | Reel / video | `video_url` |
| `XDTGraphImage` | Single image | `display_url` |

All three are valid topic seeds for this skill. Save to `topic/post_<shortcode>.json`.

## Steps

1. **Make working dir.** `newsjack-carousel-<YYYYMMDD-HHMM>/topic/`
2. **GET the post.** Save the full body to `topic/post_<shortcode>.json`.
3. **Capture caption + author.** `edge_media_to_caption.edges[0].node.text` and `owner.username`. Save to `topic/meta.json`.
4. **Download the media:**
   - **Carousel** — download every child `display_url` to `topic/images/slide_<N>.jpg`
   - **Video/Reel** — download `video_url` to `topic/reference.mp4`, then extract frames: `ffmpeg -y -i topic/reference.mp4 -vf "fps=1/3" topic/frames/frame_%02d.jpg -loglevel error`
   - **Single image** — download `display_url` to `topic/image.jpg`
5. **Print a one-line summary.** Type, author, frame count, caption preview. Helps you confirm you grabbed the right post before burning Gemini credits.

## Output

```
newsjack-carousel-<ts>/topic/
├── post_<shortcode>.json
├── meta.json                  # { author, caption, type, shortcode }
├── reference.mp4              # if video/reel
├── frames/                    # if video/reel
│   └── frame_*.jpg
├── images/                    # if carousel
│   └── slide_*.jpg
└── image.jpg                  # if single image
```

## Failure modes

- **404** — URL has trailing query params or wrong domain. Strip and retry.
- **`message: "Not Found"`** — wrong endpoint path. Use `/v1/instagram/post`, not `/v2/instagram/media`.
- **CloudFront 403 on `display_url` download** — the signed URLs expire fast. Re-fetch the post from Scrape Creators (free) and download immediately.
- **Private / paywalled post** — Scrape Creators returns sparse JSON. Tell the user and stop; cannot newsjack what we can't see.
