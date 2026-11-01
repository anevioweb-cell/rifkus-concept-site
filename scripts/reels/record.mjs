/**
 * Reel recordings (dev-only; not part of the build or `npm run check`).
 *   npm run build && node scripts/reels/record.mjs [clip ...]
 * Serves dist/ with `vite preview`, drives headless Chromium (Playwright from
 * ../tools, never a project dependency) under Chrome's VIRTUAL TIME: every
 * frame advances exactly 1/30 s and is then captured, so autoplay, CSS
 * animations, Lenis and the tilt springs move at true speed with no dropped
 * or doubled frames. Pointer and scroll paths are scripted (no jitter).
 * Frames are encoded with ffmpeg (H.264, yuv420p, 30 fps, CRF 18) into
 * release-media/ (git-ignored), plus cover PNGs. Screenshots never include
 * the cursor.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { preview } from 'vite';

const root = path.resolve(import.meta.dirname, '../..');
const out = path.join(root, 'release-media');
const { chromium } = createRequire(path.join(process.env.PLAYWRIGHT_DIR ?? path.resolve(root, '../tools'), 'package.json'))('playwright');
const FPS = 30;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2); // ease-in-out cubic
const lerp = (a, b, t) => a + (b - a) * t;

/*
 * Input under virtual time. Awaiting anything that needs a rendered frame
 * (Playwright's mouse, window.scrollTo) deadlocks while time is paused, so:
 * - pointer: a synthetic mouse PointerEvent (what the hero tilt listens to);
 * - hover: a raw CDP mouse move, fired without waiting (CSS :hover);
 * - scroll: fired without waiting; it lands during the next time step.
 */
const pointer = (page, x, y) =>
  page.evaluate(
    ([px, py]) => {
      const target = document.elementFromPoint(px, py) ?? document.body;
      target.dispatchEvent(new PointerEvent('pointermove', { clientX: px, clientY: py, pointerType: 'mouse', bubbles: true }));
    },
    [x, y],
  );
const hover = (cdp, x, y) => {
  cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }).catch(() => {});
};
const scroll = (page, y) => {
  page.evaluate((v) => window.scrollTo(0, v), Math.round(y)).catch(() => {});
};

/** Piecewise scroll path: [[second, y], ...] eased between keys. */
const scrollAt = (keys, s) => {
  if (s <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, y1] = keys[i];
    const [t0, y0] = keys[i - 1];
    if (s <= t1) return lerp(y0, y1, ease((s - t0) / (t1 - t0)));
  }
  return keys.at(-1)[1];
};

const clips = {
  // 1. Mobile 9:16 hero tour with the pointer tilting the bag, ending on the CTA.
  'hero-mobile': {
    seconds: 15,
    viewport: { width: 360, height: 640 },
    dpr: 3,
    url: '/',
    covers: [2.0, 6.4],
    async setup(page) {
      const cta = await page.evaluate(() => document.querySelector('section[aria-labelledby="home-cta"]').getBoundingClientRect().top + scrollY - 70);
      return {
        keys: [
          [0, 0],
          [12, 0],
          [14.2, cta],
        ],
      };
    },
    async frame(page, s, { keys }) {
      if (s < 12) await pointer(page, 180 + 70 * Math.sin(s * 1.1), 300 + 60 * Math.sin(s * 0.7 + 1));
      scroll(page, scrollAt(keys, s));
    },
  },
  // 2. Mobile 9:16 scroll through Home.
  'home-scroll-mobile': {
    seconds: 20,
    viewport: { width: 360, height: 640 },
    dpr: 3,
    url: '/',
    touch: true,
    covers: [9.5],
    async setup(page) {
      const y = await page.evaluate(() => {
        const top = (sel) => document.querySelector(sel).getBoundingClientRect().top + scrollY;
        return {
          intro: top('section[aria-labelledby="home-intro"]') - 60,
          flavors: top('section[aria-labelledby="home-flavors"]') - 66,
          card2: top('main ul.grid > li:nth-child(2)') - 80,
          card4: top('main ul.grid > li:nth-child(4)') - 80,
          why: top('section[aria-labelledby="home-why"]') - 66,
          cta: top('section[aria-labelledby="home-cta"]') - 66,
        };
      });
      return {
        keys: [
          [0, 0],
          [1.6, 0],
          [3.2, y.intro],
          [5.2, y.intro],
          [6.6, y.flavors],
          [7.4, y.flavors],
          [9, y.card2],
          [10.6, y.card2],
          [12.4, y.card4],
          [13.6, y.card4],
          [15.4, y.why],
          [17, y.why],
          [18.6, y.cta],
          [20, y.cta],
        ],
      };
    },
    async frame(page, s, { keys }) {
      scroll(page, scrollAt(keys, s));
    },
  },
  // 3. Desktop 16:9 hero tour with a pointer sweep over the bag (tilt + parallax).
  'hero-desktop': {
    seconds: 12,
    viewport: { width: 1920, height: 1080 },
    dpr: 1,
    url: '/',
    covers: [],
    async setup(page) {
      const b = await page.evaluate(() => {
        const r = document.querySelector('[data-stage]').getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
      });
      return { b };
    },
    async frame(page, s, { b }) {
      await pointer(page, b.x + b.w * 0.9 * Math.sin(s * 0.9), b.y + b.h * 0.35 * Math.sin(s * 1.3 + 0.6));
    },
  },
  // 4. Mobile 9:16 /flavors: a card hover, then the Hot filter.
  //    KNOWN ISSUE: on /flavors the virtual-time screen capture hangs
  //    at the first frame (Home is fine); the step timeouts now report it.
  'flavors-mobile': {
    seconds: 11,
    viewport: { width: 360, height: 640 },
    dpr: 3,
    url: '/flavors',
    covers: [3.5],
    async setup(page) {
      const card = await page.evaluate(() => document.querySelector('main ul.grid > li').getBoundingClientRect().top + scrollY - 80);
      return {
        keys: [
          [0, 0],
          [1.2, 0],
          [2.6, card],
          [6, card],
          [7.2, 0],
          [11, 0],
        ],
        hovered: false,
        clicked: false,
      };
    },
    async frame(page, s, st) {
      scroll(page, scrollAt(st.keys, s));
      if (s >= 3 && !st.hoverOn) {
        st.hoverOn = true;
        hover(st.cdp, 180, 300);
      } // over the first card: scale 1.05 over 1.1 s
      if (s >= 6 && !st.hovered) {
        st.hovered = true;
        hover(st.cdp, 355, 5);
      }
      if (s >= 7.8 && !st.clicked) {
        st.clicked = true;
        page.evaluate(() => [...document.querySelectorAll('[aria-pressed]')].find((b) => b.textContent.startsWith('Hot'))?.click()).catch(() => {});
      }
    },
  },
};

