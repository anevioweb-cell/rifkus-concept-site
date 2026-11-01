import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';
import { sceneSlide } from '../../config/heroSlides.js';
import { bagCenter } from '../../config/heroGeometry.js';
import { elementImages } from '../../data/images.generated.js';
import { useLocale } from '../../hooks/useLocale.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { FlavorName } from '../../components/FlavorName.jsx';
import { PrintedName } from '../../components/PrintedName.jsx';
import { HeroScene } from '../home/HeroScene.jsx';
import { sceneCss } from '../home/heroSceneCss.js';

/**
 * Flavor page cover, the reference's 900 px detail cover filled with the flavor's hero scene: base, pocket, glow, pieces,
 * the floating 3D bag, motes and grain, centered by the hero's own system
 * (`cover-geo` variables + the runtime bag center). Title 132 / 88 / 56 px
 * at the bottom start (blur 18 → 0 + fade, 1.0 s, CSS), tagline 48 / 32 /
 * 28 px, meta row (line at the start, tags at the end), 100 px from the
 * bottom. Pointer tilt like the hero; none under reduced motion.
 */
export function FlavorCover({ flavor, lineLabel, tags }) {
  const { t } = useLocale();
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  const slide = sceneSlide(flavor.slug);
  const sectionRef = useRef(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 90, damping: 18 });
  const springY = useSpring(py, { stiffness: 90, damping: 18 });
  const tiltY = useTransform(springX, (v) => -12 + v * 18);
  const tiltX = useTransform(springY, (v) => 4 - v * 12);

  // Same runtime centering as the hero: the CSS default is already right;
  // this keeps the bag center exact from the real stage box.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const measure = () => {
      const scene = section.querySelector('[data-scene]');
      const stage = scene?.querySelector('[data-stage]');
      if (!stage) return;
      const c = bagCenter({ left: stage.offsetLeft, top: stage.offsetTop, width: stage.offsetWidth, height: stage.offsetHeight }, flavor.image);
      scene.style.setProperty('--bag-cx-m', `${c.x.toFixed(2)}px`);
      scene.style.setProperty('--bag-cy-m', `${c.y.toFixed(2)}px`);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    return () => ro.disconnect();
  }, [flavor]);

  const onPointerMove = (event) => {
    if (reduce || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - box.left) / box.width - 0.5);
    py.set((event.clientY - box.top) / box.height - 0.5);
  };

  return (
    <section ref={sectionRef} aria-labelledby="flavor-title" onPointerMove={onPointerMove} className="cover-geo relative h-(--sec-h) overflow-hidden bg-ink">
      <style>{sceneCss([slide])}</style>
      <HeroScene slide={slide} priority load tiltX={tiltX} tiltY={tiltY} parX={springX} parY={springY} elements={elementImages} t={t} />
      <div aria-hidden="true" className="cover-scrim" />
      <div className="absolute inset-x-0 bottom-[calc(2rem+var(--safe-bottom))] px-gutter tablet:bottom-25 landscape-phone:end-auto landscape-phone:bottom-[calc(1.25rem+var(--safe-bottom))] landscape-phone:w-[58vw]">
        {/* Arabic title (Zfiti): smaller and lifted like the hero's, plus room
            under it so the dots of «ي» clear the tagline. */}
        <h1
          id="flavor-title"
          className="animate-cover-title text-page font-semibold has-[bdi]:pb-[0.22em] tablet:text-page-md desktop:text-page-lg landscape-phone:text-page"
        >
          <FlavorName flavor={flavor} className="relative bottom-[0.1em] [--ar-scale:0.82]" />
          <PrintedName flavor={flavor} className="mt-1 tablet:mt-2" />
        </h1>
        <p className="mt-3 text-title font-medium tablet:mt-6 tablet:text-section-md desktop:text-section-lg landscape-phone:mt-2 landscape-phone:text-title">
          {t(`${flavor.copyGroup}.detailTagline`)}
        </p>
        <div className="mt-3 flex flex-col gap-3 text-body tablet:mt-6 tablet:flex-row tablet:items-start tablet:justify-between tablet:py-2.5 landscape-phone:mt-2 landscape-phone:py-0">
          <p>{lineLabel}</p>
          <p className="flex flex-wrap gap-x-2 tablet:justify-end">
            {tags.map((tag) => (
              <span key={tag}>| {tag}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
