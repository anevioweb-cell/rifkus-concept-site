import { useEffect, useRef } from 'react';

/**
 * Scroll reveal that only ENHANCES.
 *
 * The prerendered HTML shows the element. After hydration, and only if the
 * element is still below the viewport and motion is allowed, it is set to
 * its start state (data-reveal="pending") and revealed once it enters
 * (data-reveal="in"). No JS, slow JS or reduced motion: always visible.
 *
 * kind (styles/reveal.css):
 *   'card'      y 70 → 0 + fade, 1.2 s ease-out-expo   (reference cards)
 *   'image'     y 60 → 0 + fade, 1.0 s ease-out-expo   (reference galleries)
 *   'line'      y 60 → 0 + fade, 1.0 s ease-out-expo   (reference headlines;
 *               whole lines, never split letters: Arabic must stay joined)
 *   'statement' blur 10 px → 0, y 24 → 0 + fade, 1.0 s ease-out (About)
 * step: delay in 0.2 s steps (0–5), like the reference's index × 0.2 s.
 *
 * @param {object} props
 * @param {string} [props.as='div'] element to render
 * @param {'card' | 'image' | 'line' | 'statement'} [props.kind='image']
 * @param {number} [props.step=0] delay step (× 0.2 s)
 */
export function Reveal({ as: Tag = 'div', kind = 'image', step = 0, className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined; // already seen: never hide
    el.dataset.reveal = 'pending';
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = 'in';
        io.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal reveal-${kind} reveal-step-${Math.min(5, Math.max(0, step))} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
