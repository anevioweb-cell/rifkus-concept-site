import { flavorImages } from '../../data/images.generated.js';
import { avifSource } from '../../lib/imageSources.js';
import { DeferredImg } from '../../components/DeferredImg.jsx';
import { site } from '../../config/site.js';
import { useLocale } from '../../hooks/useLocale.js';
import { Reveal } from '../../components/Reveal.jsx';
import { SectionLabel } from '../../components/SectionLabel.jsx';

const POTATO_BAGS = ['ketchup', 'chicken'];

function Meta({ label, value, note }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-ui font-semibold text-smoke uppercase">{label}</dt>
      <dd className="text-small">{value}</dd>
      {note && <dd className="text-micro font-medium text-smoke uppercase">{note}</dd>}
    </div>
  );
}

/**
 * Lines & sizes, in the reference's "info + meta grid" (project detail):
 * a 24 px paragraph at the start, a 2-column meta grid (12 px uppercase
 * labels, 14 px values) at the end. Pack sizes are retailer / importer
 * reports and say so; Mini Rifkus sizes are a
 * placeholder. The two bags are the ones printed "Potato Chips" among the
 * six flavors featured here.
 */
export function LinesTeaser() {
  const { t } = useLocale();
  return (
    <section aria-labelledby="home-lines" className="px-gutter pb-20">
      <div className="rule-dotted pt-14 tablet:pt-6">
        <SectionLabel id="home-lines">{t('home.lines.label')}</SectionLabel>
      </div>
      <div className="mt-6 grid gap-12 tablet:grid-cols-2 tablet:gap-13">
        <Reveal kind="image" className="flex flex-col gap-10 px-0 tablet:px-[5.875rem]">
          <p className="max-w-[35.75rem] text-lead tablet:text-lead-lg">{t('home.lines.lead')}</p>
          <ul aria-label={t('home.lines.bagsAlt')} className="flex items-end gap-4">
            {POTATO_BAGS.map((slug) => {
              const img = flavorImages[slug];
              return (
                <li key={slug} className="w-1/3 max-w-[10rem]">
                  <DeferredImg
                    sources={avifSource(img, '(min-width: 810px) 160px, 30vw')}
                    src={img.src}
                    srcSet={img.srcSet}
                    sizes="(min-width: 810px) 160px, 30vw"
                    width={img.width}
                    height={img.height}
                    alt=""
                    className="w-full drop-shadow-bag-3d"
                  />
                </li>
              );
            })}
          </ul>
        </Reveal>
        <Reveal kind="image" step={1}>
          <div className="grid gap-10 sm:grid-cols-2">
            <dl className="flex flex-col gap-6">
              <Meta label={t('home.lines.line')} value={t('home.lines.potato')} />
              <Meta label={t('home.lines.pack')} value={t('home.lines.packValue')} note={t('home.lines.reportedRetail')} />
              <Meta label={t('home.lines.flavors')} value={t('home.lines.potatoFlavors')} note={t('home.lines.potatoFlavorsNote')} />
            </dl>
            <dl className="flex flex-col gap-6">
              <Meta label={t('home.lines.line')} value={t('home.lines.mini')} />
              <Meta label={t('home.lines.status')} value={t('home.lines.miniStatus')} />
              {site.showPlaceholders && <Meta label={t('home.lines.sizes')} value={t('home.lines.miniSizes')} />}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
