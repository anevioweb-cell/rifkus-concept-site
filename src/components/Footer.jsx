import { Link } from 'react-router';
import { legalNav, primaryNav } from '../config/navigation.js';
import { enabledSocial, site } from '../config/site.js';
import { useLocale } from '../hooks/useLocale.js';
import { Ar } from './Ar.jsx';
import { Wordmark } from './Wordmark.jsx';
import { NewsletterForm } from './NewsletterForm.jsx';

const label = 'text-micro font-medium text-smoke uppercase';
const smallLink =
  'inline-flex min-h-11 min-w-11 items-center text-ui font-semibold uppercase underline-offset-4 transition-colors duration-(--duration-link) ease-link hover:underline';

/** The confirmed social links (site.social, enabled only). */
function SocialLinks({ t }) {
  return (
    <ul className="mt-3 flex flex-col">
      {enabledSocial.map((s) => (
        <li key={s.id}>
          <a href={s.href} target="_blank" rel="noreferrer" className={smallLink}>
            {s.network} {s.handle}
            <span className="sr-only"> {t('a11y.externalLink')}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Footer, on every page (Home included).
 * Top: big wordmark + the official slogan as an Arabic accent (end).
 * Main: dotted rule, demo newsletter, NAVIGATION / LEGAL / CONTACT (the
 * confirmed Instagram and TikTok links; with site.showPlaceholders: SOCIALS +
 * a CONTACT column with the placeholder email and address).
 * Bottom: rights, concept line, back to top.
 */
export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="px-gutter">
      <div className="flex flex-col gap-6 pt-8 pb-8 tablet:flex-row tablet:items-end tablet:justify-between tablet:pb-8">
        <Wordmark className="text-page tablet:text-page-lg" />
        <p className="text-slogan tablet:text-end tablet:text-slogan-lg">
          <Ar className="[--ar-scale:1]">{site.sloganAr}</Ar>
          <span className="sr-only"> ({t('footer.sloganLabel')})</span>
        </p>
      </div>

      <div className="grid gap-12 rule-dotted pt-15 pb-15 tablet:gap-17.5 desktop:grid-cols-[23rem_1fr]">
        <div className="desktop:max-w-92">
          <h2 className="text-slogan tablet:text-slogan-lg">{t('footer.newsTitle')}</h2>
          <p className="mt-6 max-w-[23.125rem] text-body text-smoke">{t('footer.newsBody')}</p>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 tablet:grid-cols-4 tablet:gap-x-17.5">
          <section aria-labelledby="footer-nav">
            <h2 id="footer-nav" className={label}>
              {t('footer.navigation')}
            </h2>
            <ul className="mt-3 flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.key}>
                  <Link to={item.path} className="inline-flex min-h-11 items-center text-body underline-offset-4 hover:underline">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="footer-legal">
            <h2 id="footer-legal" className={label}>
              {t('footer.legal')}
            </h2>
            <ul className="mt-3 flex flex-col">
              {legalNav.map((item) => (
                <li key={item.key}>
                  <Link to={item.path} className={smallLink}>
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          {site.showPlaceholders && (
            <section aria-labelledby="footer-socials">
              <h2 id="footer-socials" className={label}>
                {t('footer.socials')}
              </h2>
              <SocialLinks t={t} />
            </section>
          )}
          <section aria-labelledby="footer-contact">
            <h2 id="footer-contact" className={label}>
              {t('footer.contact')}
            </h2>
            {site.showPlaceholders ? (
              <>
                <p className="mt-3 text-body">{site.brandName}</p>
                <p className="mt-1 text-ui font-semibold break-words text-smoke uppercase">
                  {site.contact.email}
                  <br />
                  {site.contact.address}
                </p>
              </>
            ) : (
              // Only confirmed channels (owner decision): the brand's Instagram and the founder's TikTok.
              <SocialLinks t={t} />
            )}
          </section>
        </div>
      </div>

      <div className="flex flex-col gap-3 rule-dotted pt-5 pb-[calc(1.25rem+var(--safe-bottom))] tablet:flex-row tablet:items-center tablet:justify-between">
        <p className="text-ui font-semibold text-smoke uppercase">{t('footer.rights', { year: site.copyrightYear })}</p>
        {site.showConceptNotice && (
          <Link to="/legal-notice" className={smallLink}>
            {t('footer.notAffiliated')}
          </Link>
        )}
        <a href="#main" className={smallLink}>
          {t('footer.backToTop')} <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
