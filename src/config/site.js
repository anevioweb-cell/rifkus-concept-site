/**
 * Global site configuration. Everything brand-specific that is not copy lives
 * here so a brand-neutral variant can be produced by editing one file.
 *
 * CONCEPT PROJECT: unofficial design. Contact values are clearly marked
 * placeholders. Never display the founder's surname (owner decision).
 */
export const site = {
  brandName: 'Rifkus',
  /** Founder is always named "Rifka" only. */
  founderName: 'Rifka',
  /**
   * Absolute site URL for canonical, Open Graph and JSON-LD URLs. Set it at
   * build time with VITE_SITE_URL (e.g. the live demo URL); without it, a
   * neutral placeholder is used. A trailing slash is removed.
   */
  siteUrl: (import.meta.env?.VITE_SITE_URL || 'https://rifkus-concept.example').replace(/\/$/, ''),

  /**
   * Unofficial concept: a discreet badge (bottom end, every page), a footer
   * line and a note appended to meta descriptions.
   */
  isConcept: true,
  /** Fixed so prerendered and client markup always match (hydration). */
  copyrightYear: 2026,
  showConceptNotice: true,
  /** Floating "Unofficial concept" badge (bottom end). Off: owner decision. */
  showConceptBadge: false,
  showPrices: false,
  /**
   * Search indexing. false (default, owner decision: this is
   * an unofficial concept using a brand's name, so every route gets
   * `<meta name="robots" content="noindex, nofollow">`, robots.txt disallows
   * everything (no sitemap line), no sitemap.xml is written and no JSON-LD is
   * emitted. Set true only for an owner-approved version.
   */
  indexable: false,
  /**
   * Show placeholder rows, links and fields ("[PLACEHOLDER: …]"). Off by
   * default: when false they are not rendered at all, and the footer contact area shows only the
   * confirmed Instagram and TikTok links. `npm run check` scans every built
   * route for visible placeholder text (scripts/scan-placeholders.mjs).
   */
  showPlaceholders: false,
  /** Forms validate and show a success state; nothing is ever sent. */
  formsAreDemo: true,

  /** The site is English only (Arabic for brand words). */
  htmlLang: 'en',
  ogLocale: 'en_US',

  /** Live clock in the navbar (reference: "8:47 PM, CITY"), rendered after mount. */
  clock: { timeZone: 'Africa/Algiers', cityKey: 'clock.city' },

  /** Official slogan (Instagram bio), shown as an Arabic accent in the footer. */
  sloganAr: 'مع ريفكوس تحلى القعدوس',

  /**
   * Social links (owner decision): Instagram @rifkus.chips is the main brand
   * link, TikTok @rifkaofficiel is the founder channel. Others are optional
   * and disabled by default. `labelKey` points to i18n (footer.*).
   */
  social: [
    {
      id: 'instagram',
      network: 'Instagram',
      handle: '@rifkus.chips',
      href: 'https://www.instagram.com/rifkus.chips/',
      labelKey: 'footer.brandAccount',
      enabled: true,
    },
    {
      id: 'tiktok',
      network: 'TikTok',
      handle: '@rifkaofficiel',
      href: 'https://www.tiktok.com/@rifkaofficiel',
      labelKey: 'footer.founderAccount',
      enabled: true,
    },
    {
      id: 'instagram-founder',
      network: 'Instagram',
      handle: '@rifka.bjm',
      href: 'https://www.instagram.com/rifka.bjm/',
      labelKey: 'footer.founderAccount',
      enabled: false,
    },
    {
      id: 'snapchat',
      network: 'Snapchat',
      handle: '@rifka.officiel',
      href: 'https://www.snapchat.com/@rifka.officiel',
      labelKey: 'footer.founderAccount',
      enabled: false,
    },
  ],

  /** Placeholders only. Do not replace without the brand's written approval. */
  contact: {
    email: 'contact@placeholder.example',
    phone: '+213 0X XX XX XX XX',
    wholesaleEmail: 'wholesale@placeholder.example',
    address: '[PLACEHOLDER: address]',
  },

  /** Default social share image (concept-labeled, from scripts/images). */
  ogImage: '/images/og/og-home.jpg',
};

export const enabledSocial = site.social.filter((s) => s.enabled);
