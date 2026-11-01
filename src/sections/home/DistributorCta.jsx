import { photoImages } from '../../data/images.generated.js';
import { avifSource } from '../../lib/imageSources.js';
import { DeferredImg } from '../../components/DeferredImg.jsx';
import { useLocale } from '../../hooks/useLocale.js';
import { Button } from '../../components/Button.jsx';
import { Reveal } from '../../components/Reveal.jsx';

const shelf = photoImages['zfiti-shelf'];

/**
 * Distributor CTA, which is also the closing CTA: the reference's CTA band
 * (Projects "Contact CTA"). Desktop: a
 * 1392 inner box, start column 682 with a 64 px headline, 16 px gray
 * subtitle, a 303×60 outlined button and a 12 px note beside it; end column
 * 658 with a 658×494 image. Below 1200 px it stacks like the reference:
 * image first (4:3, 960×720 at 1000; 358×269 on phones), then the text, a
 * 468 px button (full width on phones) and the note.
 * On ink everywhere with a solid yellow button, so it never
 * merges with the yellow Why Rifkus band.
 */
export function DistributorCta({ id = 'home-cta', to = '/distributors' }) {
  const { t } = useLocale();
  return (
    <section aria-labelledby={id} className="px-gutter pb-20 tablet:pt-15 tablet:pb-30">
      <div className="grid gap-12 rule-dotted pt-6 tablet:pt-15 desktop:grid-cols-[682fr_658fr] desktop:gap-13 desktop:pb-15">
        <div className="flex flex-col justify-between gap-12 desktop:px-3">
          <div>
            <Reveal as="h2" kind="line" id={id} className="max-w-[40.625rem] text-statement font-medium tablet:text-statement-lg">
              {t('home.cta.title')}
            </Reveal>
            <Reveal as="p" kind="line" step={1} className="mt-8 max-w-[28.75rem] text-body text-smoke">
              {t('home.cta.body')}
            </Reveal>
          </div>
          <Reveal kind="line" step={2} className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:gap-13">
            <Button to={to} variant="brand" arrow className="w-full tablet:w-[29.25rem] tablet:shrink-0 desktop:w-[18.9375rem]">
              {t('home.cta.button')}
            </Button>
            <p className="text-ui font-semibold text-smoke uppercase tablet:max-w-[18.9375rem]">{t('home.cta.note')}</p>
          </Reveal>
        </div>
        <Reveal
          kind="image"
          className="relative order-first aspect-[358/269] overflow-hidden rounded-media bg-ink-soft tablet:aspect-[4/3] desktop:order-none desktop:aspect-[658/494]"
        >
          <DeferredImg
            sources={avifSource(shelf, '(min-width: 1200px) 46vw, 100vw')}
            src={shelf.src}
            srcSet={shelf.srcSet}
            sizes="(min-width: 1200px) 46vw, 100vw"
            width={shelf.width}
            height={shelf.height}
            alt={t('home.cta.imageAlt')}
            className="size-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
