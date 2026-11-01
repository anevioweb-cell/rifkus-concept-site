import { Link } from 'react-router';
import { site } from '../config/site.js';
import { useLocale } from '../hooks/useLocale.js';

/**
 * Discreet 'Unofficial concept' pill, fixed at the bottom end of every page
 * (the slot of the reference's builder badge: 20 px from the edges, white,
 * radius 10). Links to the legal notice. Controlled by site.showConceptBadge
 * (off since 2026-10-21, owner decision).
 */
export function ConceptBadge({ className = '' }) {
  const { t } = useLocale();
  if (!site.showConceptBadge) return null;
  return (
    <aside aria-label={t('site.conceptBadge')}>
      <Link
        to="/legal-notice"
        data-surface="light"
        className={`fixed end-5 bottom-5 z-30 inline-flex min-h-11 items-center rounded-badge bg-white px-3.5 text-ui font-semibold text-ink shadow-pop ${className}`}
      >
        {t('site.conceptBadge')}
      </Link>
    </aside>
  );
}
