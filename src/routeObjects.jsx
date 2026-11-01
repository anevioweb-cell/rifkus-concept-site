import { routes } from './config/routes.js';
import { RootLayout } from './layouts/RootLayout.jsx';

/**
 * Route objects shared by the browser router (router.jsx) and the build-time
 * prerender (entry-prerender.jsx). English only, mounted at "/".
 */
export const routeObjects = [
  {
    path: '/',
    element: <RootLayout />,
    HydrateFallback: () => null,
    children: routes.map(({ id, path, load, Component, noindex = false, ownSeo = false }) => ({
      ...(path === '' ? { index: true } : { path }),
      handle: { routeId: id, noindex, ownSeo },
      ...(Component ? { Component } : { lazy: async () => ({ Component: (await load()).default }) }),
    })),
  },
];
