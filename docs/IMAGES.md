# Image pipeline

Everything runs locally; no image is uploaded to an online service.
- **Raw inputs:** `public/images/_raw/`, git-ignored.
- **Processed output:** `public/images/`, committed, together with `src/data/images.generated.js`.
- **Sources and licenses:** see `CREDITS.md`.

## Commands

| Step | Command | Output |
|---|---|---|
| 1. Remove a background | `python scripts/images/remove-bg.py public/images/_raw [model]` (needs `rembg`, installed outside the project; default model `isnet-general-use`) | `_raw/cutouts/<name>.png`, plus dark and light check images in `_raw/cutouts/_check/`. Look at every result at 100 % |
| 2. Suggest focal points | `node scripts/images/focal.mjs [slug]` | Printed suggestions for each hero background (desktop and mobile). Check them by eye, then store the final values in `src/data/heroScenes.js` |
| 3. Build web images | `npm run images` (sharp) | See below |

`npm run images` reads `scripts/images/manifest.json` and `src/data/heroScenes.js`:
- **Bags** → `public/images/flavors/<slug>/`.
  - Each cutout is trimmed and placed on a 3:4 canvas, bottom-aligned, at the same 94 % height ratio.
  - Exported as WebP and AVIF at 480 / 640 / 800 / 1200 / 1600 px, never larger than the source.
  - A 15×20 blur placeholder is inlined.
  - The bag's position inside its canvas is recorded, so the hero can center it.
- **Photos** → `public/images/photos/<id>/`: a fixed crop, never retouched; WebP and AVIF.
- **Hero scenes** → `public/images/scenes/`: desktop (960 / 1376) and mobile (540 / 768) backgrounds in WebP and AVIF, plus the ingredient pieces from `_raw/elements/`. Optional `retouch` boxes soften AI pseudo-text. A missing mobile file is derived as a 9:16 crop around the desktop focal point.
- **Open Graph image** → `public/images/og/og-home.jpg` (1200×630): the first slide's background and bag on an ink gradient.
- **Data** → `src/data/images.generated.js` (`flavorImages`, `photoImages`, `sceneImages`, `elementImages`). Do not edit it by hand.

Every image is served through `<picture>`, AVIF first with a WebP fallback (`src/lib/imageSources.js`).

## Hero scenes and the focal system

Each Home slide is a layered scene, from back to front:
1. the background;
2. a dark "pocket" and a glow in the flavor color;
3. ingredient pieces behind the bag;
4. the 3D bag;
5. blurred pieces in front;
6. motes;
7. grain.

**Centering.** The background is positioned so its **focal point** sits exactly behind the **bag center** at every viewport:
- **Shared variables.** The bag stage and the scene share CSS variables (`styles/hero.css`): `--tile-w` (stage width), `--stage-x` / `--stage-y`, and `--bag-cx` / `--bag-cy`. The bag center defaults to a CSS formula from the stage box, so the first paint is already aligned.
- **Scale.** The background is scaled to the smallest width that keeps the focal point under the bag with no edge exposed: `max(cx / fx, (W − cx) / (1 − fx), cy / fy × ar, (H − cy) / (1 − fy) × ar)`, plus 6 % overscan for the parallax. It is then translated to `cx − fx × w`, `cy − fy × h`.
- **Runtime correction.** After hydration, a ResizeObserver measures each stage (`offsetLeft/Top/Width/Height`, unaffected by transforms) and writes the exact bag center (`--bag-cx-m`, `--bag-cy-m`). Only `transform` changes, so there is no layout shift.

**Scene data format** (`src/data/heroScenes.js`, one entry per slug; `heroSceneOrder` sets the slide order):

```js
mhadjeb: {
  focalMode: 'burst',                       // what focal.mjs looks for: 'burst' or 'calm'
  focal: { desktop: { x: 51.8, y: 50.1 },   // % of the desktop background
           mobile:  { x: 50,   y: 52 } },   // % of the mobile background
  scale: { desktop: 1, mobile: 1 },         // extra zoom on top of the minimum cover
  flip: { desktop: false },                 // optional: mirror the desktop background
  retouch: [],                              // optional: [{ image, box: [x, y, w, h] }] softened areas
  tint: 'zfiti',                            // color token of the pocket and the glow
  pocket: 0.7, glow: 0.5,                   // strengths, 0–1
  shade: 0.55,                              // optional: extra ink behind the title block
  phone: { pocket: 0.85, glow: 0.22 },      // optional: portrait overrides
  badge: 'new',                             // optional: the "New" badge
  pieces: [                                 // ingredient cutouts on a loose ellipse
    { id: 'mhadjeb-tomato-a', depth: 'back', angle: -150, dist: 0.95, size: 0.24, rot: -15, parallax: 8 },
  ],
}
```

**Piece fields:**
- `angle`: degrees, 0 = right, 90 = down.
- `dist`: multiple of the stage half-width.
- `size`: multiple of the stage width.
- `depth`: `back` (behind the bag) or `front` (blurred, at an edge, never over the print; hidden on portrait phones).
- `parallax`: pixels of pointer travel.

## Adding a hero scene

1. Save `public/images/_raw/backgrounds/<slug>-desktop.<jpg|png|webp>` (16:9) and `<slug>-mobile.<ext>` (9:16).
2. Add the scene to `src/data/heroScenes.js` (and to `heroSceneOrder` to show it in the hero).
3. Run `node scripts/images/focal.mjs <slug>`, check the suggestion by eye, and store the final values.
4. Run `npm run images`.
