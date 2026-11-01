/**
 * Motion tokens for the `motion` library (CSS twins: theme.css easing and
 * --animate-hero-*, base.css --duration-*). Values are measured on the
 * reference. Use `m.*` components only
 * (LazyMotion strict lives in RootLayout).
 */
export const ease = {
  outSoft: [0.22, 1, 0.36, 1],
  outExpo: [0.16, 1, 0.3, 1], // slide wipe, title mask rise
  snap: [0.44, 0, 0.56, 1], // hero zoom-out
};

export const duration = {
  fast: 0.2,
  hover: 0.3,
  menu: 0.25, // mobile menu overlay fade
  base: 0.45,
  reveal: 0.9,
  rise: 1.0, // title / subtitle mask rise
  wipe: 1.3, // slide change
};

/** Hero slider timing (seconds): progress fills linearly, then the wipe plays. */
export const slider = {
  progress: 3.0,
  wipe: duration.wipe,
  /** Inner image counter-translation as a share of the outer one: the
   *  reference image drifts about 150 px down while it is revealed (900 px
   *  stage), i.e. -(1 + 150/900) = -116.7 %. */
  innerRatio: -1.1667,
};

/**
 * Smooth scrolling (Lenis, components/SmoothScroll.jsx), Lenis defaults: a
 * wheel step closes 10 % of the remaining distance per frame (lerp 0.1,
 * about 1 s to settle 300 px). Wheel only: touch stays native.
 * `idleTimeout`: Lenis loads on the first idle moment after hydration (and
 * hydration itself waits for the hero image), at the latest after this.
 */
export const smoothScroll = {
  lerp: 0.1,
  wheelMultiplier: 1,
  idleTimeout: 2000,
};
