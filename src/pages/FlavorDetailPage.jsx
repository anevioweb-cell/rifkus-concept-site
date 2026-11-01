import { Link, useParams } from 'react-router';
import { flavors, getFlavor } from '../data/flavors.js';
import { photoImages, sceneImages } from '../data/images.generated.js';
import { site } from '../config/site.js';
import { useLocale } from '../hooks/useLocale.js';
import { Button } from '../components/Button.jsx';
import { DeferredImg } from '../components/DeferredImg.jsx';
import { avifSource } from '../lib/imageSources.js';
import { FlavorMedia } from '../components/FlavorMedia.jsx';
import { FlavorName } from '../components/FlavorName.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { Seo } from '../components/Seo.jsx';
import { WithBrandWords } from '../components/WithBrandWords.jsx';
import { plainBrandWords } from '../lib/brandWords.js';
import { FlavorCover } from '../sections/flavor/FlavorCover.jsx';
import { DistributorCta } from '../sections/home/DistributorCta.jsx';
import NotFoundPage from './NotFoundPage.jsx';

/** Gallery box sizes (reference: 1240 / 880 / 350 px wide, inset 100 / 60 / 20). */
const inset = 'px-5 tablet:px-15 desktop:px-25';
const box = 'relative overflow-hidden rounded-media bg-ink-soft';

/** A real photo (Zfiti only), cropped by the box. */
function Photo({ id, alt, position = '' }) {
  const p = photoImages[id];
  return (
    <DeferredImg
      sources={avifSource(p, '(min-width: 810px) 30vw, 100vw')}
      src={p.src}
      srcSet={p.srcSet}
      sizes="(min-width: 810px) 30vw, 100vw"
      width={p.width}
      height={p.height}
      alt={alt}
      className={`absolute inset-0 size-full object-cover ${position}`}
    />
  );
}

/** The bag alone on the dark surface, with the flavor's glow. */
function BagOnInk({ flavor, label }) {
  const { image } = flavor;
  return (
    <>
      <div aria-hidden="true" className="card-pocket absolute inset-0" />
      <DeferredImg
        sources={avifSource(image, '(min-width: 810px) 22vw, 70vw')}
        src={image.src}
        srcSet={image.srcSet}
        sizes="(min-width: 810px) 22vw, 70vw"
        width={image.width}
        height={image.height}
        alt={label}
        className="absolute inset-0 m-auto h-[82%] w-[70%] object-contain drop-shadow-bag-3d"
      />
    </>
  );
}

/** One facts row (reference "credits" grid: 12 px gray label, 14 px value). */
function Fact({ label, value, note }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="text-ui text-smoke uppercase">{label}</dt>
      <dd className="text-small">{value}</dd>
      {note && <dd className="text-micro font-medium text-smoke uppercase">{note}</dd>}
    </div>
  );
}

/** Previous / next flavor, reference "Related" cards (image 688×485, 12 px name, 48 px direction). */
function Neighbor({ flavor, direction, t }) {
  const end = direction === 'next';
  return (
    <Link to={`/flavors/${flavor.slug}`} className={`group block rounded-media ${end ? 'text-end' : ''}`}>
      <div className={`${box} aspect-[171/120] tablet:aspect-[688/485]`}>
        <div className="absolute inset-0 transition-transform duration-(--duration-card-out) ease-out-expo group-hover:scale-105 group-hover:duration-(--duration-card)">
          <FlavorMedia flavor={flavor} shape="wide" sizes="(min-width: 810px) 48vw, 46vw" bagSizes="(min-width: 810px) 20vw, 30vw" />
        </div>
      </div>
      <p className="mt-4 text-ui text-smoke">
        <FlavorName flavor={flavor} />
      </p>
      <p className="text-title font-medium tablet:text-section-md desktop:text-section-lg">{t(`flavorPage.${direction}`)}</p>
    </Link>
  );
}

/**
 * /flavors/:slug, one template for every flavor: cover, centered statement, gallery
 * (existing assets only: the wide scene with the bag, three thirds, the
 * scene with the name), description + facts grid (confirmed rows only:
 * rows without data are omitted), previous / next + "See all flavors", the
 * distributor CTA band. Unknown slugs render the 404 page.
 */
