/**
 * Filters on /flavors (single select). `id` is the `?filter=` value; `labelKey`
 * is i18n. Hot and Mild use OUR heat estimate (unofficial, labeled on the
 * page) and leave out flavors without an estimate (heat null); Potato Chips = bags printed "Potato Chips"; New = flavors marked new.
 */
export const flavorFilters = [
  { id: 'hot', labelKey: 'flavorsPage.filters.hot', test: (f) => f.heat !== null && f.heat >= 3 },
  { id: 'mild', labelKey: 'flavorsPage.filters.mild', test: (f) => f.heat !== null && f.heat <= 1 },
  { id: 'potato', labelKey: 'flavorsPage.filters.potato', test: (f) => f.line === 'potato' },
  { id: 'new', labelKey: 'flavorsPage.filters.new', test: (f) => f.isNew },
];

export const getFlavorFilter = (id) => flavorFilters.find((f) => f.id === id) ?? null;

/** "N flavors", with the singular for one. */
export const flavorCount = (t, count) => t(count === 1 ? 'flavorsPage.countOne' : 'flavorsPage.count', { count });
