/**
 * Image pipeline (run locally): `npm run images`
 *
 * 1. Background removal happens BEFORE this script, locally, with
 *    ../tools/remove-bg.py (rembg in a venv outside the project). Its output
 *    lands in public/images/_raw/cutouts/ (git-ignored).
 * 2. This script reads scripts/images/manifest.json and for every flavor:
 *    - trims transparent margins,
 *    - places the bag on a 3:4 canvas, bottom-aligned, with the SAME bag
 *      height ratio (94 %) for all flavors (wide bags are width-limited),
 *    - writes WebP with alpha at 480/800/1200/1600 px wide, never upscaling
 *      (the native width is added when it is not covered by the list),
 *    - writes a 15x20 px blur placeholder (inline data URI, exact 3:4).
 * 3. Crops real photos (manifest.photos) to a fixed box, never retouching
 *    them, and writes WebP at the listed widths plus a 4:5 blur placeholder.
 *    `backdrop: true` also writes a tiny 40 px WebP used as a blurred
 *    full-bleed backdrop (the browser's upscaling does the blur).
 * 4. Hero scenes (manifest.scenes + src/data/heroScenes.js): provided base
 *    backgrounds (png/jpg/jpeg/webp), retouch boxes softened, a 9:16 mobile
 *    crop derived around the focal point when no mobile file exists, and
 *    ingredient elements (alpha). Never upscaled.
 * 5. Open Graph images, 1200x630 JPEG in public/images/og/: an SVG
 *    rasterized, or (`scene`) a hero scene's base with its real bag on a
 *    dark gradient.
 * 6. Generates src/data/images.generated.js (do not edit by hand).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const raw = path.join(root, 'public/images/_raw');
const manifest = JSON.parse(await fs.readFile(path.join(import.meta.dirname, 'manifest.json'), 'utf8'));

const WIDTHS = [480, 640, 800, 1200, 1600];
const BAG_HEIGHT_RATIO = 0.94;
const MAX_BAG_WIDTH_RATIO = 0.96;
const ASPECT = 3 / 4; // width / height
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
/** AVIF twin of every bag, photo and scene WebP (served first through <picture>; checked at 100 %). */
const AVIF = { bag: 50, photo: 50, scene: 45 };
const srcSetOf = (files, key = 'url') => files.map((f) => `${f[key]} ${f.width}w`).join(', ');

const report = [];
const flavorImages = {};

for (const { slug, cutout, quality: bagQuality = 82 } of manifest.flavors) {
  const trimmed = await sharp(path.join(raw, cutout)).ensureAlpha().trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = trimmed.info;

  // Canvas so that the bag uses 94 % of the height, unless it is too wide.
  let H = Math.round(h / BAG_HEIGHT_RATIO);
  let W = Math.round(H * ASPECT);
  if (w > W * MAX_BAG_WIDTH_RATIO) {
    W = Math.round(w / MAX_BAG_WIDTH_RATIO);
    H = Math.round(W / ASPECT);
  }
  const canvas = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: trimmed.data, left: Math.round((W - w) / 2), top: Math.round(H - h - H * 0.02) }])
    .png()
    .toBuffer();

  let widths = WIDTHS.filter((x) => x <= W);
  if (!widths.length || widths[widths.length - 1] < W * 0.9) widths.push(W);
  widths = [...new Set(widths)];

  const outDir = path.join(root, 'public/images/flavors', slug);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  const files = [];
  for (const width of widths) {
    const file = `${slug}-${width}.webp`;
    const info = await sharp(canvas).resize({ width }).webp({ quality: bagQuality, alphaQuality: 90, effort: 6 }).toFile(path.join(outDir, file));
    const avif = file.replace('.webp', '.avif');
    const ai = await sharp(canvas).resize({ width }).avif({ quality: AVIF.bag, effort: 6 }).toFile(path.join(outDir, avif));
    files.push({ width, url: `/images/flavors/${slug}/${file}`, avifUrl: `/images/flavors/${slug}/${avif}`, bytes: info.size, avifBytes: ai.size });
  }
  // 15x20 = exactly the 3:4 canvas ratio (no aspect-ratio mismatch).
  const ph = await sharp(canvas).resize(15, 20, { fit: 'fill' }).webp({ quality: 40 }).toBuffer();
  const pick = files.find((f) => f.width >= 800) ?? files[files.length - 1];
  flavorImages[slug] = {
    src: pick.url,
    srcSet: srcSetOf(files),
    avifSrcSet: srcSetOf(files, 'avifUrl'),
    width: W,
    height: H,
    placeholder: `data:image/webp;base64,${ph.toString('base64')}`,
    // Where the bag sits inside its canvas (fractions), for the hero's
    // scene alignment (the scene focal point goes behind the bag center).
    bag: {
      x0: Math.round(((W - w) / 2 / W) * 1e4) / 1e4,
      y0: Math.round(((H - h - Math.round(H * 0.02)) / H) * 1e4) / 1e4,
      x1: Math.round(((W + w) / 2 / W) * 1e4) / 1e4,
      y1: Math.round(((H - Math.round(H * 0.02)) / H) * 1e4) / 1e4,
    },
  };
  report.push(
    `${slug.padEnd(13)} source ${w}x${h} -> canvas ${W}x${H} | ${files.map((f) => `${f.width}w ${kb(f.bytes)} (avif ${kb(f.avifBytes)})`).join(' | ')}`,
  );
}

