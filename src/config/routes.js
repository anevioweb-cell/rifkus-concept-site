import HomePage from '../pages/HomePage.jsx';

/**
 * Route table. `id` is also the i18n key for per-route meta
 * (meta.<id>.title / meta.<id>.description) and drives the sitemap
 * (scripts/prerender.mjs). Home is EAGER (`Component`): it is prerendered
 * at build time, so the client must render it synchronously (no lazy round
 * trip over the prerendered markup). Every other page is code-split.
 * `sitemap: false` keeps a route out of sitemap.xml. `ownSeo: true`: the page
 * renders its own <Seo> (per-item title, description, image, JSON-LD).
 */
export const routes = [
  { id: 'home', path: '', Component: HomePage },
  { id: 'flavors', path: 'flavors', load: () => import('../pages/FlavorsPage.jsx') },
  { id: 'flavor', path: 'flavors/:slug', sitemap: false, ownSeo: true, load: () => import('../pages/FlavorDetailPage.jsx') },
  { id: 'story', path: 'our-story', load: () => import('../pages/StoryPage.jsx') },
  { id: 'distributors', path: 'distributors', load: () => import('../pages/DistributorsPage.jsx') },
  { id: 'privacy', path: 'privacy', load: () => import('../pages/PrivacyPage.jsx') },
  { id: 'terms', path: 'terms', load: () => import('../pages/TermsPage.jsx') },
  { id: 'credits', path: 'credits', load: () => import('../pages/CreditsPage.jsx') },
  { id: 'legal', path: 'legal-notice', load: () => import('../pages/LegalNoticePage.jsx') },
  { id: 'notFound', path: '*', noindex: true, sitemap: false, load: () => import('../pages/NotFoundPage.jsx') },
];
