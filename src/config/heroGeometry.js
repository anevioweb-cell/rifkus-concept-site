/**
 * Bag geometry inside the hero stage (keep in sync with HeroScene.jsx's Bag
 * markup and the --bag-cy default in styles/hero.css):
 * the image wrapper is inset 1 % left/right, 0 top, 4 % bottom of the 4:5
 * stage; the bag canvas is object-contain; `flavorImages[slug].bag` tells
 * where the bag sits inside its canvas.
 */
const WRAP = { x: 0.01, top: 0, bottom: 0.04 };

/** Bag center (px, section coordinates) from the stage box and the bag data. */
export function bagCenter({ left, top, width, height }, image) {
  const ww = width * (1 - 2 * WRAP.x);
  const wh = height * (1 - WRAP.top - WRAP.bottom);
  const wx = left + width * WRAP.x;
  const wy = top + height * WRAP.top;
  const ar = image.width / image.height;
  const cw = ww / wh > ar ? wh * ar : ww;
  const ch = ww / wh > ar ? wh : ww / ar;
  const cx = wx + (ww - cw) / 2;
  const cy = wy + (wh - ch) / 2;
  const b = image.bag ?? { x0: 0, y0: 0, x1: 1, y1: 1 };
  return { x: cx + (cw * (b.x0 + b.x1)) / 2, y: cy + (ch * (b.y0 + b.y1)) / 2 };
}
