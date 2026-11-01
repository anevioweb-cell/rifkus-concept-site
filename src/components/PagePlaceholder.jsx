import { site } from '../config/site.js';
import { useLocale } from '../hooks/useLocale.js';

/**
 * Simple page body (legal pages): a 132 px page title and one line. SEO comes from the route handle.
 */
export function PagePlaceholder({ pageKey, phase, children }) {
  const { t } = useLocale();
  return (
    <section className="px-gutter pt-[calc(var(--nav-height)+5rem)] pb-30 tablet:pt-[calc(var(--nav-height)+8.75rem)]">
      <h1 className="text-page font-semibold tablet:text-page-lg">{t(`pages.${pageKey}.title`)}</h1>
      <p className="mt-5 max-w-prose text-body text-mist">{t(`pages.${pageKey}.body`)}</p>
      {phase && site.showPlaceholders && <p className="mt-3 text-micro font-medium text-smoke uppercase">{t('placeholder.comingIn', { phase })}</p>}
      {children}
    </section>
  );
}
