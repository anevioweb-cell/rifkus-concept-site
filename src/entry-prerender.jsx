/**
 * Build-time prerender entry (Node, `vite build --ssr`). Renders a route to
 * static HTML with React Router's static handler. Used by
 * scripts/prerender.mjs for the `prerenderPaths` so the first view (LCP)
 * paints with the HTML response; the client hydrates it. Also exports the
 * sitemap paths.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouterProvider, createStaticHandler, createStaticRouter } from 'react-router';
import { routeObjects } from './routeObjects.jsx';
import { routes } from './config/routes.js';
import { flavors } from './data/flavors.js';
import { site } from './config/site.js';

export const siteUrl = site.siteUrl;
export const indexable = site.indexable;
/** Routes prerendered to static HTML (and hydrated): Home, /flavors and every flavor page. */
export const prerenderPaths = ['/', '/flavors', ...flavors.map((f) => `/flavors/${f.slug}`), '/our-story', '/distributors', '/credits'];

export const sitemapPaths = [...routes.filter((r) => r.sitemap !== false && !r.noindex).map((r) => `/${r.path}`), ...flavors.map((f) => `/flavors/${f.slug}`)];

export async function render(url) {
  const handler = createStaticHandler(routeObjects);
  const context = await handler.query(new Request(`http://localhost${url}`));
  if (context instanceof Response) throw new Error(`Unexpected response for ${url}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  );
}
