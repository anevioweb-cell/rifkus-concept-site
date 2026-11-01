import { useLocation } from 'react-router';
import { site } from '../config/site.js';
import { useLocale } from '../hooks/useLocale.js';

/**
 * Per-route <title>, description, canonical, Open Graph and Twitter tags.
 * React 19 hoists these elements into <head>; the prerender moves them into
 * the static HTML of Home. English only (no hreflang alternates).
 * `jsonLd`: optional schema.org object, rendered as an ld+json script.
 * With `site.indexable: false` every page is noindex, nofollow and no JSON-LD
 * is rendered.
 * Pages whose route has `ownSeo` render this component themselves.
 *
 * @param {object} props
 * @param {string} props.routeId i18n group for the default title and description (meta.<routeId>)
 * @param {string} [props.title] page title (before the " | Rifkus" suffix)
 * @param {string} [props.description]
 * @param {string} [props.image] Open Graph image path; [props.imageSize] its [width, height]
 * @param {string} [props.imageAlt]
 * @param {'website' | 'product'} [props.type='website'] Open Graph type
 * @param {boolean} [props.noindex=false] noindex this page even when the site is indexable
 * @param {object} [props.jsonLd] schema.org object (rendered only when the site is indexable)
 */
export function Seo({ routeId, title, description, image = site.ogImage, imageSize = [1200, 630], imageAlt, type = 'website', noindex = false, jsonLd }) {
  const { t } = useLocale();
  const { pathname } = useLocation();

  const pageTitle = title ?? t(`meta.${routeId}.title`);
  const fullTitle = routeId === 'home' ? pageTitle : `${pageTitle} | ${site.brandName}`;
  const baseDesc = description ?? t(`meta.${routeId}.description`);
  const desc = site.showConceptNotice ? `${baseDesc} (${t('site.conceptShort')})` : baseDesc;
  const canonical = `${site.siteUrl}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
  const imageUrl = `${site.siteUrl}${image}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {!site.indexable ? <meta name="robots" content="noindex, nofollow" /> : noindex && <meta name="robots" content="noindex" />}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.brandName} />
      <meta property="og:locale" content={site.ogLocale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={imageSize[0]} />
      <meta property="og:image:height" content={imageSize[1]} />
      <meta property="og:image:alt" content={imageAlt ?? t('site.ogImageAlt')} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={imageUrl} />
      {jsonLd && site.indexable && (
        // Structured data (facts only); JSON.stringify output is escaped for </script>.
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      )}
    </>
  );
}
