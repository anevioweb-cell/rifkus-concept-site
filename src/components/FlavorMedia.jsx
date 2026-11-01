import { sceneImages } from '../data/images.generated.js';
import { useLocale } from '../hooks/useLocale.js';
import { DeferredImg } from './DeferredImg.jsx';
import { avifSource } from '../lib/imageSources.js';

/** Bags in cards and galleries never ask for more than 640 px (below the fold). */
const bagSrcSet = (image) =>
  image.srcSet
    .split(', ')
    .filter((entry) => Number.parseInt(entry.split(' ')[1], 10) <= 640)
    .join(', ') || image.srcSet;

/** Eager image (and <picture>) for the LCP; `priority` marks the scene. */
function EagerImg({ sources, priority, ...props }) {
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is always passed by callers
  const img = <img loading="eager" decoding="async" fetchPriority={priority ? 'high' : undefined} {...props} />;
  if (!sources?.length) return img;
  return (
    <picture>
      {sources.map((s) => (
        <source key={`${s.media}-${s.type}`} media={s.media} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
      ))}
      {img}
    </picture>
  );
}

/** Portrait scenes suit portrait boxes; a derived (low-res) mobile crop falls back to the desktop file. */
const portraitScene = (scenes) => (scenes.mobile.origin === 'derived' ? scenes.desktop : scenes.mobile);

/**
 * A flavor's scene with its real bag on a dark pocket, filling its parent
 * box (the parent sets the aspect ratio and clips). `shape`:
 *   'portrait'  the portrait scene (cards)
 *   'wide'      the wide desktop scene
 *   'switch'    portrait on phones, wide from 810 px (the wide first card)
 * `bag={false}` shows the scene alone. `sizes` is for the scene image.
 * `priority`: the page's LCP image (first card on /flavors): plain eager
 * <img>s in the prerendered HTML, the scene with fetchpriority=high.
 */
export function FlavorMedia({
  flavor,
  shape = 'portrait',
  bag = true,
  priority = false,
  sizes = '(min-width: 810px) 48vw, 100vw',
  bagSizes = '(min-width: 810px) 26vw, 56vw',
  alt = '',
}) {
  const { t } = useLocale();
  const scenes = sceneImages[flavor.slug];
  const base = shape === 'wide' ? scenes.desktop : portraitScene(scenes);
  const { image } = flavor;
  // DeferredImg waits for hydration; the LCP image must be in the HTML instead.
  const Img = priority ? EagerImg : DeferredImg;
  return (
    <>
      <Img
        priority={priority || undefined}
        sources={[
          ...(shape === 'switch'
            ? [...avifSource(scenes.desktop, '96vw', '(min-width: 810px)'), { media: '(min-width: 810px)', srcSet: scenes.desktop.srcSet, sizes: '96vw' }]
            : []),
          ...avifSource(base, sizes),
        ]}
        src={base.src}
        srcSet={base.srcSet}
        sizes={sizes}
        width={base.width}
        height={base.height}
        alt={bag ? '' : alt}
        className="absolute inset-0 size-full object-cover"
      />
      {bag && (
        <>
          <div aria-hidden="true" className="card-pocket absolute inset-0" />
          <div aria-hidden="true" className="card-fade absolute inset-0" />
          <Img
            sources={avifSource({ avifSrcSet: bagSrcSet({ srcSet: image.avifSrcSet ?? '' }) || undefined }, bagSizes)}
            src={image.src}
            srcSet={bagSrcSet(image)}
            sizes={bagSizes}
            width={image.width}
            height={image.height}
            alt={alt || t('hero.bagAlt', { name: flavor.name })}
            className="absolute inset-0 m-auto h-[80%] w-[56%] object-contain drop-shadow-bag-3d"
          />
        </>
      )}
    </>
  );
}
