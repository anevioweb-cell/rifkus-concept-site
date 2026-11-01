import { Link } from 'react-router';
import { useLocale } from '../hooks/useLocale.js';
import { FlavorMedia } from './FlavorMedia.jsx';
import { FlavorName } from './FlavorName.jsx';
import { PrintedName } from './PrintedName.jsx';
import { Reveal } from './Reveal.jsx';

/**
 * Flavor card in the reference's project-card layout: image 688×787 (472×540 at 1000, 358×410 on phones, radius
 * 2), title 36 px (28), tagline 16 px, tag row 12 px uppercase with "|"
 * separators. The image is the flavor's portrait hero scene with the real
 * bag on a dark pocket. Tags: heat (when the flavor has an estimate) and New. Hover: scale 1.05 over 1.1 s, and a quick 0.13 s
 * return when the pointer leaves (both measured). Reveals like the reference
 * cards (y 70, 1.2 s, index × 0.2 s). The whole card is one link.
 * `wide`: spans both columns from tablet up, with the wide desktop scene
 * (the orphan treatment of an odd count).
 * `priority`: the page's LCP card (first card on /flavors).
 */
export function FlavorCard({ flavor, step = 0, wide = false, headingLevel = 3, priority = false }) {
  const { t } = useLocale();
  const Heading = `h${headingLevel}`;
  return (
    <Reveal as="li" kind="card" step={step} className={wide ? 'tablet:col-span-2' : ''}>
      <Link to={`/flavors/${flavor.slug}`} className="group block rounded-media">
        <div className={`relative aspect-[358/410] overflow-hidden rounded-media bg-ink-soft ${wide ? 'tablet:aspect-[1392/787]' : 'tablet:aspect-[688/787]'}`}>
          <div className="absolute inset-0 transition-transform duration-(--duration-card-out) ease-out-expo group-hover:scale-105 group-hover:duration-(--duration-card)">
            <FlavorMedia flavor={flavor} shape={wide ? 'switch' : 'portrait'} priority={priority} />
          </div>
        </div>
        <div className="px-4 pt-4">
          <Heading className="text-title font-normal tablet:text-title-lg">
            <FlavorName flavor={flavor} />
            <PrintedName flavor={flavor} className="mt-1" />
          </Heading>
          <p className="mt-4 text-body text-mist">{t(flavor.taglineKey)}</p>
          <p className="mt-6 flex flex-wrap gap-x-2 text-ui font-semibold text-smoke uppercase">
            {flavor.heat !== null && <span>| {t('home.flavors.heatTag', { value: flavor.heat })}</span>}
            {flavor.isNew && <span>| {t('home.flavors.newTag')}</span>}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}
