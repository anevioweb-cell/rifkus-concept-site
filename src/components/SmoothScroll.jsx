import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { smoothScroll } from '../config/motion.js';
import { lenisInstance } from '../lib/lenisInstance.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

/**
 * Lenis smooth scrolling for the mouse wheel. Mounted once in the layout; renders
 * nothing.
 * - Loads after the first paint: a dynamic import on the first idle moment
 *   after hydration, so it never competes with the hero (LCP, TBT).
 * - Never loads under prefers-reduced-motion, and is destroyed if the
 *   setting turns on (it reloads if it turns off).
 * - Wheel only (`syncTouch: false`): touch, keyboard, Tab focus,
 *   find-in-page and anchor jumps stay native; Lenis follows them.
 * - Nested scroll areas scroll on their own (`allowNestedScroll`, plus
 *   `data-lenis-prevent` on the hero names row and the phone menu).
 * - Clicking an internal link stops the inertia; after every navigation it
 *   is re-synced, without animation, to the position React Router's
 *   ScrollRestoration set (top on a new page, the saved one on back/forward).
 * - Paused while the phone menu locks the page (useScrollLock).
 */
export function SmoothScroll() {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { key } = useLocation();

  useEffect(() => {
    if (reduce) return undefined;
    let lenis = null;
    let cancelled = false;
    const start = async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      lenis = new Lenis({
        lerp: smoothScroll.lerp,
        wheelMultiplier: smoothScroll.wheelMultiplier,
        smoothWheel: true,
        syncTouch: false,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        autoRaf: true,
      });
      if (document.documentElement.classList.contains('scroll-locked')) lenis.stop();
      lenisInstance.set(lenis);
    };
    const idle = 'requestIdleCallback' in window;
    const id = idle ? window.requestIdleCallback(start, { timeout: smoothScroll.idleTimeout }) : window.setTimeout(start, 1200);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      lenis?.destroy();
      lenisInstance.set(null);
    };
  }, [reduce]);

  useEffect(() => {
    const lenis = lenisInstance.get();
    if (!lenis) return;
    lenis.resize();
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  }, [key]);

  return null;
}
