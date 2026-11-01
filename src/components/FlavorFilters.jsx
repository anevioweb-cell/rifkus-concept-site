import { useId } from 'react';
import { flavorCount, flavorFilters } from '../config/flavorFilters.js';
import { useLocale } from '../hooks/useLocale.js';

/**
 * The reference's filter list: a head with
 * the label + Reset and the total, then one row per filter (32 px, 20 on
 * phones). On hover or keyboard focus the label rolls up one line, turns
 * gray, and an end-aligned "N flavors" count fades and rises in (0.4 s,
 * ease-link). Single select: while a filter is active the other rows are
 * gray. Rows are toggle buttons (aria-pressed); rows are at least 44 px tall.
 * The block keeps the reference height (306 px) with our four rows.
 *
 * Phones: the rows become a horizontally scrollable chip row
 * (scroll-snap, edge fade, 44 px chips) that starts with "All"; the count
 * reveal is a hover detail and stays on larger screens.
 */
/** Phone chip look (tablet and up: the reference row, reset in the button's class list). */
const chip = (on) =>
  `inline-flex min-h-tap items-center rounded-pill border px-4 whitespace-nowrap transition-colors duration-(--duration-hover) ${on ? 'border-white bg-white text-ink' : 'border-white/40 text-white'}`;

export function FlavorFilters({ flavors, active, onChange }) {
  const { t } = useLocale();
  const labelId = useId();
  return (
    <section aria-labelledby={labelId} className="flex flex-col tablet:min-h-76.5">
      <div className="flex min-h-9.5 items-start justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <h2 id={labelId} className="text-ui text-smoke">
            {t('flavorsPage.filterLabel')}
          </h2>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="relative hidden text-body underline-offset-4 after:absolute after:-inset-x-2 after:-inset-y-3.5 hover:underline tablet:inline tablet:text-ui"
          >
            {t('flavorsPage.reset')}
          </button>
        </div>
        <p className="flex items-baseline gap-2">
          <span className="text-ui text-smoke">{t('flavorsPage.total')}</span>
          <span className="text-body">{flavors.length}</span>
        </p>
      </div>
      <ul className="chips-fade -mx-gutter mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-gutter pb-1 [scrollbar-width:none] tablet:mx-0 tablet:mt-6 tablet:flex-col tablet:gap-1 tablet:overflow-visible tablet:px-0 tablet:pb-0">
        <li className="shrink-0 snap-start tablet:hidden">
          <button type="button" aria-pressed={!active} onClick={() => onChange(null)} className={chip(!active)}>
            {t('flavorsPage.all')}
          </button>
        </li>
        {flavorFilters.map((filter) => {
          const count = flavors.filter(filter.test).length;
          const pressed = active === filter.id;
          const dim = active && !pressed;
          return (
            <li key={filter.id} className="shrink-0 snap-start">
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => onChange(pressed ? null : filter.id)}
                className={`${chip(pressed)} group/row tablet:flex tablet:min-h-11.5 tablet:w-full tablet:justify-between tablet:gap-4 tablet:rounded-none tablet:border-0 tablet:bg-transparent tablet:px-0 tablet:text-start tablet:text-white`}
              >
                <span
                  className={`relative overflow-hidden text-body transition-colors duration-(--duration-filter) ease-link tablet:text-filter-lg tablet:group-hover/row:text-smoke tablet:group-focus-visible/row:text-smoke ${dim ? 'tablet:text-smoke' : ''}`}
                >
                  <span
                    data-roll
                    className="relative block transition-transform duration-(--duration-filter) ease-link group-hover/row:-translate-y-full group-focus-visible/row:-translate-y-full"
                  >
                    <span className="block">{t(filter.labelKey)}</span>
                    <span aria-hidden="true" className="absolute start-0 top-full block">
                      {t(filter.labelKey)}
                    </span>
                  </span>
                </span>
                <span className="hidden overflow-hidden text-count font-medium tablet:block">
                  <span
                    data-count
                    className="block translate-y-full opacity-0 transition duration-(--duration-filter) ease-link group-hover/row:translate-y-0 group-hover/row:opacity-100 group-focus-visible/row:translate-y-0 group-focus-visible/row:opacity-100"
                  >
                    {flavorCount(t, count)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-ui font-semibold text-smoke tablet:uppercase">{t('flavorsPage.heatNote')}</p>
    </section>
  );
}
