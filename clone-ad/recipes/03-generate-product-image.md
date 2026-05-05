# Recipe 03 — Generate the product image

## Goal

Produce a clean product hero shot at `product/product.png` that Seedance can use as the i2v anchor in step 5. Skip if the user already has a usable image.

## Steps

1. Read `references/product-image-rules.md` for what makes a Seedance-friendly product image.

2. Decide the path:

   - **User already has an image** → run it through the rules in `references/product-image-rules.md`. If it passes (white seamless, even lighting, single product, no fine typography on a hero label, product fills 60–80% of frame), skip generation. Copy or symlink it to `product/product.png` and write the source spec to `product/product-prompt.md`.

   - **User does NOT have an image (or theirs fails the checks)** → continue to generate.

3. Ask the user for a precise product description. Press for specifics:

   - Exact shape (cylindrical / rectangular / tapered / spherical)
   - Material and finish (matte / satin / gloss / brushed / fabric / glass)
   - Color (with explicit shade name — "warm forest green," "matte charcoal")
   - Size and proportions (height vs width, capacity)
   - Any logos or text the user wants in the hero (note: Seedance will mangle fine type — see `product-image-rules.md`)

4. Build the prompt using the template in `references/product-image-rules.md`:

   ```
   <exact product description: shape, material, color, size, finish>
   photographed on a pure white seamless backdrop, studio softbox lighting,
   even illumination, no harsh highlights, no deep shadow, product centered
   filling 70% of frame, square 2048×2048, photorealistic, sharp focus on
   the product, depth of field gently falling off behind the product,
   no text overlay, no watermark, no logo if not part of the product,
   no other objects in the frame.
   ```

5. **Pick the model:**

   - **Nano Banana 2 (default)** — product-only hero shot, no people in frame, no typography on the label that needs to read. Cleaner edges on white seamless. See `references/wavespeed-nano-banana-2.md`.
   - **GPT Image 2** — start frame includes a person + a brand-labeled product, OR the product has a wordmark on the label that must read. Renders typography much more cleanly than Nano Banana. See `references/wavespeed-gpt-image-2.md` (different schema — `aspect_ratio` + `resolution`, NOT `size`).

   Call the chosen model:

   ```json
   // Nano Banana 2 (default)
   { "prompt": "<the prompt>", "size": "2048*2048", "num_images": 1 }

   // GPT Image 2 (typography or person+product)
   { "prompt": "<the prompt>", "aspect_ratio": "9:16", "resolution": "1k", "quality": "medium", "num_images": 1 }
   ```

   Poll, download, save to `product/product.png`. Save the prompt and which model you used to `product/product-prompt.md`.

6. Inspect the result:
   - Pure white background, no environment
   - Product fills the frame correctly
   - No warping or extra duplicate products
   - No other objects in the scene
   - If the product has typography, is it legible and correct?

   If any check fails, regenerate. Budget 2–3 iterations. Once it's good, lock it.

## Output

```
product/product.png
product/product-prompt.md
```

## Done when

- The image passes every rule in `references/product-image-rules.md`
- The user has confirmed the product image looks right

## Cost

- Nano Banana 2 — ~$0.04 per image at 2048×2048, 30–90s wall time
- GPT Image 2 — ~$0.06 per image at 1k/medium, 20–60s wall time (~$0.22 at high quality, only needed for tight typography)

## Reuse

This image is reused on every Seedance regeneration. Generate once, reuse many times.

## Next

→ `recipes/04-rewrite-shot-list-for-product.md`
