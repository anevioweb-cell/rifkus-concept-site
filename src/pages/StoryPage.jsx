import { photoImages } from '../data/images.generated.js';
import { site } from '../config/site.js';
import { useLocale } from '../hooks/useLocale.js';
import { Ar } from '../components/Ar.jsx';
import { Button } from '../components/Button.jsx';
import { FlavorRows } from '../components/FlavorRows.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { WithBrandWords } from '../components/WithBrandWords.jsx';
import { DistributorCta } from '../sections/home/DistributorCta.jsx';
import { LinesTeaser } from '../sections/home/LinesTeaser.jsx';

const photo = photoImages['zfiti-photo'];

/** One sourced fact (reference detail "credits" grid: 12 px label, value, 10 px source). */
function Fact({ label, children, source }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="text-ui text-smoke uppercase">{label}</dt>
      <dd className="text-small">{children}</dd>
      <dd className="text-micro font-medium text-smoke uppercase">{source}</dd>
    </div>
  );
}

/**
 * /our-story, after the template's About page: photo 670×504 at the start + 36 px statement and 16 px body at the end,
 * y 200; phones: photo first, 28 px statement). Then, in the reference's
 * own section patterns: the sourced facts (detail info + credits grid),
 * What we make (lines, the 55 g pack flagged), the flavors as rows, a 64 px
 * attitude statement (marketing copy) and the closing CTA band. Facts only
 * from the sources in src/data, always attributed; the founder is "Rifka" only.
 */
export default function StoryPage() {
  const { t } = useLocale();
  return (
    <>
      <section aria-labelledby="story-title" className="px-gutter pt-30 pb-14 tablet:pt-50 tablet:pb-28">
        <div className="grid gap-13 tablet:grid-cols-2">
          <div className="relative aspect-[358/269] overflow-hidden rounded-media bg-ink-soft tablet:aspect-[670/504]">
            <picture>
              <source type="image/avif" srcSet={photo.avifSrcSet} sizes="(min-width: 810px) 48vw, 85vw" />
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(min-width: 810px) 48vw, 85vw"
                width={photo.width}
                height={photo.height}
                alt={t('story.photoAlt')}
                fetchPriority="high"
                className="size-full object-cover object-[50%_12%]"
              />
            </picture>
          </div>
          <div className="flex flex-col justify-between gap-8">
            <h1 id="story-title" className="text-title font-normal tablet:text-title-lg">
              {t('story.s1')} <span className="text-smoke">{t('story.h1')}</span> {t('story.s2')} <span className="text-smoke">{t('story.h2')}</span>
              {t('story.s3')}
            </h1>
            <p className="max-w-[30.625rem] text-body text-ash">{t('story.body')}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="story-facts" className="px-gutter pb-20">
        <div className="rule-dotted pt-14 tablet:pt-6">
          <SectionLabel id="story-facts">{t('story.factsLabel')}</SectionLabel>
        </div>
        <div className="mt-6 grid gap-10 tablet:px-15 desktop:grid-cols-2 desktop:gap-15 desktop:px-[5.875rem]">
          <Reveal as="p" kind="line" className="text-lead tablet:text-lead-lg">
            {t('story.factsLead')}
          </Reveal>
          <Reveal as="dl" kind="line" step={1} className="grid grid-cols-2 gap-x-10 gap-y-8">
            <Fact label={t('story.whoLabel')} source={t('story.whoSource')}>
              {t('story.whoValue')}
            </Fact>
            <Fact label={t('story.launchLabel')} source={t('story.launchSource')}>
              {t('story.launchValue')}
            </Fact>
            <Fact label={t('story.sloganLabel')} source={t('story.sloganSource')}>
              <Ar className="[--ar-scale:1.1]">{site.sloganAr}</Ar>
              <span className="mt-1 block text-smoke">{t('story.sloganGloss')}</span>
            </Fact>
            <Fact label={t('story.hotLabel')} source={t('story.hotSource')}>
              <WithBrandWords text={t('story.hotValue')} />
            </Fact>
          </Reveal>
        </div>
      </section>

      <LinesTeaser />

      <section aria-labelledby="story-flavors" className="px-gutter pb-20">
        <div className="rule-dotted pt-14 tablet:pt-6">
          <SectionLabel id="story-flavors">{t('story.flavorsLabel')}</SectionLabel>
        </div>
        <div className="mt-6">
          <FlavorRows />
        </div>
        <div className="mt-10 px-4">
          <Button to="/flavors" arrow className="w-full tablet:w-[18.9375rem]">
            {t('story.flavorsCta')}
          </Button>
        </div>
      </section>

      {/* The page's one yellow band (like Why Rifkus on Home): navy on yellow, 9.45:1. */}
      <div data-surface="light" className="bg-brand px-gutter py-17.5 text-brand-ink tablet:py-30 desktop:py-50">
        <Reveal
          as="p"
          kind="statement"
          className="mx-auto max-w-[76.5625rem] text-center text-statement font-medium tablet:text-statement-md desktop:text-statement-lg"
        >
          {t('story.attitude')}
        </Reveal>
      </div>

      <DistributorCta id="story-cta" />
    </>
  );
}
