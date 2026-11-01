import { faqs } from '../../data/faqs.js';
import { site } from '../../config/site.js';
import { useLocale } from '../../hooks/useLocale.js';
import { Accordion } from '../../components/Accordion.jsx';
import { SectionLabel } from '../../components/SectionLabel.jsx';
import { WithBrandWords } from '../../components/WithBrandWords.jsx';

/** Questions: the reference's accordion rows, safe answers only (data/faqs.js), plus the contact fallback row. */
export function HomeFaq({ id = 'home-faq', fallbackTo }) {
  const { t } = useLocale();
  // Answers that are placeholders (`source: 'placeholder…'`) render only with site.showPlaceholders.
  const items = faqs
    .filter((f) => site.showPlaceholders || !f.source.startsWith('placeholder'))
    .map((f) => ({ id: f.id, question: t(f.questionKey), answer: <WithBrandWords text={t(f.answerKey)} /> }));
  return (
    <section aria-labelledby={id} className="px-gutter pb-20">
      <div className="rule-dotted pt-14 tablet:pt-6">
        <SectionLabel id={id}>{t('home.faq.label')}</SectionLabel>
      </div>
      <div className="mt-6">
        <Accordion items={items} fallbackTo={fallbackTo} />
      </div>
    </section>
  );
}
