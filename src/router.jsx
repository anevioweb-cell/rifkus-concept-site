import { createBrowserRouter, matchRoutes } from 'react-router';
import { routeObjects } from './routeObjects.jsx';

/**
 * Browser router. Route table: config/routes.js; shared objects:
 * routeObjects.jsx. The current route's lazy module is loaded BEFORE the
 * router is created, so a prerendered page (scripts/prerender.mjs) hydrates
 * with its real component instead of the empty HydrateFallback (React
 * Router's documented pattern for lazy routes with prerendered HTML).
 */
export async function createRouter() {
  const lazy = matchRoutes(routeObjects, window.location)?.filter((m) => m.route.lazy) ?? [];
  await Promise.all(
    lazy.map(async (m) => {
      const module = await m.route.lazy();
      Object.assign(m.route, { ...module, lazy: undefined });
    }),
  );
  return createBrowserRouter(routeObjects);
}
