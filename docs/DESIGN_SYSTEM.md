# Design system

**Source of truth:** `src/styles/theme.css` (Tailwind CSS 4 `@theme`), `src/styles/base.css`, `src/styles/fonts.css`, `src/styles/hero.css` and `src/config/motion.js`.

Tailwind's default colors, font stacks and shadows are reset, so only the tokens below exist (`bg-red-500` does not). A one-off bracket value (an arbitrary width, for example) is used only for geometry, never for colors.

The site is dark: `ink` is the page color and white is the text. The brand colors come from the packaging.

## 1. Color

| Token | Value | Use (contrast on `ink` unless stated) |
|---|---|---|
| `ink` | `#160709` | Page background, dark sections |
| `ink-soft` | `#241315` | Raised dark surfaces (menu, tiles) |
| `white` | `#FFFFFF` | Text (19.65:1) |
| `mist` | `#CCCCCC` | Taglines (12.24:1) |
| `ash` | `#B3B3B3` | Secondary text, field labels (9.37:1) |
| `smoke` | `#8C8C8C` | Labels, dotted rules (5.84:1) |
| `brand` | `#F7D417` | Rifkus yellow: wordmark (13.46:1), yellow bands, focus ring, selection. Never text on light surfaces |
| `brand-soft` | `#FFE45C` | Hover tint of `brand` |
| `brand-ink` | `#0B2C5A` | Navy: text on yellow (9.45:1) |
| `heat` / `heat-deep` | `#D7141A` / `#B01015` | Red accents with white text (5.24:1 / 7.16:1) |
| `zfiti` | `#FF5A1F` | Flame orange: ink text only (6.30:1), scene glow |
| `bg`, `surface`, `muted` | cream / light / `#5B4D45` | Light surfaces only (`data-surface="light"`) |
| `error`, `error-on-dark` | `#B01015`, `#FF8A80` | Field errors (on light, on ink 8.61:1) |
| `focus` | `#0F4C97` | Focus ring on light surfaces |

**Rules**
- Only these text and background pairs are used.
- The focus ring is yellow on dark surfaces, and navy inside `data-surface="light"`.
- Text over pictures sits on a scrim, or on a dark pocket gradient behind the hero bag.

## 2. Typography

| Token | Family | Use |
|---|---|---|
| `font-sans` | Plus Jakarta Sans (variable), plus a metric-matched fallback (no layout shift on swap) | All Latin text |
| `font-arabic` | Baloo Bhaijaan 2, subset to the letters of the brand words | Arabic brand words only, through `<Ar>` |
| `font-wordmark` | Baloo Bhaijaan 2 (Latin), 800 | The "Rifkus" text wordmark |

Fonts are self-hosted in `public/fonts/` (SIL OFL 1.1, license texts included). When a file changes, its name gets a new version (`.v3.woff2`), and the preload in `index.html` is updated too.

**Scale.** Each role has a step for phones, tablets (≥ 810 px) and desktops (≥ 1200 px). The phone steps of the display roles are fluid from 320 px.

| Token(s) | Phone / tablet / desktop (px) | Use |
|---|---|---|
| `text-slide`, `-md`, `-lg` | 32→40 / 80 / 130 | Hero slide title |
| `text-page`, `-md`, `-lg` | 44→56 / 88 / 132 | Page titles, flavor page title, footer wordmark |
| `text-statement`, `-md`, `-lg` | 35 / 46 / 64 | Statements |
| `text-section`, `-md`, `-lg` | 28 / 32 / 48 | Gray section labels, "Previous / Next" |
| `text-filter`, `-lg` | 20 / 32 / 32 | Filter rows (tablet and up) |
| `text-title`, `-lg` | 24→28 / – / 36 | Card titles, menu links |
| `text-sub`, `-lg` | 20→24 / – / 32 | Hero h1 and subline |
| `text-lead`, `-lg` | 20 / – / 24 | Leads, accordion titles |
| `text-switch`, `-md`, `-lg` | 18 / 26 / 20 | Hero names row and counter |
| `text-body` | 16 | Body text and inputs |
| `text-small` | 14 | Buttons, hints |
| `text-ui` | 12 | Nav links, short uppercase labels |
| `text-micro` | 12 / 11 / 10 | Field and column labels |

- Nothing is smaller than 12 px on phones.
- Running text is at most `max-w-measure` (40rem, about 70 characters).
- Headings use `text-wrap: balance`. Paragraphs use `text-wrap: pretty` and `overflow-wrap: break-word`.

