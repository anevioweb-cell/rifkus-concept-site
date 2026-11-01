# Scripts

| Script | Run with | What it does |
|---|---|---|
| `prerender.mjs` | `npm run build` (last step) | Renders `/`, `/flavors`, every flavor page, `/our-story`, `/distributors` and `/credits` to static HTML (from the SSR build of `src/entry-prerender.jsx`), moves the SEO tags into `<head>`, writes `dist/shell.html` for the other routes, and writes `robots.txt` (plus `sitemap.xml` only when `site.indexable` is true) |
| `run-check.mjs` | `npm run check` | lint → i18n check → build → placeholder scan, each with a timeout; fails on the first error |
| `check-i18n.mjs` | `npm run i18n:check` | Every `t('…')` key used in `src/` exists in `src/i18n/en.js`, and only the approved Arabic brand words appear in `src/` |
| `scan-placeholders.mjs` | `npm run scan` | Loads every built route at two widths in headless Chromium and fails on visible "PLACEHOLDER", "TODO" or "lorem". Needs Playwright installed outside the project (`PLAYWRIGHT_DIR`, default `../tools`) |
| `images/build-images.mjs` | `npm run images` | The image pipeline (`docs/IMAGES.md`) |
| `images/focal.mjs` | `node scripts/images/focal.mjs [slug]` | Suggests focal points for the hero backgrounds |
| `images/remove-bg.py` | `python scripts/images/remove-bg.py <raw dir> [model]` | Local background removal with rembg (installed outside the project) |
| `reels/record.mjs` | `node scripts/reels/record.mjs [clip]` | Development tool, **not run in CI**. Records promotional screen clips of the built site with Playwright and ffmpeg (both installed outside the project) into `release-media/`, which is git-ignored |

Playwright, rembg and ffmpeg are deliberately **not** project dependencies.