const photoImages = {};
for (const { id, source, crop, widths, quality = 76, backdrop = false } of manifest.photos ?? []) {
  const base = sharp(path.join(raw, source)).extract(crop).toColorspace('srgb');
  const master = await base.png().toBuffer();
  const outDir = path.join(root, 'public/images/photos', id);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  const files = [];
  for (const width of widths.filter((x) => x <= crop.width)) {
    const file = `${id}-${width}.webp`;
    const info = await sharp(master).resize({ width }).webp({ quality, effort: 6, smartSubsample: true }).toFile(path.join(outDir, file));
    const avif = file.replace('.webp', '.avif');
    await sharp(master).resize({ width }).avif({ quality: AVIF.photo, effort: 6 }).toFile(path.join(outDir, avif));
    files.push({ width, url: `/images/photos/${id}/${file}`, avifUrl: `/images/photos/${id}/${avif}`, bytes: info.size });
  }
  const phW = 16;
  const phH = Math.round((phW * crop.height) / crop.width);
  const ph = await sharp(master).resize(phW, phH, { fit: 'fill' }).webp({ quality: 40 }).toBuffer();
  const entry = {
    src: (files.find((f) => f.width >= 960) ?? files[files.length - 1]).url,
    srcSet: srcSetOf(files),
    avifSrcSet: srcSetOf(files, 'avifUrl'),
    width: crop.width,
    height: crop.height,
    placeholder: `data:image/webp;base64,${ph.toString('base64')}`,
  };
  if (backdrop) {
    const file = `${id}-backdrop.webp`;
    const info = await sharp(master).resize({ width: 40 }).blur(1.2).webp({ quality: 50 }).toFile(path.join(outDir, file));
    entry.backdrop = `/images/photos/${id}/${file}`;
    files.push({ width: 'backdrop', bytes: info.size });
  }
  photoImages[id] = entry;
  report.push(
    `${id.padEnd(13)} crop ${crop.width}x${crop.height} | ${files.map((f) => `${f.width}${typeof f.width === 'number' ? 'w' : ''} ${kb(f.bytes)}`).join(' | ')}`,
  );
}

