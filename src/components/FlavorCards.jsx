import { FlavorCard } from './FlavorCard.jsx';

/**
 * The reference's project grid with flavor cards: 2 columns from tablet up
 * (gap 16, rows 60 apart), one column on phones. An odd count would leave an
 * empty cell, so the FIRST card then spans both columns with the wide scene
 * (orphan treatment A). With six flavors the count is even,
 * so no card spans. The first card is the new flavor (Mhadjeb), then the hottest
 * flavor shown; Zfiti's and Pizza's scenes have their focal point centered.
 * `headingLevel`: 3 under a section h2 (Home), 2 under the page h1 (/flavors).
 * `priorityFirst`: the first card is the page's LCP image (/flavors).
 */
export function FlavorCards({ flavors, headingLevel = 3, priorityFirst = false, className = '' }) {
  const odd = flavors.length % 2 === 1;
  return (
    <ul className={`grid gap-y-12 tablet:grid-cols-2 tablet:gap-x-4 tablet:gap-y-15 ${className}`}>
      {flavors.map((flavor, i) => (
        <FlavorCard key={flavor.slug} flavor={flavor} step={i} wide={odd && i === 0} headingLevel={headingLevel} priority={priorityFirst && i === 0} />
      ))}
    </ul>
  );
}
