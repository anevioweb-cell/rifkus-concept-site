import { useLocale } from '../../hooks/useLocale.js';
import { Accordion } from '../../components/Accordion.jsx';
import { SectionLabel } from '../../components/SectionLabel.jsx';
import { WithBrandWords } from '../../components/WithBrandWords.jsx';

/**
 * Why Rifkus, in the reference's Careers rows (title 24 px + 10 px meta,
 * dotted rules, plus icon). Four reasons, confirmed facts only: Instagram
 * bio (100% Algerian snack), the six flavors featured here, our heat
 * scale (labeled unofficial) and the founder's Zfiti announcement.
 * `band`: a full-bleed brand-yellow band with navy text.
 */
export function WhyRifkus({ band = false }) {
  const { t } = useLocale();
  const items = [1, 2, 3, 4].map((n) => ({
    id: `why-${n}`,
    question: <WithBrandWords text={t(`home.why.r${n}Title`)} />,
    meta: t(`home.why.r${n}Meta`),
    answer: <WithBrandWords text={t(`home.why.r${n}Body`)} />,
  }));
  return (
    <section
      aria-labelledby="home-why"
      data-surface={band ? 'light' : undefined}
      className={band ? 'bg-brand px-gutter pt-14 pb-20 text-brand-ink tablet:pt-20 tablet:pb-30' : 'px-gutter pb-20'}
    >
      <div className={band ? 'pt-0' : 'rule-dotted pt-14 tablet:pt-6'}>
        <SectionLabel id="home-why" tone={band ? 'ink' : 'gray'}>
          {t('home.why.label')}
        </SectionLabel>
      </div>
      <div className="mt-6">
        <Accordion items={items} fallback={false} tone={band ? 'light' : 'dark'} />
      </div>
    </section>
  );
}
