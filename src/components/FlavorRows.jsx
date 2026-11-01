import { Link } from 'react-router';
import { flavors } from '../data/flavors.js';
import { useLocale } from '../hooks/useLocale.js';
import { FlavorName } from './FlavorName.jsx';
import { ArrowIcon } from './icons/index.jsx';
import { Reveal } from './Reveal.jsx';

/**
 * The flavors as link rows, in the reference's Careers row style
 * (24 px title, 10 px uppercase meta, dotted rules, an icon at the end).
 * A compact teaser for pages other than /flavors.
 */
export function FlavorRows() {
  const { t } = useLocale();
  return (
    <ul>
      {flavors.map((flavor, i) => (
        <Reveal as="li" kind="line" step={Math.min(i, 4)} key={flavor.slug} className="rule-dotted">
          <Link to={`/flavors/${flavor.slug}`} className="group flex min-h-14 items-center justify-between gap-4 px-4 pt-6.5 pb-7">
            <span className="flex flex-col gap-1.5">
              <span className="text-lead tablet:text-lead-lg">
                <FlavorName flavor={flavor} /> <span className="text-smoke">· {t(flavor.taglineKey)}</span>
              </span>
              {(flavor.heat !== null || flavor.isNew) && (
                <span className="text-micro font-medium text-smoke uppercase">
                  {flavor.heat !== null ? t('home.flavors.heatTag', { value: flavor.heat }) : t('home.flavors.newTag')}
                </span>
              )}
            </span>
            <ArrowIcon className="size-5 shrink-0 transition-transform duration-(--duration-hover) group-hover:translate-x-1" />
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