const server = await preview({ root, preview: { port: 0, strictPort: false, open: false }, logLevel: 'silent' });
const base = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch();
await fs.mkdir(out, { recursive: true });
const report = [];
try {
  for (const name of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(clips)) {
    const clip = clips[name];
    const ctx = await browser.newContext({
      viewport: clip.viewport,
      deviceScaleFactor: clip.dpr,
      hasTouch: Boolean(clip.touch),
      isMobile: Boolean(clip.touch),
    });
    // Warm-up page: every image (scrolled through so deferred ones mount) and
    // the fonts land in the cache, so the recorded page loads at once.
    const log = (m) => process.env.REEL_DEBUG && console.error(`[${name}] ${m}`);
    const warm = await ctx.newPage();
    log('warm-up');
    await warm.goto(base + clip.url, { waitUntil: 'networkidle' });
    const H = await warm.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) await warm.evaluate((v) => window.scrollTo(0, v), y);
    // A lazy image that is never near the viewport never fires load: cap the wait.
    await warm.evaluate(async () => {
      await document.fonts.ready;
      const all = Promise.all(
        [...document.images].map((i) =>
          i.complete
            ? null
            : new Promise((r) => {
                i.onload = i.onerror = r;
              }),
        ),
      );
      await Promise.race([all, new Promise((r) => setTimeout(r, 5000))]);
    });
    await warm.evaluate(() => window.scrollTo(0, 0));
    await warm.waitForTimeout(1500);
    if (clip.fresh !== false) await warm.close();
    // The recorded page runs under virtual time from navigation: frames are
    // skipped until fonts and the first view's images are ready, so the clip
    // opens on the first slide with no loading state.
    log('warm-up done');
    const page = clip.fresh === false ? warm : await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    const step = () =>
      new Promise((resolve) => {
        cdp.once('Emulation.virtualTimeBudgetExpired', resolve);
        cdp.send('Emulation.setVirtualTimePolicy', { policy: 'pauseIfNetworkFetchesPending', budget: 1000 / FPS });
      });
    if (clip.fresh !== false) await page.goto(base + clip.url, { waitUntil: 'commit' });
    for (let i = 0; i < (clip.fresh === false ? 0 : 300); i++) {
      await step();
      const ready = await page
        .evaluate(
          () =>
            document.readyState !== 'loading' &&
            document.fonts.status === 'loaded' &&
            [...document.querySelectorAll('main img')].slice(0, 2).every((im) => im.complete && im.naturalWidth > 0),
        )
        .catch(() => false);
      if (ready) break;
    }
    log('ready');
    const state = await clip.setup(page);
    log('setup done');
    state.cdp = cdp;
    const dir = path.join(out, `.frames-${name}`);
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
    const total = Math.round(clip.seconds * FPS);
    for (let f = 0; f < total; f++) {
      const s = f / FPS;
      const t = (label, pr) => Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej(new Error(`${name} frame ${f}: ${label} timed out`)), 20000))]);
      if (f < 3 || f % 60 === 0) log(`frame ${f}`);
      await t('frame actions', clip.frame(page, s, state));
      await t('time step', step());
      // Clip to the visible area at the device scale factor (a plain CDP capture is 1×).
      const { cssVisualViewport: v } = await t('layout metrics', cdp.send('Page.getLayoutMetrics'));
      const { data } = await t(
        'capture',
        cdp.send('Page.captureScreenshot', { format: 'png', clip: { x: v.pageX, y: v.pageY, width: v.clientWidth, height: v.clientHeight, scale: clip.dpr } }),
      );
      await fs.writeFile(path.join(dir, `${String(f).padStart(5, '0')}.png`), Buffer.from(data, 'base64'));
    }
    const mp4 = path.join(out, `${name}.mp4`);
    execFileSync('ffmpeg', [
      '-y',
      '-loglevel',
      'error',
      '-framerate',
      String(FPS),
      '-i',
      path.join(dir, '%05d.png'),
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '18',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      mp4,
    ]);
    for (const [i, s] of clip.covers.entries())
      await fs.copyFile(path.join(dir, `${String(Math.round(s * FPS)).padStart(5, '0')}.png`), path.join(out, `cover-${name}-${i + 1}.png`));
    const size = (await fs.stat(mp4)).size;
    report.push(
      `${name}: ${clip.viewport.width * clip.dpr}x${clip.viewport.height * clip.dpr}, ${clip.seconds} s, ${total} frames, ${(size / 1024 / 1024).toFixed(1)} MB`,
    );
    await ctx.close();
  }
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
console.log(report.join('\n'));
