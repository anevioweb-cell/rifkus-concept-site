import { enabledSocial } from '../config/site.js';
import { useLocale } from '../hooks/useLocale.js';

/** One credits row: 10 px label, then 16 px lines (reference legal/body style). */
function Row({ label, children }) {
  return (
    <div className="grid gap-3 rule-dotted py-8 tablet:grid-cols-[18rem_1fr] tablet:gap-10">
      <h2 className="text-micro font-medium text-smoke uppercase">{label}</h2>
      <div className="flex max-w-[45rem] flex-col gap-3 text-body text-ash">{children}</div>
    </div>
  );
}

/**
 * /credits: the unofficial-concept notice, fonts and their licenses, the
 * AI-generated backgrounds, the third-party photos actually used
 * (CREDITS.md), a privacy note (verified on the production build
 * with a Playwright network check: same-origin GETs only, no cookies, no
 * local storage, forms send nothing) and the confirmed social links only.
 */
export default function CreditsPage() {
  const { t } = useLocale();
  return (
    <section aria-labelledby="credits-title" className="px-gutter pt-30 pb-30 tablet:pt-50">
      <h1 id="credits-title" className="text-page font-semibold tablet:text-page-md desktop:text-page-lg">
        {t('credits.title')}
      </h1>
      <p className="mt-6 max-w-200 text-lead text-white tablet:text-lead-lg">{t('credits.notice')}</p>
      <div className="mt-16">
        <Row label={t('credits.ownersLabel')}>
          <p>{t('credits.owners')}</p>
        </Row>
        <Row label={t('credits.fontsLabel')}>
          <p>{t('credits.fontJakarta')}</p>
          <p>{t('credits.fontBaloo')}</p>
        </Row>
        <Row label={t('credits.aiLabel')}>
          <p>{t('credits.ai')}</p>
        </Row>
        <Row label={t('credits.photosLabel')}>
          <p>{t('credits.photoRetail')}</p>
          <p>{t('credits.photoZfiti')}</p>
          <p>{t('credits.photoShop')}</p>
        </Row>
        <Row label={t('credits.codeLabel')}>
          <p>{t('credits.code')}</p>
        </Row>
        <Row label={t('credits.privacyLabel')}>
          <p>{t('credits.privacy1')}</p>
          <p>{t('credits.privacy2')}</p>
          <p>{t('credits.privacy3')}</p>
          <p>{t('credits.privacy4')}</p>
        </Row>
        <Row label={t('credits.contactLabel')}>
          <p>{t('credits.contact')}</p>
          <ul className="flex flex-col">
            {enabledSocial.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-ui font-semibold text-white uppercase underline-offset-4 hover:underline"
                >
                  {s.network} {s.handle}
                  <span className="sr-only"> {t('a11y.externalLink')}</span>
                </a>
              </li>
            ))}
          </ul>
        </Row>
      </div>
    </section>
  );
}
