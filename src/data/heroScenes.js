/**
 * Home hero scenes (docs/IMAGES.md). Pure data: also read by the image
 * pipeline (scripts/images/build-images.mjs) and focal.mjs, so no imports.
 *
 * Base backgrounds are dropped in as files (public/images/_raw/backgrounds/
 * <slug>-desktop.<png|jpg|jpeg|webp> and <slug>-mobile.<ext>); `npm run
 * images` builds them and `node scripts/images/focal.mjs` suggests focal
 * points. The values below are the checked (manual) ones: they win.
 *
 * - `focal`: where the center of interest is, in % of the BASE image
 *   (desktop file / mobile file). The scene is positioned so this point
 *   sits exactly behind the center of the bag at every viewport.
 *   `focalMode`: what focal.mjs looks for ('burst' = densest bright cluster
 *   near the center, 'calm' = calmest region near the center).
 * - `scale`: extra zoom on top of the minimum cover (>= 1).
 * - `flip.desktop`: mirror the desktop image. The bag sits right of center
 *   on wide screens (62 %), so a focal point left of center would force a
 *   big upscale; mirrored, it lands near the bag. Food scenes only (any
 *   pseudo-text is softened by `retouch`).
 * - `mobileFrom: 'desktop'`: no mobile file yet, a 9:16 crop around the
 *   desktop focal point is derived by the pipeline (lower resolution).
 * - `retouch`: boxes [x, y, w, h] in source px that are softened by the
 *   pipeline (garbled AI pseudo-text on brush labels). Nothing else is ever
 *   edited.
 * - `tint`: flavor color token for the dark "pocket" and the rim glow behind
 *   the bag; `pocket` / `glow` are their strengths (0–1). `shade` (optional,
 *   0–1): extra ink behind the title block, for a bright base. `phone`
 *   (optional): { pocket, glow } on portrait screens.
 * - `pieces`: ingredient cutouts (public/images/_raw/elements/<file>.png,
 *   cut locally from the same backgrounds) placed on a loose ellipse around
 *   the bag: `angle` (deg, 0 = right, 90 = down), `dist` (× the bag stage
 *   half-width), `size` (× stage width), `rot` (deg), `depth` 'back' (behind
 *   the bag) or 'front' (blurred, crossing an edge or corner, never the print).
 *   `parallax`: px of pointer travel (back pieces move less than front).
 *   `key`: optional suffix when the same cutout is used twice in a scene.
 *   Pieces are shared across scenes (one element library, same lighting).
 * - `badge`: optional small badge on the bag stage ('new' on Mhadjeb only).
 * - `bagMax`: largest bag file (px) the hero may request (default 800).
 * - `base`: optional file name stem of the backgrounds when it differs from
 *   the slug (e.g. a regenerated set saved as `pizza2-desktop.jpeg`).
 */
export const heroSceneOrder = ['mhadjeb', 'zfiti', 'harissa', 'pizza', 'ketchup', 'chicken'];

