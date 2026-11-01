import { useHydrated } from '../hooks/useHydrated.js';

/**
 * Below-the-fold image that never competes with the hero's LCP image.
 * The prerendered HTML carries it inside <noscript> (so it still shows
 * without JavaScript); with JavaScript the real <img> mounts after
 * hydration, which itself waits until the hero image has painted
 * (scripts/prerender.mjs). Chrome's native lazy loading alone fetches images
 * up to ~2500 px below the viewport on slow connections, which slowed the
 * mobile LCP. The parent box must reserve the space (aspect ratio or
 * width/height), so nothing shifts when it appears.
 * `sources`: optional [{ media?, type?, srcSet, sizes }] → a <picture> (art
 * direction and the AVIF twins, lib/imageSources.js).
 *
 * @param {object} props every other prop is passed to the <img> (src, srcSet, sizes, width, height, alt, className)
 * @param {{ media?: string, type?: string, srcSet: string, sizes?: string }[]} [props.sources]
 */
export function DeferredImg({ sources, ...props }) {
  const hydrated = useHydrated();
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is always passed by callers
  const img = <img loading="lazy" decoding="async" {...props} />;
  const media = sources?.length ? (
    <picture>
      {sources.map((s) => (
        <source key={`${s.media}-${s.type}`} media={s.media} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
      ))}
      {img}
    </picture>
  ) : (
    img
  );
  return hydrated ? media : <noscript>{media}</noscript>;
}
