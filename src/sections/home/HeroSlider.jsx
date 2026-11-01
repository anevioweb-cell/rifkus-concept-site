import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { animate, m, useMotionValue, useSpring, useTransform } from 'motion/react';
import { heroSlides } from '../../config/heroSlides.js';
import { bagCenter } from '../../config/heroGeometry.js';
import { elementImages } from '../../data/images.generated.js';
import { HeroScene } from './HeroScene.jsx';
import { sceneCss } from './heroSceneCss.js';
import { duration, ease, slider } from '../../config/motion.js';
import { useLocale } from '../../hooks/useLocale.js';
import { useHydrated } from '../../hooks/useHydrated.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { Button } from '../../components/Button.jsx';
import { FlavorName } from '../../components/FlavorName.jsx';
import { PrintedName } from '../../components/PrintedName.jsx';
import { PauseIcon, PlayIcon } from '../../components/icons/index.jsx';

const total = heroSlides.length;
const pad = (n) => String(n).padStart(2, '0');
const plainName = (flavor) => flavor.nameAr ?? flavor.name;
const SCENE_CSS = sceneCss(heroSlides);

/** Long thin arrow (our own drawing), pointing up; flipped for "next". */
function LongArrow({ className = '' }) {
  return (
    <svg viewBox="0 0 51 64" fill="none" aria-hidden="true" className={className}>
      <path d="M25.5 63V2M25.5 2 4 23.5M25.5 2 47 23.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Home hero, measured on the reference:
 * one screen, six full-bleed slides (Mhadjeb first), h1 at the top end, counter with
 * arrows + 130/80/40 px title + subtitle at the bottom start, the names row,
 * and a 6 px progress bar.
 *
 * First paint: everything is in the prerendered HTML and visible. The load
 * sequence is CSS (zoom 1.2 → 1, mask rise, fades) so it needs no JS.
 * After hydration, `motion` drives autoplay (3.0 s progress) and the
 * change: the incoming slide is revealed from the bottom (outer translateY
 * 100 % → 0 inside overflow:hidden, inner counter-moves -116.7 % → 0 so the
 * picture drifts down like the reference's clip-path wipe), 1.3 s
 * ease-out-expo, transform only. The title and subtitle rise again (1.0 s).
 *
 * Accessibility: autoplay holds while the pointer is on the controls or
 * focus is inside the hero, and has a pause button
 * (WCAG 2.2.2); it is off under reduced motion, where a change is a 200 ms
 * fade. Changes are announced politely only when not rotating.
 *
 * Phones: no arrow column (a
 * horizontal swipe and the names row change slides); two actions above the
 * names row ("See this flavor", "All flavors"); the names row keeps the
 * active name in view and fades at its edges. A swipe needs a clear
 * horizontal intent (≥ 48 px, 1.4× the vertical move), so vertical
 * scrolling is never blocked (touch-action: pan-y). Save-Data or a low
 * memory device skips the idle prefetch of the other slides.
 */
const SWIPE = { min: 48, ratio: 1.4, maxMs: 900 };
export function HeroSlider() {
  const { t } = useLocale();
  // Both hooks read false on the server and during hydration (no mismatch).
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  const mounted = useHydrated();
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [busy, setBusy] = useState(false);
  // null = follow the default: autoplay, except under reduced motion.
  const [userPaused, setUserPaused] = useState(null);
  const paused = userPaused ?? reduce;
  const [hold, setHold] = useState(false);
  // The first scene loads with the page; the others right after the first
  // paint, when the browser is idle (or on demand, if a visitor jumps).
  const [wanted, setWanted] = useState(() => new Set([0]));
  const sectionRef = useRef(null);
  const outerRefs = useRef([]);
  const innerRefs = useRef([]);
  const progressRef = useRef(null);
  const progressAnim = useRef(null);
  const holdRef = useRef(false);
  const namesRef = useRef(null);
  const swipeRef = useRef(null);
  // Pointer tilt (mouse only): -0.5..0.5 across the hero, springy, ±9° / ±6°
  // around a resting three-quarter pose. Off under reduced motion.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 90, damping: 18 });
  const springY = useSpring(py, { stiffness: 90, damping: 18 });
  const tiltY = useTransform(springX, (v) => -12 + v * 18);
  const tiltX = useTransform(springY, (v) => 4 - v * 12);
  // Depth parallax for the scene layers (same springs as the tilt).
  const parX = springX;
  const parY = springY;

  // Prefetch after the page has loaded (never competing with the first
  // slide): the next slide first (autoplay goes there in 3 s), the rest a
  // moment later.
  useEffect(() => {
    const lite = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2);
    if (lite) return undefined;
    const hasIdle = 'requestIdleCallback' in window;
    let idleId;
    let nextId;
    let allId;
    const next = () => setWanted((set) => new Set([...set, 1]));
    const start = () => {
      if (hasIdle) idleId = window.requestIdleCallback(next, { timeout: 1000 });
      else nextId = setTimeout(next, 600);
      allId = setTimeout(() => setWanted(new Set(heroSlides.map((_, i) => i))), 1800);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      clearTimeout(nextId);
      clearTimeout(allId);
    };
  }, []);

  // Runtime centering: read every stage box once per resize (layout values,
  // not affected by the wipe / zoom / float transforms), then write the bag
  // center as CSS variables on each slide. The CSS default from hero.css is
  // already right; this keeps it exact if the layout ever changes.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const measure = () => {
      const reads = [...section.querySelectorAll('[data-scene]')].map((scene) => {
        const stage = scene.querySelector('[data-stage]');
        const slide = heroSlides.find((sl) => sl.flavor.slug === scene.dataset.scene);
        if (!stage || !slide) return null;
        const c = bagCenter({ left: stage.offsetLeft, top: stage.offsetTop, width: stage.offsetWidth, height: stage.offsetHeight }, slide.flavor.image);
        return { scene, c };
      });
      for (const r of reads) {
        if (!r) continue;
        r.scene.style.setProperty('--bag-cx-m', `${r.c.x.toFixed(2)}px`);
        r.scene.style.setProperty('--bag-cy-m', `${r.c.y.toFixed(2)}px`);
      }
    };
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    return () => ro.disconnect();
  }, [wanted]);

  // Keep the active name in view in the (scrollable) names row.
  useEffect(() => {
    const row = namesRef.current;
    const active = row?.querySelector('[aria-current="true"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const left = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
    row.scrollTo({ left, behavior: reduce || !mounted ? 'auto' : 'smooth' });
  }, [index, reduce, mounted]);

  // Touch swipe: horizontal intent only; the names row scrolls on its own.
  const onPointerDown = (event) => {
    if (event.pointerType !== 'touch' || namesRef.current?.contains(event.target)) return;
    swipeRef.current = { x: event.clientX, y: event.clientY, t: event.timeStamp };
  };
  const onPointerUp = (event) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE.min || Math.abs(dx) < Math.abs(dy) * SWIPE.ratio || event.timeStamp - start.t > SWIPE.maxMs) return;
    goTo(dx < 0 ? (index + 1) % total : (index - 1 + total) % total);
  };

  const onPointerMove = (event) => {
    if (reduce || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - box.left) / box.width - 0.5);
    py.set((event.clientY - box.top) / box.height - 0.5);
  };

  const goTo = useCallback(
    (next) => {
      if (busy || next === index) return;
      setWanted((set) => new Set([...set, next]));
      setPrevious(index);
      setIndex(next);
      setBusy(true);
    },
    [busy, index],
  );

  // The wipe.
  useEffect(() => {
    if (previous === null) return undefined;
    const outer = outerRefs.current[index];
    const inner = innerRefs.current[index];
    const runs = reduce
      ? [animate(outer, { opacity: [0, 1] }, { duration: duration.fast })]
      : [
          animate(outer, { y: ['100%', '0%'], opacity: 1 }, { duration: slider.wipe, ease: ease.outExpo }),
          animate(inner, { y: [`${slider.innerRatio * 100}%`, '0%'] }, { duration: slider.wipe, ease: ease.outExpo }),
        ];
    let cancelled = false;
    Promise.all(runs).then(() => {
      if (cancelled) return;
      setPrevious(null);
      setBusy(false);
    });
    return () => {
      cancelled = true;
      runs.forEach((run) => run.stop());
    };
  }, [index, previous, reduce]);

  // Autoplay: the progress bar fills linearly, then the next slide comes in.
  useEffect(() => {
    const bar = progressRef.current;
    if (busy || paused) {
      animate(bar, { scaleX: 0 }, { duration: 0 });
      return undefined;
    }
    const run = animate(bar, { scaleX: [0, 1] }, { duration: slider.progress, ease: 'linear' });
    progressAnim.current = run;
    if (holdRef.current) run.pause();
    let cancelled = false;
    run.then(() => {
      if (!cancelled) goTo((index + 1) % total);
    });
    return () => {
      cancelled = true;
      run.stop();
      progressAnim.current = null;
    };
  }, [index, busy, paused, goTo]);

  // Hover / focus inside the hero holds the progress where it is.
  useEffect(() => {
    holdRef.current = hold;
    const run = progressAnim.current;
    if (!run) return;
    if (hold) run.pause();
    else run.play();
  }, [hold]);

  const current = heroSlides[index].flavor;
  const prevSlide = heroSlides[(index - 1 + total) % total].flavor;
  const nextSlide = heroSlides[(index + 1) % total].flavor;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('hero.regionLabel')}
      ref={sectionRef}
      className="relative h-svh min-h-[34rem] touch-pan-y hero-geo overflow-hidden bg-ink short:min-h-0 landscape-phone:min-h-0"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipeRef.current = null)}
      onFocus={() => setHold(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHold(false);
      }}
    >
      {/* Per-scene variables (focal points, tints, pieces, motes): static CSS. */}
      <style>{SCENE_CSS}</style>
      {/* Slides (pictures only; the text lives below so it can re-rise). */}
      {heroSlides.map((slide, i) => {
        const active = i === index;
        const layer = active ? 'z-2' : i === previous ? 'z-1' : 'invisible';
        return (
          <div
            key={slide.flavor.slug}
            ref={(el) => (outerRefs.current[i] = el)}
            aria-hidden={active ? undefined : true}
            className={`absolute inset-0 overflow-hidden ${layer}`}
          >
            <div ref={(el) => (innerRefs.current[i] = el)} className="absolute inset-0">
              <Link to={`/flavors/${slide.flavor.slug}`} tabIndex={-1} className={`absolute inset-0 ${i === 0 ? 'animate-hero-zoom' : ''}`}>
                <HeroScene
                  slide={slide}
                  priority={i === 0}
                  load={i === 0 || (mounted && wanted.has(i))}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  parX={parX}
                  parY={parY}
                  elements={elementImages}
                  t={t}
                />
              </Link>
            </div>
          </div>
        );
      })}

      {/* Scrim (reference gradient) above the pictures. */}
      <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0 z-3" />
      {/* Text protection behind the h1, the title block and the names row. */}
      <div aria-hidden="true" className="scene-legibility pointer-events-none z-3" />

      <h1 className="absolute end-gutter tablet:end-5 desktop:end-gutter top-[calc(var(--nav-height)+2.1875rem)] short:top-[calc(var(--nav-height)+0.75rem)] z-4 text-end text-sub font-semibold tracking-[-0.03em] tablet:top-[calc(var(--nav-height)+2.25rem)] desktop:top-[calc(var(--nav-height)+3rem)] landscape-phone:start-gutter landscape-phone:end-auto landscape-phone:top-[calc(var(--nav-height)+0.75rem)] landscape-phone:text-start landscape-phone:text-sub">
        <span className="block overflow-hidden pb-[0.08em]">
          <span className="block animate-hero-rise">{t('hero.titleLine1')}</span>
        </span>
        <span className="block overflow-hidden pb-[0.08em]">
          <span className="block animate-hero-rise">{t('site.strip')}</span>
        </span>
      </h1>

      {/* Counter + title + subtitle (bottom start). */}
      <div className="absolute inset-x-0 bottom-[calc(7.25rem+var(--safe-bottom))] z-4 flex items-center px-gutter tablet:bottom-[7.5rem] desktop:bottom-[6.875rem] landscape-phone:end-auto landscape-phone:bottom-[calc(3.75rem+var(--safe-bottom))] landscape-phone:w-[56vw]">
        <div
          className="-ms-4 hidden w-15 shrink-0 animate-hero-fade flex-col items-center tablet:-ms-5 tablet:flex tablet:w-[5.1875rem] desktop:-ms-4 landscape-phone:hidden"
          onPointerEnter={() => setHold(true)}
          onPointerLeave={() => setHold(false)}
        >
          <button
            type="button"
            onClick={() => goTo((index - 1 + total) % total)}
            aria-label={t('hero.previous', { name: plainName(prevSlide) })}
            className={`flex h-15 w-15 items-center justify-center rounded-ui transition-[opacity,transform] duration-(--duration-hover) hover:-translate-y-0.5 hover:opacity-100 tablet:h-24 tablet:w-[5.1875rem] ${busy ? 'opacity-45' : 'opacity-62'}`}
          >
            <LongArrow className="h-7 tablet:h-16" />
          </button>
          <p className="text-switch font-medium tabular-nums tablet:text-switch-md desktop:text-switch-lg">
            <span className="sr-only">{t('hero.slideLabel', { index: index + 1, total })}</span>
            <span aria-hidden="true">{pad(index + 1)}</span>
          </p>
          <button
            type="button"
            onClick={() => goTo((index + 1) % total)}
            aria-label={t('hero.next', { name: plainName(nextSlide) })}
            className={`flex h-15 w-15 items-center justify-center rounded-ui transition-[opacity,transform] duration-(--duration-hover) hover:-translate-y-0.5 hover:opacity-100 tablet:h-24 tablet:w-[5.1875rem] ${busy ? 'opacity-45' : 'opacity-62'}`}
          >
            <LongArrow className="h-7 -scale-y-100 tablet:h-16" />
          </button>
        </div>

        {/* Tablet: the reference title column sits 20 px above center. */}
        <div className="min-w-0 flex-1 tablet:-mt-10 desktop:mt-0 landscape-phone:mt-0">
          {/* An Arabic title («محاجب», «زفيطي») gets 0.1em more mask room for the tail of «ي»,
              taken back from the gap below so the subtitle does not move. */}
          <h2 className="overflow-hidden pb-[0.16em] text-slide font-medium has-[bdi]:-mb-[0.1em] has-[bdi]:pb-[0.26em] tablet:text-slide-md desktop:text-slide-lg landscape-phone:text-slide">
            <span className="block animate-hero-rise">
              <m.span
                key={current.slug}
                className="block"
                initial={previous === null ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: duration.rise, ease: ease.outExpo }}
              >
                <Link to={`/flavors/${current.slug}`}>
                  {/* Arabic title: a bit smaller and lifted 0.1em (no layout
                      change) so the tail of «ي» clears the subtitle. */}
                  <FlavorName flavor={current} className="relative bottom-[0.1em] [--ar-scale:0.82]" />
                </Link>
                <PrintedName flavor={current} className="mt-1 tablet:mt-2" />
              </m.span>
            </span>
          </h2>
          <p className="overflow-hidden pb-[0.15em] text-sub font-medium tablet:text-sub-lg landscape-phone:text-sub">
            <span className="block animate-hero-rise">
              <m.span
                key={current.slug}
                className="block"
                initial={previous === null ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: duration.rise, ease: ease.outExpo }}
              >
                {t(current.taglineKey)}
              </m.span>
            </span>
          </p>
        </div>
      </div>

      {/* Phones: the two actions, above the names row (thumb zone). */}
      <div className="absolute inset-x-0 bottom-[calc(3.75rem+var(--safe-bottom))] z-5 flex animate-hero-fade gap-2 px-gutter tablet:hidden landscape-phone:hidden">
        <Button to={`/flavors/${current.slug}`} variant="brand" size="sm" className="min-h-tap flex-1 whitespace-nowrap xs:px-3">
          {t('hero.ctaFlavor')}
        </Button>
        <Button to="/flavors" size="sm" className="min-h-tap flex-1 bg-ink/60 whitespace-nowrap xs:px-3">
          {t('hero.ctaAll')}
        </Button>
      </div>

      {/* Polite announcement of the current flavor, only when not rotating. */}
      <p className="sr-only" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
        {`${plainName(current)}, ${t('hero.slideLabel', { index: index + 1, total })}`}
      </p>

      {/* Names row (+ pause/play). Scrolls sideways on narrow screens. */}
      <div
        ref={namesRef}
        data-lenis-prevent
        className="names-fade absolute inset-x-0 bottom-[calc(0.5rem+var(--safe-bottom))] z-5 overscroll-x-contain animate-hero-fade-late overflow-x-auto [scrollbar-width:none] tablet:bottom-[2.4375rem] tablet:pe-44 desktop:bottom-7 desktop:pe-0 landscape-phone:end-auto landscape-phone:bottom-[calc(0.5rem+var(--safe-bottom))] landscape-phone:w-[56vw] landscape-phone:pe-0"
      >
        <ul
          className="mx-auto flex w-max items-center gap-1 px-1 tablet:gap-2 landscape-phone:mx-0"
          onPointerEnter={() => setHold(true)}
          onPointerLeave={() => setHold(false)}
        >
          <li>
            <button
              type="button"
              onClick={() => setUserPaused(!paused)}
              aria-label={paused ? t('hero.play') : t('hero.pause')}
              className="flex size-11 items-center justify-center rounded-ui text-white/70 transition-colors duration-(--duration-hover) hover:text-white"
            >
              {paused ? <PlayIcon className="size-4 tablet:size-3.5" /> : <PauseIcon className="size-4 tablet:size-3.5" />}
            </button>
          </li>
          {heroSlides.map((slide, i) => (
            <li key={slide.flavor.slug}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === index ? 'true' : undefined}
                aria-label={t('hero.show', { name: plainName(slide.flavor) })}
                className={`flex min-h-11 items-center rounded-ui px-3.5 text-switch font-medium transition-[color,opacity] duration-(--duration-hover) tablet:px-5 tablet:text-switch-md desktop:text-switch-lg ${
                  i === index ? 'text-white' : 'text-white/50 hover:text-white'
                } ${busy ? 'opacity-55' : ''}`}
              >
                <FlavorName flavor={slide.flavor} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Progress: 6 px track, white fill scaled from the start. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-5 h-1.5 bg-white/18 max-tablet:h-1">
        <m.div ref={progressRef} initial={{ scaleX: 0 }} className="h-full origin-left bg-white" />
      </div>
    </section>
  );
}