export const heroScenes = {
  mhadjeb: {
    focalMode: 'burst',
    focal: { desktop: { x: 51.8, y: 50.1 }, mobile: { x: 50, y: 52 } }, // center griddle (desktop), lower tray between the folded mhadjeb (mobile); checked by eye
    scale: { desktop: 1, mobile: 1 },
    retouch: [],
    tint: 'zfiti',
    pocket: 0.7,
    glow: 0.5,
    shade: 0.55, // the bright griddles sit under the title at 1000 px (title contrast 2.1 without it)
    phone: { pocket: 0.85, glow: 0.22 }, // portrait: the orange glow blended with the bag's orange flames
    badge: 'new',
    pieces: [
      { id: 'mhadjeb-tomato-a', depth: 'back', angle: -150, dist: 0.95, size: 0.24, rot: -15, parallax: 8 },
      { id: 'mhadjeb-tomato-slice-a', depth: 'back', angle: -28, dist: 1.0, size: 0.17, rot: 20, parallax: 10 },
      { id: 'mhadjeb-onion-a', depth: 'back', angle: 165, dist: 1.0, size: 0.2, rot: -10, parallax: 9 },
      { id: 'mhadjeb-parsley-a', depth: 'back', angle: 25, dist: 1.02, size: 0.16, rot: 15, parallax: 10 },
      { id: 'mhadjeb-tomato-slice-b', depth: 'front', angle: 135, dist: 1.25, size: 0.14, rot: -20, parallax: 22 },
      { id: 'mhadjeb-parsley-a', depth: 'front', angle: -42, dist: 1.25, size: 0.12, rot: 140, parallax: 24, key: 'f' },
    ],
  },
  zfiti: {
    focalMode: 'burst',
    focal: { desktop: { x: 51.8, y: 49.3 }, mobile: { x: 46, y: 46 } }, // fire core; checked by eye
    scale: { desktop: 1, mobile: 1 },
    retouch: [],
    tint: 'zfiti',
    pocket: 0.7,
    glow: 0.55,
    pieces: [
      { id: 'zfiti-chip-a', depth: 'back', angle: -150, dist: 0.95, size: 0.26, rot: -20, parallax: 8 },
      { id: 'harissa-chili-a', depth: 'back', angle: 18, dist: 1.0, size: 0.3, rot: 40, parallax: 10 },
      { id: 'zfiti-parsley-a', depth: 'front', angle: 138, dist: 1.25, size: 0.12, rot: 10, parallax: 22 },
      { id: 'zfiti-chip-a', depth: 'front', angle: -40, dist: 1.25, size: 0.16, rot: 150, parallax: 24, key: 'f' },
    ],
  },
  harissa: {
    focalMode: 'burst',
    focal: { desktop: { x: 43.6, y: 43 }, mobile: { x: 43.6, y: 43 } }, // swirl center
    flip: { desktop: true }, // mirror on wide screens: the focal point moves right, toward the bag (less upscaling)
    scale: { desktop: 1, mobile: 1 },
    mobileFrom: 'desktop',
    retouch: [],
    tint: 'heat',
    pocket: 0.6,
    glow: 0.45,
    pieces: [
      { id: 'harissa-chili-a', depth: 'back', angle: 200, dist: 0.98, size: 0.3, rot: -30, parallax: 8 },
      { id: 'harissa-garlic-a', depth: 'back', angle: -30, dist: 0.95, size: 0.14, rot: 0, parallax: 10 },
      { id: 'harissa-thyme-a', depth: 'front', angle: 135, dist: 1.25, size: 0.2, rot: 0, parallax: 22 },
    ],
  },
  pizza: {
    focalMode: 'burst',
    focal: { desktop: { x: 42, y: 49 }, mobile: { x: 50, y: 50 } }, // sauce swirl, cheese strands stay visible on the right
    flip: { desktop: true }, // mirror on wide screens: the focal point moves right, toward the bag (less upscaling)
    scale: { desktop: 1, mobile: 1 },
    retouch: [],
    bagMax: 640, // busy print: caps the hero bag file so the slide stays under 200 KB on phones
    tint: 'brand',
    pocket: 0.6,
    glow: 0.4,
    pieces: [
      { id: 'pizza-tomato-a', depth: 'back', angle: -140, dist: 0.95, size: 0.22, rot: 10, parallax: 8 },
      { id: 'pizza-basil-a', depth: 'back', angle: 15, dist: 1.0, size: 0.17, rot: -20, parallax: 10 },
      { id: 'pizza-basil-b', depth: 'front', angle: 132, dist: 1.25, size: 0.15, rot: 15, parallax: 22 },
      { id: 'pizza-tomato-b', depth: 'front', angle: -42, dist: 1.25, size: 0.17, rot: 20, parallax: 24 },
    ],
  },
  ketchup: {
    focalMode: 'burst',
    focal: { desktop: { x: 48, y: 50 }, mobile: { x: 50, y: 49 } }, // splash crown
    flip: { desktop: true }, // mirror on wide screens: the focal point moves right, toward the bag (less upscaling)
    scale: { desktop: 1, mobile: 1 },
    retouch: [{ image: 'desktop', box: [860, 620, 70, 50] }], // brush label pseudo-text
    tint: 'heat',
    pocket: 0.75,
    glow: 0.5,
    pieces: [
      { id: 'ketchup-tomato-a', depth: 'back', angle: -150, dist: 0.95, size: 0.22, rot: 0, parallax: 8 },
      { id: 'ketchup-slice-a', depth: 'back', angle: 20, dist: 1.0, size: 0.2, rot: 0, parallax: 10 },
      { id: 'ketchup-tomato-b', depth: 'front', angle: 135, dist: 1.25, size: 0.16, rot: 10, parallax: 22 },
    ],
  },
  chicken: {
    focalMode: 'burst',
    focal: { desktop: { x: 43.8, y: 50 }, mobile: { x: 51, y: 48 } }, // seasoning swirl
    flip: { desktop: true }, // mirror on wide screens: the focal point moves right, toward the bag (less upscaling)
    scale: { desktop: 1, mobile: 1 },
    retouch: [
      { image: 'desktop', box: [835, 618, 65, 50] },
      { image: 'mobile', box: [510, 1208, 55, 40] },
    ], // brush label pseudo-text
    tint: 'brand',
    pocket: 0.55,
    glow: 0.6,
    pieces: [
      { id: 'chicken-chili-a', depth: 'back', angle: -145, dist: 0.98, size: 0.18, rot: -15, parallax: 8 },
      { id: 'chicken-chili-b', depth: 'back', angle: 25, dist: 1.0, size: 0.18, rot: 20, parallax: 10 },
      { id: 'harissa-thyme-a', depth: 'front', angle: 135, dist: 1.25, size: 0.2, rot: -10, parallax: 22 },
    ],
  },
};
