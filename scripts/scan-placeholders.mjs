/**
 * Placeholder scan (owner decision: serves dist/ with
 * `vite preview`, loads every route in headless Chromium at phone and
 * desktop width, scrolls it so deferred content mounts, opens the phone
 * menu, and fails if any VISIBLE text (innerText, image alt, aria-label)
 * contains "PLACEHOLDER", "TODO" or "lorem". Runs in `npm run check`.
 *
 * Playwright is not a project dependency (CLAUDE.md): it is loaded from the
 * sibling tooling folder ../tools (override with PLAYWRIGHT_DIR).
 */
import path from 'node:path';
import { createRequire } from 'node:module';
import { preview } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
const toolsDir = process.env.PLAYWRIGHT_DIR ?? path.resolve(root, '../tools');
let chromium;
try {
  ({ chromium } = createRequire(path.join(toolsDir, 'package.json'))('playwright'));
} catch {
  console.error(`scan-placeholders: Playwright not found in ${toolsDir} (npm install playwright there, or set PLAYWRIGHT_DIR).`);
  process.exit(1);
}

const { flavors } = await import('../src/data/flavors.js').catch(() => ({ flavors: null }));
const slugs = flavors?.map((f) => f.slug) ?? ['zfiti', 'harissa', 'pizza', 'ketchup', 'chicken'];
const { flavorFilters } = await import('../src/config/flavorFilters.js');
const routes = [
  '/',
  '/flavors',
  ...flavorFilters.map((f) => `/flavors?filter=${f.id}`),
  ...slugs.map((s) => `/flavors/${s}`),
  '/flavors/unknown-flavor',
  '/story',
  '/distributors',
  '/privacy',
  '/terms',
  '/legal-notice',
  '/no-such-page',
];
const BAD = /\bPLACEHOLDER\b|\bTODO\b|\blorem\b/i;

const server = await preview({ root, preview: { port: 0, strictPort: false, open: false }, logLevel: 'silent' });
const base = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch();
const failures = [];
try {
  for (const [w, h] of [
    [390, 844],
    [1440, 900],
  ]) {
    const page = await (await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })).newPage();
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
      });
      const texts = await page.evaluate(() => [
        document.body.innerText,
        ...[...document.querySelectorAll('img[alt], [aria-label]')]
          .filter((el) => el.getClientRects().length)
          .map((el) => el.getAttribute('alt') ?? el.getAttribute('aria-label')),
        document.title,
      ]);
      if (w < 810) {
        const menu = page.getByRole('button', { name: /open menu/i });
        if (await menu.count()) {
          await menu.click();
          texts.push(await page.evaluate(() => document.body.innerText));
          await page.keyboard.press('Escape');
        }
      }
      for (const text of texts) {
        for (const line of (text ?? '').split('\n')) if (BAD.test(line)) failures.push(`${w}px ${route}: "${line.trim().slice(0, 120)}"`);
      }
    }
  }
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}

if (failures.length) {
  console.error(`scan-placeholders: ${failures.length} visible placeholder text(s):\n  ${[...new Set(failures)].join('\n  ')}`);
  process.exit(1);
}
console.log(`scan-placeholders OK: ${routes.length} routes × 2 widths, no visible PLACEHOLDER / TODO / lorem.`);
