/**
 * Static CSS for the hero scenes (server-rendered once as a <style> in
 * HeroSlider): per-scene variables, piece placement and motes. Separate
 * module so HeroScene.jsx only exports components (fast refresh).
 */
/** Portrait screens get the mobile base image (same query as hero.css vars). */
export const TALL_MEDIA = '(max-aspect-ratio: 4/5)';
const f3 = (n) => Math.round(n * 1000) / 1000;

/**
 * Deterministic motes (sparks / dust) per scene: same markup and CSS on the
 * server and the client (seeded, no Math.random in render).
 */
const MOTES = {
  mhadjeb: { n: 14, color: 'var(--color-bg)', glow: '0 0 8px 3px var(--color-bg)', size: [2, 5] }, // warm steam specks
  zfiti: { n: 18, color: 'var(--color-brand-soft)', glow: '0 0 8px 2px var(--color-zfiti)', size: [2, 5] },
  harissa: { n: 14, color: 'var(--color-brand-soft)', glow: '0 0 6px 1px var(--color-heat)', size: [2, 4] },
  pizza: { n: 16, color: 'var(--color-bg)', glow: 'none', size: [2, 4] },
  ketchup: { n: 10, color: 'var(--color-heat)', glow: 'none', size: [3, 6] },
  chicken: { n: 14, color: 'var(--color-brand-soft)', glow: '0 0 6px 1px var(--color-brand)', size: [2, 4] },
};
export function moteList(slug) {
  const cfg = MOTES[slug] ?? MOTES.pizza;
  let seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 7);
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: cfg.n }, () => ({
    size: f3(cfg.size[0] + rnd() * (cfg.size[1] - cfg.size[0])),
    t: f3(5 + rnd() * 5),
    d: f3(rnd() * 9),
    dx: Math.round(rnd() * 60 - 30),
    o: f3(0.5 + rnd() * 0.5),
    left: Math.round(5 + rnd() * 90),
    top: Math.round(45 + rnd() * 55),
    color: cfg.color,
    glow: cfg.glow,
  }));
}

/**
 * Static per-scene CSS (one <style>, server-rendered): focal fraction,
 * aspect ratio, scale hint, tint, pocket / glow strength and the desktop
 * mirror of the base image; the placement of every ingredient piece on its
 * ellipse around the bag center; the motes.
 */
export function sceneCss(slides) {
  return slides
    .map(({ flavor, scene, images }) => {
      const sel = `[data-scene="${flavor.slug}"]`;
      const d = images.desktop;
      const mob = images.mobile;
      const flip = Boolean(scene.flip?.desktop);
      const fx = flip ? 1 - d.focal.x / 100 : d.focal.x / 100;
      const common = `--tint:var(--color-${scene.tint});--pocket:${scene.pocket};--glow:${scene.glow};--shade:${scene.shade ?? 0};`;
      let css = `${sel}{${common}--fx:${f3(fx)};--fy:${f3(d.focal.y / 100)};--ar:${f3(d.width / d.height)};--k:${scene.scale.desktop}}`;
      if (flip) css += `${sel} .scene-base img{transform:scaleX(-1)}`;
      const phone = scene.phone ? `--pocket:${scene.phone.pocket ?? scene.pocket};--glow:${scene.phone.glow ?? scene.glow};` : '';
      css += `@media ${TALL_MEDIA}{${sel}{--fx:${f3(mob.focal.x / 100)};--fy:${f3(mob.focal.y / 100)};--ar:${f3(mob.width / mob.height)};--k:${scene.scale.mobile};${phone}}${flip ? `${sel} .scene-base img{transform:none}` : ''}}`;
      for (const p of scene.pieces) {
        const rad = (p.angle * Math.PI) / 180;
        const cx = f3(Math.cos(rad) * p.dist * 0.5);
        const cy = f3(Math.sin(rad) * p.dist * 0.5 * 1.25);
        css +=
          `${sel} [data-piece="${p.id}${p.key ? `-${p.key}` : ''}"]{width:calc(var(--tile-w) * ${p.size} * var(--piece-k));` +
          `left:calc(var(--bag-cx) + var(--tile-w) * ${cx} - var(--tile-w) * ${f3(p.size / 2)} * var(--piece-k));` +
          `top:calc(var(--bag-cy) + var(--tile-w) * ${cy} - var(--tile-w) * ${f3(p.size / 2)} * var(--piece-k));` +
          `--rot:${p.rot}deg;--drift-t:${p.drift ?? 9}s;--drift-d:-${f3((p.angle % 90) / 10)}s${p.depth === 'front' ? ';filter:blur(2px)' : ''}}`;
      }
      moteList(flavor.slug).forEach((mo, i) => {
        css +=
          `${sel} [data-mote="${i}"]{left:${mo.left}%;top:${mo.top}%;width:${mo.size}px;height:${mo.size}px;` +
          `background:${mo.color};box-shadow:${mo.glow};--mote-t:${mo.t}s;--mote-d:-${mo.d}s;--mote-dx:${mo.dx}px;--mote-o:${mo.o}}`;
      });
      return css;
    })
    .join('');
}