### Arabic brand words

The site is English. Arabic appears only for brand words: the flavor names «زفيطي» and «محاجب», and the slogan «مع ريفكوس تحلى القعدوس».
- **Enforcement:** `npm run i18n:check` fails on any other Arabic in `src/`. The list is in `scripts/check-i18n.mjs`.
- **Rendering:** `<Ar>` renders `<bdi lang="ar" dir="rtl" class="ar">`: Baloo 700, no letter-spacing, no case transform, and `line-height: 0`, so the tall glyphs never open the Latin line box. The size is `max(var(--ar-scale, 0.9) × 1em, 12px)`.
- **In copy strings:** write the tokens `{zfiti}` and `{mhadjeb}`. `<WithBrandWords>` renders them in Arabic, and `plainBrandWords()` gives "Latin (Arabic)" for meta tags.
- **Masks:** a mask that holds Arabic keeps extra room for the dots and tails (`has-[bdi]` padding).
- **The Latin name under Mhadjeb:** "MAHAJOUBE", as printed on the bag, shows as a small line under «محاجب» (`<PrintedName>`).
- **Adding a word:** a new rendered Arabic word means re-subsetting the font, from the full Baloo Bhaijaan 2 Arabic woff2:

```bash
pyftsubset baloo-bhaijaan-2-arabic.woff2 --text="<all approved Arabic strings>" --unicodes="U+0020,U+200C-200D" --layout-features='*' --flavor=woff2 --output-file=public/fonts/baloo-bhaijaan-2-arabic.vN.woff2
```

## 3. Layout and spacing

| Token | Value | Use |
|---|---|---|
| `px-gutter` | 16 px under 390 px, 20 px up to 809 px, 24 px from 810 px; never under the landscape safe-area insets | Side padding (full-bleed layout, no max-width container) |
| `h-nav`, `top-nav` | 66 px phone, 60 px tablet and up | Fixed bar |
| `min-h-tap`, `size-tap` | 44 px | Minimum touch target |
| `py-section` | 64 px phone, 120 px tablet and up | Section rhythm |
| `rounded-ui` / `rounded-badge` / `rounded-media` / `rounded-pill` | 4 / 10 / 2 px / full | Buttons and chips / badges / images / pills |
| `rule-dotted`, `rule-dotted-ink` | 1 px dotted | Separators (on ink, on yellow) |

**Tiers.** Custom variants are defined in `src/index.css`.

| Variant | Query | Use |
|---|---|---|
| `xs:` | width < 380 px | Small phones: tighter buttons; the clock shows the time only |
| `short:` | portrait, height ≤ 700 px | The hero stack moves up |
| `landscape-phone:` | landscape, height ≤ 500 px | The hero and flavor cover put the bag on the end side, sized by height |
| `tablet:` / `desktop:` | ≥ 810 / ≥ 1200 px | Tablet and desktop layouts |

**Platform**
- **Safe areas:** `viewport-fit=cover`; the bottom controls, the menu and the footer add `env(safe-area-inset-bottom)` (`--safe-bottom`).
- **Scrolling:** `scroll-padding-top` is the bar height and `scroll-padding-bottom` is 5rem.
- **Touch:** no tap highlight (the focus ring stays); `overscroll-behavior: contain` on nested scroll rows.
- **Logical properties** (`ms-`, `pe-`, `start-`, `text-end`) are the default.
- **Overflow:** no horizontal scroll at any width (`body { overflow-x: clip }`).

## 4. Motion

Presets live in `src/config/motion.js`; CSS easings and durations live in `theme.css` and `base.css`. Only `transform` and `opacity` animate (with `filter` only on statement reveals).

| Token | Value | Where |
|---|---|---|
| `ease-out-expo` | cubic-bezier(.16, 1, .3, 1) | Slide wipe, mask rise |
| `ease-snap` | cubic-bezier(.44, 0, .56, 1) | Hero zoom-out, inputs |
| `ease-link` | cubic-bezier(.19, 1, .22, 1) | Link color, filter rows |
| `--duration-hover` / `--duration-link` | 300 / 500 ms | Controls / links |
| `--duration-card` / `--duration-card-out` | 1100 / 130 ms | Card image scale 1 → 1.05 and back |
| `animate-hero-*` | zoom 1.2 → 1 (800 ms), mask rise (1000 ms), fades (700 ms) | The Home load sequence, in CSS, so it plays before JavaScript |
| `animate-bag-float` | 5 s loop | Floating bag and its contact shadow |
| Slider | autoplay 3.0 s, wipe 1.3 s out-expo | `HeroSlider` |
| Pointer tilt | rotateY −12° ± 9°, rotateX 4° ∓ 6°, spring | Bag 3D, mouse only |
| Reveals | card: y 70, 1.2 s; image or line: y 60, 1.0 s; steps of 0.2 s | `<Reveal kind step>`; enhance-only (prerendered HTML is never hidden) |
| Smooth scrolling | Lenis, `lerp 0.1`, mouse wheel only, loaded on idle | `components/SmoothScroll.jsx` |

