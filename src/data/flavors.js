import { flavorImages, photoImages } from './images.generated.js';

const photo = (id) => (photoImages[id] ? { kind: 'photo', ...photoImages[id] } : null);
const cutout = (slug) => (flavorImages[slug] ? { kind: 'cutout', ...flavorImages[slug] } : null);

/**
 * Flavors shown on the site: six, by owner decision. The brand sells other
 * flavors that this concept does not show; never claim a total count for
 * the brand ("six flavors featured here").
 *
 * - `name`: plain Latin name (alt text, titles, meta). `nameAr`: set ONLY
 *   for brand words that must appear in Arabic (Zfiti → «زفيطي», Mhadjeb →
 *   «محاجب», docs/DESIGN_SYSTEM.md (Arabic words)); render it with <FlavorName>, which
 *   wraps it in <Ar>. `printedName`: the Latin name exactly as printed on
 *   the bag, when the bag prints one next to the Arabic (facts row).
 * - `taglineKey`: short English line (i18n), used by the hero and the cards.
 * - `copyGroup`: i18n group of the flavor page copy. Its `detailTagline`,
 *   `statement` and `description` are MARKETING COPY (sensory or playful,
 *   no factual, health, origin or ingredient claim); `sceneAlt` describes
 *   the mood image; `meta` is the page's meta description.
 * - `heat`: OUR indicative 0–5 estimate, always labeled "estimated, unofficial";
 *   `null` when neither the bag nor an official post indicates any heat
 *   (Mhadjeb): no heat tag or row, and Hot / Mild leave it out.
 * - `line`: only set when the bag is confirmed as that line ("Potato
 *   Chips" printed on Ketchup and Chicken); Pizza belongs to a line that is
 *   not displayed, and the Zfiti and Harissa lines are not confirmed: `null`.
 * - `isNew`: the "New" tag and filter (Mhadjeb only).
 * - `officialPackshot`: true only for a packshot published by the brand;
 *   owner-supplied or retailer images are false.
 * - `accent`: key of config/accents.js (fg/bg pair, contrast checked).
 * - `image`: { kind: 'photo' | 'cutout', src, srcSet, width, height,
 *   placeholder } from scripts/images, or null → typographic tile.
 *   'cutout' = a background-removed packshot (floats in 3D on Home);
 *   'photo' = an untouched real photo, shown framed. `photo` (optional):
 *   an extra real photo of the flavor (Zfiti: held up in a shop).
 *
 * @typedef {'potato' | 'mini'} LineId
 * @typedef {{
 *   slug: string,
 *   name: string,
 *   nameAr?: string,
 *   printedName?: string,
 *   taglineKey: string,
 *   copyGroup: string,
 *   line: LineId | null,
 *   heat: 0 | 1 | 2 | 3 | 4 | 5 | null,
 *   accent: keyof typeof import('../config/accents.js').accents,
 *   isNew: boolean,
 *   officialPackshot: boolean,
 *   image: { kind: 'photo' | 'cutout', src: string, srcSet: string, width: number, height: number, placeholder: string } | null,
 *   source: { url: string, confidence: 'confirmed' | 'reported' | 'unverified' },
 * }} Flavor
 */

/** @type {Flavor[]} The new flavor first, then hottest first; the hero's order (heroScenes.js). */
export const flavors = [
  {
    slug: 'mhadjeb',
    taglineKey: 'flavors.mhadjeb.tagline',
    copyGroup: 'flavors.mhadjeb',
    name: 'Mahajoube',
    nameAr: 'محاجب',
    printedName: 'MAHAJOUBE',
    line: null,
    heat: null,
    accent: 'zfiti',
    isNew: true,
    officialPackshot: false,
    image: cutout('mhadjeb'),
    source: { url: 'https://www.facebook.com/100069624192351/videos/1143668435274642/', confidence: 'reported' },
  },
  {
    slug: 'zfiti',
    taglineKey: 'flavors.zfiti.tagline',
    copyGroup: 'flavors.zfiti',
    name: 'Zfiti',
    nameAr: 'زفيطي',
    line: null,
    heat: 5,
    accent: 'zfiti',
    isNew: false,
    officialPackshot: false,
    image: cutout('zfiti'),
    photo: photo('zfiti-photo'),
    source: { url: 'https://www.tiktok.com/@rifkaofficiel', confidence: 'confirmed' },
  },
  {
    slug: 'harissa',
    taglineKey: 'flavors.harissa.tagline',
    copyGroup: 'flavors.harissa',
    name: 'Harissa',
    line: null,
    heat: 4,
    accent: 'ink',
    isNew: false,
    officialPackshot: false,
    image: cutout('harissa'),
    source: { url: 'https://munchyscandy.com/product/rifkus-chips-gout-harissa-55g/', confidence: 'confirmed' },
  },
  {
    slug: 'pizza',
    taglineKey: 'flavors.pizza.tagline',
    copyGroup: 'flavors.pizza',
    name: 'Pizza',
    line: null,
    heat: 1,
    accent: 'heat-deep',
    isNew: false,
    officialPackshot: false,
    image: cutout('pizza'),
    source: { url: 'https://ecs-chaudfroid.dz/?s=rifkus&post_type=product', confidence: 'reported' },
  },
  {
    slug: 'ketchup',
    taglineKey: 'flavors.ketchup.tagline',
    copyGroup: 'flavors.ketchup',
    name: 'Ketchup',
    line: 'potato',
    heat: 1,
    accent: 'heat',
    isNew: false,
    officialPackshot: false,
    image: cutout('ketchup'),
    source: { url: 'https://munchyscandy.com/product/rifkus-crispy-potato-chips-gout-ketchup-55g/', confidence: 'confirmed' },
  },
  {
    slug: 'chicken',
    taglineKey: 'flavors.chicken.tagline',
    copyGroup: 'flavors.chicken',
    name: 'Chicken',
    line: 'potato',
    heat: 1,
    accent: 'brand-ink',
    isNew: false,
    officialPackshot: false,
    image: cutout('chicken'),
    source: { url: 'https://midiminuit-epinal.com/products/chips-rifkus-poulet-55g', confidence: 'reported' },
  },
];

export const getFlavor = (slug) => flavors.find((flavor) => flavor.slug === slug) ?? null;