// Hero scenes: base backgrounds (+ derived mobile crop, retouch boxes) and
// ingredient elements. Focal points come from src/data/heroScenes.js.
const sceneImages = {};
const elementImages = {};
if (manifest.scenes) {
  const { heroScenes } = await import('../../src/data/heroScenes.js');
  const { findBackground } = await import('./focal.mjs');
  const cfg = manifest.scenes;
  const outDir = path.join(root, 'public/images/scenes');
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(path.join(outDir, 'elements'), { recursive: true });

  // Soften boxes (garbled AI pseudo-text) with a local blur; nothing else is edited.
  const retouched = async (file, boxes) => {
    let img = sharp(file).toColorspace('srgb');
    if (!boxes.length) return img.png().toBuffer();
    const base = await img.png().toBuffer();
    const patches = [];
    for (const [x, y, w, h] of boxes) {
      const patch = await sharp(base).extract({ left: x, top: y, width: w, height: h }).blur(4).png().toBuffer();
      patches.push({ input: patch, left: x, top: y });
    }
    return sharp(base).composite(patches).png().toBuffer();
  };

  for (const slug of Object.keys(heroScenes)) {
    const scene = heroScenes[slug];
    const entry = {};
    const sizes = [];
    for (const kind of ['desktop', 'mobile']) {
      let file = await findBackground(scene.base ?? slug, kind);
      let derived = false;
      if (!file && kind === 'mobile') {
        file = await findBackground(scene.base ?? slug, 'desktop');
        derived = Boolean(file);
      }
      if (!file) continue;
      const boxes = (scene.retouch ?? []).filter((r) => r.image === (derived ? 'desktop' : kind)).map((r) => r.box);
      let master = await retouched(file, boxes);
      let { width, height } = await sharp(master).metadata();
      let focal = scene.focal[derived ? 'desktop' : kind];
      if (derived) {
        // 9:16 crop around the desktop focal point, full height (lower resolution).
        const cw = Math.round((height * 9) / 16);
        const left = Math.min(width - cw, Math.max(0, Math.round((focal.x / 100) * width - cw / 2)));
        master = await sharp(master).extract({ left, top: 0, width: cw, height }).png().toBuffer();
        focal = { x: Math.round((((focal.x / 100) * width - left) / cw) * 1000) / 10, y: focal.y };
        width = cw;
      }
      const widths = [...new Set([...cfg[kind].filter((w) => w < width), Math.min(width, Math.max(...cfg[kind]))])];
      const files = [];
      for (const w of widths) {
        const name = `${slug}-${kind}-${w}.webp`;
        const info = await sharp(master)
          .resize({ width: w })
          .webp({ quality: cfg.qualityBySlug?.[slug] ?? cfg.quality, effort: 6, smartSubsample: true })
          .toFile(path.join(outDir, name));
        const avif = name.replace('.webp', '.avif');
        const ai = await sharp(master).resize({ width: w }).avif({ quality: AVIF.scene, effort: 6 }).toFile(path.join(outDir, avif));
        files.push({ width: w, url: `/images/scenes/${name}`, avifUrl: `/images/scenes/${avif}` });
        sizes.push(`${kind}${derived ? ' (derived)' : ''} ${w}w ${kb(info.size)} (avif ${kb(ai.size)})`);
      }
      entry[kind] = {
        src: files.at(-1).url,
        srcSet: srcSetOf(files),
        avifSrcSet: srcSetOf(files, 'avifUrl'),
        width,
        height,
        focal,
        origin: derived ? 'derived' : 'provided',
      };
    }
    if (entry.desktop && !entry.mobile) entry.mobile = entry.desktop;
    sceneImages[slug] = entry;
    report.push(`${(slug + ' scene').padEnd(13)} ${sizes.join(' | ')}`);
  }

  const elementsDir = path.join(raw, 'elements');
  let elementFiles = [];
  try {
    elementFiles = (await fs.readdir(elementsDir)).filter((f) => /\.(png|webp)$/i.test(f));
  } catch {
    // no elements yet
  }
  for (const f of elementFiles) {
    const id = f.replace(/\.[^.]+$/, '');
    const trimmed = await sharp(path.join(elementsDir, f)).ensureAlpha().trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
    const files = [];
    for (const w of cfg.elements.filter((x) => x <= trimmed.info.width).concat(trimmed.info.width < cfg.elements[0] ? [trimmed.info.width] : [])) {
      const name = `${id}-${w}.webp`;
      await sharp(trimmed.data)
        .resize({ width: w })
        .webp({ quality: 80, alphaQuality: 90, effort: 6 })
        .toFile(path.join(outDir, 'elements', name));
      files.push({ width: w, url: `/images/scenes/elements/${name}` });
    }
    elementImages[id] = {
      src: files.at(-1).url,
      srcSet: files.map((x) => `${x.url} ${x.width}w`).join(', '),
      width: trimmed.info.width,
      height: trimmed.info.height,
    };
  }
  if (elementFiles.length) report.push(`elements      ${elementFiles.length} pieces`);
}

const ogDir = path.join(root, 'public/images/og');
await fs.mkdir(ogDir, { recursive: true });
for (const { id, svg, scene, bag } of manifest.og) {
  let input;
  if (svg) input = await sharp(path.join(raw, svg), { density: 144 }).resize(1200, 630).png().toBuffer();
  else {
    const { findBackground } = await import('./focal.mjs');
    const base = await sharp(await findBackground(scene, 'desktop'))
      .resize(1200, 630, { fit: 'cover' })
      .toBuffer();
    // Ink gradient (darker at the start, a pocket behind the bag) so the bag reads first.
    const shade = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs>' +
        '<linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="#160709" stop-opacity=".7"/><stop offset=".6" stop-color="#160709" stop-opacity=".25"/><stop offset="1" stop-color="#160709" stop-opacity=".55"/></linearGradient>' +
        '<radialGradient id="p" cx=".62" cy=".52" r=".38"><stop offset="0" stop-color="#160709" stop-opacity=".55"/><stop offset="1" stop-color="#160709" stop-opacity="0"/></radialGradient>' +
        '</defs><rect width="1200" height="630" fill="url(#l)"/><rect width="1200" height="630" fill="url(#p)"/></svg>',
    );
    const bagImg = await sharp(path.join(raw, bag)).trim({ threshold: 1 }).resize({ height: 560 }).png().toBuffer({ resolveWithObject: true });
    input = await sharp(base)
      .composite([
        { input: shade, left: 0, top: 0 },
        { input: bagImg.data, left: Math.round(744 - bagImg.info.width / 2), top: 35 },
      ])
      .png()
      .toBuffer();
  }
  const info = await sharp(input)
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(ogDir, `${id}.jpg`));
  report.push(`${id.padEnd(13)} 1200x630 jpeg ${kb(info.size)}`);
}

const header = '// Generated by scripts/images/build-images.mjs. Do not edit by hand.\n';
await fs.writeFile(
  path.join(root, 'src/data/images.generated.js'),
  `${header}export const flavorImages = ${JSON.stringify(flavorImages, null, 2)};\n\nexport const photoImages = ${JSON.stringify(photoImages, null, 2)};\n\nexport const sceneImages = ${JSON.stringify(sceneImages, null, 2)};\n\nexport const elementImages = ${JSON.stringify(elementImages, null, 2)};\n`,
);
console.log(report.join('\n'));
