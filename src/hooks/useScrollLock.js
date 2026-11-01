import { useEffect } from 'react';
import { lenisInstance } from '../lib/lenisInstance.js';

/**
 * Locks page scroll while `locked` by toggling a class on <html> (base.css),
 * and pauses Lenis smooth scrolling (components/SmoothScroll.jsx) meanwhile.
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const root = document.documentElement;
    root.classList.add('scroll-locked');
    lenisInstance.get()?.stop();
    return () => {
      root.classList.remove('scroll-locked');
      lenisInstance.get()?.start();
    };
  }, [locked]);
}
