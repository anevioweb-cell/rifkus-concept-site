# Architecture

A frontend-only React single-page app, prerendered at build time. There is no backend, cart or payment, and every form is a demo that sends nothing. The site is English (left to right); Arabic appears only for brand words.

## Stack

| Layer | Choice |
|---|---|
| UI | React 19 (JSX, no TypeScript) |
| Build | Vite 8, `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`); design tokens in CSS `@theme` (`src/styles/theme.css`) |
| Routing | React Router 8 (data router, lazy routes, `ScrollRestoration`) |
| Motion | `motion` (`LazyMotion` + `m.*` components, strict mode) |
| Smooth scrolling | Lenis, mouse wheel only, loaded on idle |
| Linting | ESLint 9 (react, hooks, refresh, jsx-a11y), Prettier |
| Images | sharp (development only), rembg outside the project |

## Folder structure

```
├─ index.html              fonts preload, viewport, root element
├─ vite.config.js          React + Tailwind plugins; `vite preview` mirrors the hosting rewrites
├─ vercel.json             clean URLs; unknown paths fall back to /shell.html
├─ public/
│  ├─ fonts/               self-hosted woff2 + licenses/
│  └─ images/              processed images only (flavors/, photos/, scenes/, og/)
├─ scripts/                prerender, checks, image pipeline, reels (see scripts/README.md)
├─ docs/                   ARCHITECTURE, DESIGN_SYSTEM, IMAGES
└─ src/
   ├─ main.jsx             entry: hydrates prerendered pages, otherwise renders
   ├─ router.jsx           browser router; resolves the lazy route before hydrating
   ├─ routeObjects.jsx     route objects shared by the browser router and the prerender
   ├─ entry-prerender.jsx  SSR entry (build time only): render(), prerenderPaths
   ├─ index.css            Tailwind import, styles/*, custom variants (xs, short, landscape-phone)
   ├─ config/              site.js (brand config and switches), routes.js, navigation.js, motion.js,
   │                       accents.js, flavorFilters.js, heroSlides.js, heroGeometry.js
   ├─ data/                flavors.js, heroScenes.js, faqs.js, stores.js (+ test data), wilayas.js,
   │                       images.generated.js (from the image pipeline)
   ├─ i18n/                en.js (every user-facing string), index.js (translate)
   ├─ hooks/               useLocale, useDemoForm, useFocusTrap, useHydrated, useMediaQuery, useScrollLock
   ├─ lib/                 brandWords.js, imageSources.js, lenisInstance.js (non-React helpers)
   ├─ layouts/             RootLayout.jsx (skip link, Navbar, main, Footer, Seo, LazyMotion, MotionConfig)
   ├─ components/          shared UI, one component per file; form/ (fields and demo states), icons/
   ├─ sections/home/       HeroSlider, HeroScene (+ heroSceneCss.js), HomeIntro, FlavorGrid, WhyRifkus,
   │                       LinesTeaser, HomeFaq, DistributorCta
   ├─ sections/flavor/     FlavorCover
   ├─ pages/               one file per route
   └─ styles/              theme.css (tokens), base.css, fonts.css, hero.css, reveal.css, home.css
```

**Naming:** components are PascalCase `.jsx`, hooks are `useX.js`, data and helpers are camelCase `.js`.

## Routes

| Path | Page | Rendering |
|---|---|---|
| `/` | HomePage | Eager; prerendered and hydrated |
| `/flavors` | FlavorsPage (`?filter=hot|mild|potato|new`) | Lazy; prerendered |
| `/flavors/:slug` | FlavorDetailPage (six flavors; an unknown slug shows the 404) | Lazy; prerendered for every flavor |
| `/our-story` | StoryPage | Lazy; prerendered |
| `/distributors` | DistributorsPage (rows, demo request form, store finder, FAQ) | Lazy; prerendered |
| `/credits` | CreditsPage | Lazy; prerendered |
| `/privacy`, `/terms`, `/legal-notice` | Simple pages | Lazy; client-rendered from the shell |
| `*` | NotFoundPage (`noindex`) | Lazy |

## Build and prerender

`npm run build` runs three steps:
1. `vite build` (the client bundle);
2. `vite build --ssr src/entry-prerender.jsx --outDir dist-ssr`;
3. `node scripts/prerender.mjs`.

The prerender step:
- **Renders** every path in `prerenderPaths` with React Router's static handler and writes `dist/<path>/index.html`.
- **Moves** the SEO tags rendered by `<Seo>` into `<head>`.
- **Strips** Vite's `modulepreload` tags, so the app JavaScript loads after the first image paints.
- **Writes** `dist/shell.html` (an empty app shell for the other routes) and `robots.txt`.
- **Cleans up** `dist-ssr/`.

**Hydration**
- `main.jsx` hydrates when `#root` has content. The first client render must match the HTML exactly.
- Client-only values (the Algiers clock, media queries, "mounted") go through `useSyncExternalStore` or effects (`useHydrated`, `useMediaQuery`).
- The Home load sequence is pure CSS, so it plays before JavaScript.
- Scroll reveals only enhance: elements already in the HTML are never hidden by `initial` styles.

**Hosting:** `vercel.json` serves real files first (the prerendered pages and assets) and rewrites every other path to `/shell.html`. `vite preview` mirrors this with a small plugin in `vite.config.js`.

## Configuration

`src/config/site.js` holds the brand configuration and the switches:

| Key | Default | Effect |
|---|---|---|
| `siteUrl` | `VITE_SITE_URL` at build time, else a neutral placeholder | Canonical and Open Graph URLs |
| `indexable` | `false` | `false`: `noindex, nofollow` on every page, `robots.txt` disallows everything, no sitemap and no JSON-LD. `true`: robots allow, `sitemap.xml` and Product JSON-LD are written. Only for a version approved by the brand |
| `showPlaceholders` | `false` | Shows or hides placeholder rows and fields for unknown facts |
| `showPrices` | `false` | No prices anywhere |
| `formsAreDemo` | `true` | Forms validate and show a success state; nothing is sent |

## Data

- **`flavors.js`:** six flavors. Fields:
  - `slug`, `name` (Latin), `nameAr` (only for Arabic brand names), `printedName`;
  - `line` (`'potato'` only when the bag says so);
  - `heat` (our 0–5 estimate, labeled "estimated, unofficial", or `null` when nothing indicates any heat);
  - `isNew`, `officialPackshot`, `image`, and `source: { url, confidence }`.
- **`heroScenes.js`:** the hero scenes and their order (`docs/IMAGES.md`).
- **`stores.js`:** empty by design (no invented shops). `stores.test-data.js` is fictional, development only (`?stores=test` in `npm run dev`), and never reaches the build.
- **`wilayas.js`:** the 69 wilayas (codes, Latin and Arabic names; the Arabic names are reference data and are not rendered).
- **`faqs.js`:** FAQ entries (copy in i18n) with the source of each answer.

All user-facing text lives in `src/i18n/en.js`. Marketing lines are flagged as such in comments. Unknown facts are `null` and are not shown.

## Accessibility and motion

See `docs/DESIGN_SYSTEM.md` §4 and §7.
