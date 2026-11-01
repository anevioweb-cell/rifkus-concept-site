import { useSearchParams } from 'react-router';
import { flavors } from '../data/flavors.js';
import { flavorCount, getFlavorFilter } from '../config/flavorFilters.js';
import { useLocale } from '../hooks/useLocale.js';
import { FlavorCards } from '../components/FlavorCards.jsx';
import { FlavorFilters } from '../components/FlavorFilters.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { Wordmark } from '../components/Wordmark.jsx';
import { WithBrandWords } from '../components/WithBrandWords.jsx';
import { DistributorCta } from '../sections/home/DistributorCta.jsx';

/**
 * /flavors, from the reference's Projects page: header (wordmark + lead + body at the
 * start on desktop only; the filter list at the end, full width below
 * 1200 px), dotted rule + gray label (the page's h1), the card grid, the
 * distributor CTA band. The filter is single select and lives in the URL
 * (`?filter=hot`), like the reference.
 */
export default function FlavorsPage() {
  const { t } = useLocale();
  const [params, setParams] = useSearchParams();
  const filter = getFlavorFilter(params.get('filter'));
  const shown = filter ? flavors.filter(filter.test) : flavors;
  const setFilter = (id) => setParams(id ? { filter: id } : {}, { replace: true, preventScrollReset: true });

  return (
    <>
      <section
        aria-label={t('flavorsPage.introLabel')}
        className="px-gutter pt-[calc(var(--nav-height)+1.75rem)] pb-8 tablet:pt-30 tablet:pb-10 desktop:pt-50 desktop:pb-20"
      >
        {/* Phones and tablets: the lead is the first thing read
            (the reference shows it on desktop only). */}
        <p className="mb-6 max-w-measure text-lead desktop:hidden">
          <WithBrandWords text={t('flavorsPage.lead')} />
        </p>
        <div className="desktop:grid desktop:grid-cols-2 desktop:gap-15">
          <div className="hidden flex-col desktop:flex">
            <Wordmark className="text-page-lg" />
            <p className="mt-7 max-w-150 text-lead-lg">
              <WithBrandWords text={t('flavorsPage.lead')} />
            </p>
            <p className="mt-8 max-w-150 text-body text-smoke">{t('flavorsPage.body')}</p>
          </div>
          <FlavorFilters flavors={flavors} active={filter?.id ?? null} onChange={setFilter} />
        </div>
      </section>

      <section aria-labelledby="flavors-title" className="px-gutter pb-20">
        <div className="rule-dotted pt-8 tablet:pt-6">
          <SectionLabel as="h1" id="flavors-title">
            {filter ? t(filter.labelKey) : t('flavorsPage.label')}
          </SectionLabel>
        </div>
        <p role="status" className="sr-only">
          {t('flavorsPage.shown', { count: flavorCount(t, shown.length) })}
        </p>
        <FlavorCards key={filter?.id ?? 'all'} flavors={shown} headingLevel={2} priorityFirst className="mt-6" />
      </section>

      <DistributorCta id="flavors-cta" />
    </>
  );
}
