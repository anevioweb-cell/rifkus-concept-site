/**
 * Suggest a focal point for every hero background (dev only):
 *   node scripts/images/focal.mjs            # all scenes
 *   node scripts/images/focal.mjs zfiti      # one scene
 *
 * For each base image (desktop and mobile) it builds a coarse grid of cells
 * on a 192 px wide grayscale copy and measures, per cell, the mean
 * brightness and the edge density (mean absolute difference to the right
 * and lower neighbors). Then, weighted by a Gaussian centrality term
 * (the scenes are composed around the middle):
 *   'burst' → the densest bright cluster  (edge × brightness)
 *   'calm'  → the calmest region          ((1 − edge) × mid brightness)
 * The best 3×3 neighborhood gives a weighted centroid, in % of the image.
 *
 * It only SUGGESTS: look at every result, then store the checked values in
 * src/data/heroScenes.js (manual values win). Writes the suggestions to
 * scripts/images/focal-suggestions.json too.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { heroScenes } from '../../src/data/heroScenes.js';

const root = path.resolve(import.meta.dirname, '../..');
const RAW = path.join(root, 'public/images/_raw/backgrounds');
const EXT = ['png', 'jpg', 'jpeg', 'webp'];

export async function findBackground(slug, kind) {
  for (const ext of EXT) {
    const file = path.join(RAW, `${slug}-${kind}.${ext}`);
    try {
      await fs.access(file);
      return file;
    } catch {
      // try the next extension
    }
  }
  return null;
}

export async function suggestFocal(file, mode = 'burst') {
  const W = 192;
  const { data, info } = await sharp(file).resize({ width: W }).grayscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => data[y * w + x] / 255;
  const cols = 24;
  const cell = w / cols;
  const rows = Math.max(4, Math.round(h / cell));
  const ch = h / rows;
  const grid = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let b = 0;
      let e = 0;
      let n = 0;
      for (let y = Math.floor(r * ch); y < Math.min(h - 1, Math.floor((r + 1) * ch)); y++) {
        for (let x = Math.floor(c * cell); x < Math.min(w - 1, Math.floor((c + 1) * cell)); x++) {
          const v = at(x, y);
          b += v;
          e += Math.abs(v - at(x + 1, y)) + Math.abs(v - at(x, y + 1));
          n++;
        }
      }
      grid.push({ r, c, b: b / n, e: e / n });
    }
  }
  const maxE = Math.max(...grid.map((g) => g.e));
  const score = (g) => {
    const cx = (g.c + 0.5) / cols - 0.5;
    const cy = (g.r + 0.5) / rows - 0.5;
    const central = Math.exp(-(cx * cx + cy * cy) / (2 * 0.22 * 0.22));
    const e = g.e / maxE;
    const s = mode === 'calm' ? (1 - e) * (1 - Math.abs(g.b - 0.35)) : e * g.b;
    return s * central;
  };
  grid.forEach((g) => (g.s = score(g)));
  const get = (r, c) => grid[r * cols + c];
  let best = null;
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      let sum = 0;
      let sx = 0;
      let sy = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const g = get(r + dr, c + dc);
          sum += g.s;
          sx += g.s * (g.c + 0.5);
          sy += g.s * (g.r + 0.5);
        }
      }
      if (!best || sum > best.sum) best = { sum, x: sx / sum, y: sy / sum };
    }
  }
  return { x: Math.round((best.x / cols) * 1000) / 10, y: Math.round((best.y / rows) * 1000) / 10 };
}

// CLI
if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const only = process.argv.slice(2);
  // Only the requested slugs are recomputed; the others keep their last suggestion.
  const suggestionsFile = path.join(import.meta.dirname, 'focal-suggestions.json');
  const out = only.length ? JSON.parse(await fs.readFile(suggestionsFile, 'utf8').catch(() => '{}')) : {};
  for (const slug of Object.keys(heroScenes).filter((s) => !only.length || only.includes(s))) {
    const scene = heroScenes[slug];
    out[slug] = {};
    for (const kind of ['desktop', 'mobile']) {
      const file = await findBackground(scene.base ?? slug, kind);
      if (!file) {
        out[slug][kind] = null;
        continue;
      }
      const suggestion = await suggestFocal(file, scene.focalMode);
      out[slug][kind] = suggestion;
      const stored = scene.focal[kind];
      const delta = stored ? `stored ${stored.x}/${stored.y}, Δ ${(suggestion.x - stored.x).toFixed(1)}/${(suggestion.y - stored.y).toFixed(1)}` : 'not stored';
      console.log(`${slug.padEnd(8)} ${kind.padEnd(7)} ${scene.focalMode.padEnd(5)} suggest x ${suggestion.x}% y ${suggestion.y}%  (${delta})`);
    }
  }
  await fs.writeFile(suggestionsFile, `${JSON.stringify(out, null, 2)}\n`);
}
