import { m, useTransform } from 'motion/react';
import { TALL_MEDIA, moteList } from './heroSceneCss.js';

/** Bag stage width per breakpoint (keep in sync with hero.css). */
/** Hero bags never ask for more than `max` px (per-slide weight budget on phones). */
const heroBagSrcSet = (image, max = 800) =>
  image.srcSet
    .split(', ')
    .filter((entry) => Number.parseInt(entry.split(' ')[1], 10) <= max)
    .join(', ') || image.srcSet;
const BAG_SIZES =
  '(min-width: 1200px) min(calc((100vh - 180px) * 0.8), calc(100vw - 920px)), (min-width: 810px) min(calc((100vh - 264px) * 0.8), calc(100vw - 524px)), min(calc((100vh - 449px) * 0.8), calc(100vw - 32px))';

/** One ingredient cutout on the loose ellipse around the bag (see heroScenes.js). */
function Piece({ piece, image, depthX, depthY }) {
  const x = useTransform(depthX, (v) => v * piece.parallax);
  const y = useTransform(depthY, (v) => v * piece.parallax);
  return (
    <m.div aria-hidden="true" style={{ x, y }} className="piece-slot" data-depth={piece.depth} data-piece={`${piece.id}${piece.key ? `-${piece.key}` : ''}`}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes="(min-width: 1200px) 180px, 120px"
        width={image.width}
        height={image.height}
        alt=""
        loading="lazy"
        decoding="async"
        className="piece"
      />
    </m.div>
  );
}

/**
 * The bag in 3D: perspective stage, resting three-quarter pose, slow float
 * (CSS) with its contact shadow in sync, pointer tilt (motion values).
 */
function Bag({ flavor, scene, priority, tiltX, tiltY, t }) {
  const { image } = flavor;
  return (
    <div data-stage className="hero-stage">
      <div
        aria-hidden="true"
        className="absolute inset-x-[18%] bottom-[1%] h-[7%] animate-bag-shadow rounded-[50%] bg-radial from-black/75 to-transparent to-70% blur-md"
      />
      <div className="absolute inset-x-[1%] top-0 bottom-[4%] animate-bag-float">
        <picture className="block size-full">
          {image.avifSrcSet && <source type="image/avif" srcSet={heroBagSrcSet({ srcSet: image.avifSrcSet }, scene.bagMax)} sizes={BAG_SIZES} />}
          <m.img
            src={image.src}
            srcSet={heroBagSrcSet(image, scene.bagMax)}
            sizes={BAG_SIZES}
            width={image.width}
            height={image.height}
            alt={t('hero.bagAlt', { name: flavor.name })}
            loading={priority ? 'eager' : undefined}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            style={{ rotateX: tiltX, rotateY: tiltY }}
            className="size-full origin-center object-contain drop-shadow-bag-3d"
          />
        </picture>
      </div>
      {scene.badge === 'new' && <p className="stage-badge rounded-pill bg-brand font-bold text-ink uppercase shadow-pop">{t('hero.new')}</p>}
    </div>
  );
}

/**
 * One hero scene, back to front: base background (focal point behind the
 * bag center) → dark pocket → rim glow → ingredient pieces behind → bag →
 * blurred pieces in front (edges only) → motes → grain. Parallax: the base
 * and the pieces follow the pointer by depth (transform only).
 */
export function HeroScene({ slide, priority, load, tiltX, tiltY, parX, parY, elements, t }) {
  const { flavor, scene, images } = slide;
  const bgX = useTransform(parX, (v) => v * -14);
  const bgY = useTransform(parY, (v) => v * -10);
  if (!load) return null;
  const back = scene.pieces.filter((p) => p.depth !== 'front' && elements[p.id]);
  const front = scene.pieces.filter((p) => p.depth === 'front' && elements[p.id]);
  return (
    <div data-scene={flavor.slug} className="absolute inset-0">
      <div className="scene-base">
        <m.div style={{ x: bgX, y: bgY }} className="size-full">
          <picture>
            {images.mobile.avifSrcSet && <source media={TALL_MEDIA} type="image/avif" srcSet={images.mobile.avifSrcSet} sizes="140vw" />}
            <source media={TALL_MEDIA} srcSet={images.mobile.srcSet} sizes="140vw" />
            {images.desktop.avifSrcSet && <source type="image/avif" srcSet={images.desktop.avifSrcSet} sizes="130vw" />}
            <img
              src={images.desktop.src}
              srcSet={images.desktop.srcSet}
              sizes="130vw"
              width={images.desktop.width}
              height={images.desktop.height}
              alt=""
              loading={priority ? 'eager' : undefined}
              fetchPriority={priority ? 'low' : undefined}
              decoding="async"
              className="size-full object-cover"
            />
          </picture>
        </m.div>
      </div>
      <div aria-hidden="true" className="scene-pocket" />
      <div aria-hidden="true" className="scene-glow" />
      {scene.shade > 0 && <div aria-hidden="true" className="scene-shade" />}
      {back.map((p) => (
        <Piece key={`${p.id}${p.key ?? ''}`} piece={p} image={elements[p.id]} depthX={parX} depthY={parY} />
      ))}
      <Bag flavor={flavor} scene={scene} priority={priority} tiltX={tiltX} tiltY={tiltY} t={t} />
      {front.map((p) => (
        <Piece key={`${p.id}${p.key ?? ''}`} piece={p} image={elements[p.id]} depthX={parX} depthY={parY} />
      ))}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {moteList(flavor.slug).map((_, i) => (
          <span key={i} className="mote" data-mote={i} />
        ))}
      </div>
      <div aria-hidden="true" className="scene-grain pointer-events-none" />
    </div>
  );
}
