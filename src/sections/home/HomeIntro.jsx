import { photoImages } from '../../data/images.generated.js';
import { avifSource } from '../../lib/imageSources.js';
import { DeferredImg } from '../../components/DeferredImg.jsx';
import { useLocale } from '../../hooks/useLocale.js';
import { WithBrandWords } from '../../components/WithBrandWords.jsx';
import { Reveal } from '../../components/Reveal.jsx';

const photo = photoImages['zfiti-photo'];

/**
 * Intro, in the reference's split-statement layout (About): image 670×503
 * at the start (358×269 first on phones), a 36 px statement (28) with key
 * phrases in gray, a 16 px body at the bottom of the column. Facts only:
 * the brand's Instagram bio (100% Algerian snack) and the launch posts (November 2024, Rifka).
 */
export function HomeIntro() {
  const { t } = useLocale();
  return (
    <section aria-labelledby="home-intro" className="px-gutter pt-14 pb-14 tablet:pt-30 tablet:pb-28">
      <div className="grid gap-13 tablet:grid-cols-2">
        <Reveal kind="image" className="relative aspect-[358/269] overflow-hidden rounded-media bg-ink-soft tablet:aspect-[670/503]">
          <DeferredImg
            sources={avifSource(photo, '(min-width: 810px) 48vw, 100vw')}
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 810px) 48vw, 100vw"
            width={photo.width}
            height={photo.height}
            alt={t('hero.photoAlt')}
            className="size-full object-cover object-[50%_12%]"
          />
        </Reveal>
        <div className="flex flex-col justify-between gap-8">
          <Reveal as="h2" kind="statement" id="home-intro" className="text-title font-normal tablet:text-title-lg">
            {t('home.intro.s1')} <span className="text-smoke">{t('home.intro.h1')}</span> {t('home.intro.s2')}{' '}
            <span className="text-smoke">{t('home.intro.h2')}</span> <WithBrandWords text={t('home.intro.s3')} />
          </Reveal>
          <Reveal as="p" kind="statement" className="max-w-[30.625rem] text-body text-ash">
            {t('home.intro.body')}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