**Reduced motion**
- `MotionConfig reducedMotion="user"` applies everywhere.
- CSS animation durations are zeroed.
- The hero has no autoplay, no tilt and no parallax; a slide change is a 200 ms fade.
- Lenis never loads, and the ticker stands still.

## 5. Components

| Component | Notes |
|---|---|
| `Navbar` | Fixed bar: wordmark, centered links (tablet and up), Algiers `Clock`. Phone menu: full-screen card with 56 px rows and a bottom Close button; traps focus, closes on Escape, returns focus, locks scroll |
| `Footer` | Wordmark, the Arabic slogan with an English gloss for screen readers, the demo newsletter, link columns, confirmed social links |
| `HeroSlider` / `HeroScene` | Six slides. Each has a scene background, a dark pocket and a glow in the flavor color, ingredient pieces by depth, the floating 3D bag, motes and grain. Controls: arrows (tablet and up), a names row, pause/play, touch swipe, and two actions on phones. Accessibility: carousel semantics; autoplay holds on hover and focus |
| `FlavorCard`, `FlavorCards` | Card grid: 2 columns from tablet up. An odd count makes the first card span both columns |
| `FlavorFilters` | Single-select filters stored in the URL (`?filter=`). Phones: a horizontal chip row starting with "All" |
| `FlavorMedia` | A flavor's scene with its bag, or a typographic tile when no image exists |
| `FlavorName`, `PrintedName`, `Ar`, `WithBrandWords` | Brand words (see §2) |
| `Accordion` | Disclosure rows (`aria-expanded`, `aria-controls`) |
| `Button` | Outline, solid and brand variants; renders `<Link>`, `<a>` or `<button>` |
| `Reveal`, `DeferredImg` | Enhance-only reveals; below-the-fold images mounted after hydration, with a `<noscript>` fallback |
| `Seo` | Title, description, canonical, Open Graph; robots and JSON-LD follow `site.indexable` |
| Form fields (`TextField`, `SelectField`, `TextareaField`, `CheckboxField`, `Field`) | Visible labels, hints and errors linked with `aria-describedby` and `aria-invalid`, 16 px inputs, `autocomplete` / `inputmode` / `enterkeyhint` |
| `DemoNotice`, `ErrorSummary`, `DemoSuccess` | Demo form states: nothing is sent; the success panel is announced and takes focus |
| `Marquee` | Decorative yellow ticker (hidden from screen readers), with a pause button |
| `SmoothScroll` | Lenis provider (wheel only, never under reduced motion) |

## 6. Hero scenes

Every slide places the bag exactly in front of a focal point of its background:
- **Shared geometry:** the bag stage and the scene share CSS variables (`--tile-w`, `--stage-x`, `--stage-y`, `--bag-cx`, `--bag-cy`) in `styles/hero.css`. The first paint is therefore aligned without JavaScript.
- **Runtime correction:** a ResizeObserver refines the bag center from the real stage box.
- **Data:** per-scene values (focal point, tint, pocket, glow, pieces, optional phone tuning and title shade) live in `src/data/heroScenes.js`. The workflow is in `docs/IMAGES.md`.

## 7. Accessibility

- **Structure:** semantic landmarks, one `h1` per page, and a skip link.
- **Keyboard:** the yellow `:focus-visible` ring is visible everywhere; menus trap focus and close on Escape.
- **Size:** touch targets are at least 44 px; text and input sizes are listed above.
- **Images:** meaningful `alt` text from i18n, `alt=""` for decoration, and `width`/`height` always set.
- **Forms:** real labels, linked errors, focus on the first invalid field, and a `role="status"` success message.
- **Checks:** `eslint-plugin-jsx-a11y` and axe (0 violations on every route at 320, 390, 768 and 1440 px, including the open menu, an expanded row and the form errors).
