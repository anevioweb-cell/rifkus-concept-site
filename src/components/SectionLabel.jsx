import { Reveal } from './Reveal.jsx';

/**
 * The reference's gray section label ("SELECTED PROJECTS" style):
 * 48 px / 500 / −0.04em, gray, centered, uppercase; 32 px at tablet width,
 * 28 px on phones. Box 133 px tall on desktop (115 at tablet, 74 on phones),
 * like the measured "Title". `as="h1"` where it is the page title (the
 * reference's Projects page uses it as its h1). `tone`: 'gray' (reference,
 * 5.84:1 on ink) or 'ink' (navy on a yellow band, 9.45:1).
 */
const tones = { gray: 'text-smoke', ink: 'text-brand-ink' };

export function SectionLabel({ id, as = 'h2', tone = 'gray', children }) {
  return (
    <Reveal
      as={as}
      kind="line"
      id={id}
      className={`py-5 text-center text-section font-medium uppercase ${tones[tone]} tablet:py-10 tablet:text-section-md desktop:text-section-lg`}
    >
      {children}
    </Reveal>
  );
}