export default function FlavorDetailPage() {
  const { t } = useLocale();
  const flavor = getFlavor(useParams().slug);
  if (!flavor) {
    return (
      <>
        <Seo routeId="notFound" noindex />
        <NotFoundPage />
      </>
    );
  }

  const i = flavors.indexOf(flavor);
  const prev = flavors[(i - 1 + flavors.length) % flavors.length];
  const next = flavors[(i + 1) % flavors.length];
  const copy = (key) => t(`${flavor.copyGroup}.${key}`);
  const plain = flavor.nameAr ? `${flavor.name} (${flavor.nameAr})` : flavor.name;
  const potato = flavor.line === 'potato';
  const hasHeat = flavor.heat !== null;
  const tags = [...(hasHeat ? [t('home.flavors.heatTag', { value: flavor.heat })] : []), ...(flavor.isNew ? [t('home.flavors.newTag')] : [])];
  const scene = sceneImages[flavor.slug].desktop;
  const description = plainBrandWords(copy('description'));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${site.brandName} ${plain}`,
    brand: { '@type': 'Brand', name: site.brandName },
    description,
    image: [`${site.siteUrl}${flavor.image.src}`, `${site.siteUrl}${scene.src}`],
    url: `${site.siteUrl}/flavors/${flavor.slug}`,
  };
  const zfiti = flavor.slug === 'zfiti';

  return (
    <>
      <Seo
        routeId="flavor"
        title={plain}
        description={copy('meta')}
        image={scene.src}
        imageSize={[scene.width, scene.height]}
        imageAlt={copy('sceneAlt')}
        type="product"
        jsonLd={jsonLd}
      />
      <FlavorCover flavor={flavor} lineLabel={potato ? t('lines.potato') : ''} tags={tags} />

      <section aria-label={t('flavorPage.galleryLabel')}>
        <div className="px-gutter py-17.5 tablet:py-30 desktop:py-50">
          <Reveal
            as="p"
            kind="statement"
            className="mx-auto max-w-[76.5625rem] text-center text-title font-medium tablet:text-statement-md desktop:text-statement-lg"
          >
            <WithBrandWords text={copy('statement')} />
          </Reveal>
        </div>

        <div className={`${inset} pb-3 tablet:pb-4`}>
          <Reveal kind="image" className={`${box} aspect-[350/260] tablet:aspect-[1240/697]`}>
            <FlavorMedia flavor={flavor} shape="wide" sizes="(min-width: 810px) 86vw, 90vw" bagSizes="(min-width: 810px) 32vw, 50vw" />
          </Reveal>
        </div>

        <ul className={`${inset} grid gap-3 tablet:grid-cols-3 tablet:gap-4`}>
          <Reveal as="li" kind="image" className={`${box} aspect-[350/196] tablet:aspect-[283/274] desktop:aspect-[403/503]`}>
            {zfiti ? (
              <Photo id="zfiti-photo" alt={t('hero.photoAlt')} position="object-[50%_12%]" />
            ) : (
              <FlavorMedia flavor={flavor} bag={false} alt={copy('sceneAlt')} sizes="(min-width: 810px) 30vw, 100vw" />
            )}
          </Reveal>
          <Reveal as="li" kind="image" step={1} className={`${box} aspect-[350/456] tablet:aspect-[283/274] desktop:aspect-[403/503]`}>
            <BagOnInk flavor={flavor} label={t('flavorPage.bagOnInk', { name: flavor.name })} />
          </Reveal>
          <Reveal as="li" kind="image" step={2} className={`${box} aspect-[350/221] tablet:aspect-[283/274] desktop:aspect-[403/503]`}>
            {/* Zfiti: its scene alone (the shelf photo is already in the CTA band below). */}
            {zfiti ? (
              <FlavorMedia flavor={flavor} bag={false} alt={copy('sceneAlt')} sizes="(min-width: 810px) 30vw, 100vw" />
            ) : (
              <FlavorMedia flavor={flavor} sizes="(min-width: 810px) 30vw, 100vw" bagSizes="(min-width: 810px) 18vw, 56vw" />
            )}
          </Reveal>
        </ul>
      </section>

      <section
        aria-labelledby="flavor-facts"
        className="grid gap-10 px-gutter py-17.5 tablet:px-15 desktop:grid-cols-2 desktop:gap-15 desktop:px-[7.375rem] desktop:py-22.5"
      >
        <Reveal as="p" kind="line" className="text-lead tablet:text-lead-lg">
          <WithBrandWords text={copy('description')} />
        </Reveal>
        <div>
          <h2 id="flavor-facts" className="sr-only">
            {t('flavorPage.metaLabel')}
          </h2>
          <Reveal as="dl" kind="line" step={1} className="grid grid-cols-2 gap-x-10 gap-y-5.5">
            <Fact label={t('flavorPage.flavor')} value={<FlavorName flavor={flavor} />} />
            {potato && <Fact label={t('flavorPage.line')} value={t('lines.potato')} />}
            {flavor.printedName && <Fact label={t('flavorPage.printedName')} value={flavor.printedName} />}
            {hasHeat && <Fact label={t('flavorPage.heat')} value={t('flavorPage.heatValue', { value: flavor.heat })} />}
            {potato && <Fact label={t('flavorPage.pack')} value={t('packs.bag55')} note={t('flavorPage.packNote')} />}
            {zfiti && <Fact label={t('flavorPage.announced')} value={t('flavorPage.announcedValue')} />}
          </Reveal>
        </div>
      </section>

      <div className={`${inset} pb-4`}>
        <Reveal kind="image" className={`${box} aspect-[350/263] tablet:aspect-[4/3]`}>
          <FlavorMedia flavor={flavor} shape="wide" bag={false} sizes="(min-width: 810px) 86vw, 90vw" />
          <div aria-hidden="true" className="absolute inset-0 grid place-items-center bg-ink/45">
            <p className="text-page font-semibold tablet:text-page-md desktop:text-page-lg">
              <FlavorName flavor={flavor} className="[--ar-scale:0.82]" />
            </p>
          </div>
        </Reveal>
      </div>

      <nav aria-label={t('flavorPage.relatedLabel')} className="px-gutter pt-10 pb-10 desktop:pt-15 desktop:pb-20">
        <ul className="grid grid-cols-2 gap-4">
          <Reveal as="li" kind="card">
            <Neighbor flavor={prev} direction="previous" t={t} />
          </Reveal>
          <Reveal as="li" kind="card" step={1}>
            <Neighbor flavor={next} direction="next" t={t} />
          </Reveal>
        </ul>
        <Button to="/flavors" size="xl" className="mt-10 w-full desktop:mt-15">
          {t('flavorPage.seeAll')}
        </Button>
      </nav>

      <DistributorCta id="flavor-cta" />
    </>
  );
}
