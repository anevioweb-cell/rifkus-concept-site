/**
 * The running Lenis instance, if any (components/SmoothScroll.jsx sets it).
 * Lets other code pause smooth scrolling (useScrollLock) without importing
 * the library. null before it loads, under reduced motion, and on the server.
 */
let instance = null;

export const lenisInstance = {
  get: () => instance,
  set: (lenis) => {
    instance = lenis;
  },
};
