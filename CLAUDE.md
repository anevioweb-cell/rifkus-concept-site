# Project conventions

An unofficial, frontend-only concept website for the snack brand Rifkus.
- **Scope:** no backend, cart, checkout or payment. Forms are demos and send nothing.
- **Content:** English copy; Arabic only for brand words.
- **Reference docs:** `docs/ARCHITECTURE.md` (structure, build, data), `docs/DESIGN_SYSTEM.md` (tokens, components, accessibility), `docs/IMAGES.md` (image pipeline and hero scenes).

## Commands

```bash
npm run dev           # Vite dev server
npm run build         # client build + SSR prerender + robots.txt (scripts/prerender.mjs)
npm run preview       # serve dist/ like the host
npm run lint          # ESLint, 0 errors and 0 warnings
npm run format        # Prettier (write); format:check in CI
npm run i18n:check    # i18n keys used in code exist; only approved Arabic words in src/
npm run check         # lint → i18n → build → placeholder scan (needs Playwright outside the project)
npm run images        # rebuild WebP/AVIF images and src/data/images.generated.js
```

Stop `npm run preview` before `npm run check` or `npm run build` on a network or FUSE drive: an open file in `dist/` can stall the build.

## Stack

- **Libraries:** React 19 (JSX, no TypeScript), Vite, Tailwind CSS 4, React Router 8, `motion` (`motion/react`), Lenis.
- **Not used:** no UI kit, no CSS-in-JS, no runtime CDN.
- **Fonts:** self-hosted in `public/fonts/`. Bump the file version when a font changes, and keep the preload in `index.html` in sync.
- **Heavy tooling stays out of `package.json`:** Playwright, Lighthouse, rembg and ffmpeg are installed outside the project.

## Styling

- **Tokens only.** Colors, fonts, type sizes, radii, easing and spacing come from `src/styles/theme.css`. Add a token (and document it) instead of an arbitrary value; brackets are only for one-off geometry, never for colors.
- **No inline styles** (`style={…}` on DOM elements is a lint error). Motion values go through `m.*` components.
- **Logical properties** (`ms-`, `pe-`, `start-`, `text-end`).
- **Contrast:** use only the pairs in DESIGN_SYSTEM §1. Light surfaces set `data-surface="light"`.
- **Phones first:**
  - test at 320, 360, 390, 768, 1000 and 1440 px, plus a landscape phone (844×390);
  - no horizontal scroll;
  - controls at least `min-h-tap` (44 px); nothing under 12 px on phones; inputs 16 px;
  - tiers: `xs:`, `short:`, `landscape-phone:`, `tablet:`, `desktop:`;
  - safe areas through `--safe-bottom` and the gutter.
- **Arabic brand words** (the list is in `scripts/check-i18n.mjs`): always through `<Ar>`, `<FlavorName>` or the `{zfiti}` / `{mhadjeb}` tokens with `<WithBrandWords>`. Never letter-spaced, case-transformed or split, and never clipped by a mask. A new word means re-subsetting the Arabic font (DESIGN_SYSTEM §2).

## Copy and data

- **Text location:** all user-facing text lives in `src/i18n/en.js`. Use no string literals in JSX except brand names and symbols.
- **Facts:** flavors, stores and FAQs live in `src/data/*.js` with a `source.confidence`.
- **No invented facts:** never invent ingredients, nutrition, prices, addresses, phone numbers, store names, handles or statistics; unknown is `null` and is not shown.
- **Marketing copy** is sensory or playful, never a factual, health, origin or ingredient claim, and is flagged in comments.
- **Heat** is always labeled "estimated, unofficial"; a flavor with no indication has `heat: null`.
- **Counts:** never claim a total number of flavors for the brand ("six flavors featured here").
- **The founder** is named "Rifka" only.
- **Switches:** `site.indexable` stays `false` (noindex everywhere) and `site.showPrices` stays `false`.

## Accessibility

- **Structure:** semantic landmarks, one `h1` per page, and a visible focus ring (never `outline-none` without a replacement).
- **Keyboard:** menus and dialogs trap focus, close on Escape and return focus.
- **Images:** `alt` text from i18n (`alt=""` for decoration), always with `width` and `height`. Below-the-fold images use `<DeferredImg>`.
- **Forms:** labels, linked errors (`aria-describedby`, `aria-invalid`), and an announced success message.
- **Lint:** `eslint-plugin-jsx-a11y` stays clean.

## Motion

- **Setup:** use `m.*` inside the global `LazyMotion` (never `motion.*`), the presets in `src/config/motion.js`, and the CSS easing tokens.
- **Reduced motion:** `MotionConfig reducedMotion="user"` is global. Under reduced motion there is no autoplay, parallax, tilt, large translation or Lenis.
- **What animates:** only `transform` and `opacity` (and `filter` sparingly).
- **Scroll reveals:** use `<Reveal>` (enhance-only); never hide prerendered content with `initial`.
- **Nested scroll areas:** they get `data-lenis-prevent`; page scroll locks go through `useScrollLock`.

## Prerender and hydration

- **Prerendered pages:** `/`, `/flavors`, `/flavors/<slug>`, `/our-story`, `/distributors` and `/credits` are prerendered and hydrated. The first client render must match the HTML.
- **No browser-only reads in render:** no `Date`, random values or `window` / `matchMedia` (use effects or `useSyncExternalStore`).
- **Images:** every image is served AVIF first through `<picture>`. The page's LCP image is eager with `fetchpriority="high"`.

## Commits

- Run `npm run check` before committing.
- Use conventional messages (`feat:`, `fix:`, `docs:`, `chore:`, `perf:`).
- Never commit `node_modules`, `dist`, `.env*`, `public/images/_raw/` or `release-media/`.
