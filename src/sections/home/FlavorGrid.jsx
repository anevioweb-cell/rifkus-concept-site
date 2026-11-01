import { flavors } from '../../data/flavors.js';
import { useLocale } from '../../hooks/useLocale.js';
import { FlavorCards } from '../../components/FlavorCards.jsx';
import { SectionLabel } from '../../components/SectionLabel.jsx';

/**
 * The flavors, in the reference's Projects grid: dotted rule, gray label,
 * then the six flavors featured here, each with its real bag on its hero
 * scene (components/FlavorCards.jsx).
 */
export function FlavorGrid() {
  const { t } = useLocale();
  return (
    <section aria-labelledby="home-flavors" className="px-gutter pb-20">
      <div className="rule-dotted pt-14 tablet:pt-6">
        <SectionLabel id="home-flavors">{t('home.flavors.label')}</SectionLabel>
      </div>
      <FlavorCards flavors={flavors} className="mt-6" />
    </section>
  );
}
