import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { createRouter } from './router.jsx';
import './index.css';

// Prerendered pages (scripts/prerender.mjs) ship SEO tags in <head>; React's
// <Seo> renders its own copies, so drop the static ones to avoid duplicates.
document.head.querySelectorAll('[data-prerendered]').forEach((el) => el.remove());

const container = document.getElementById('root');
const app = (router) => (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// Prerendered routes are hydrated so the existing DOM (and the LCP image) is
// kept; every other route (or a prerendered one opened with a query) starts empty.
const router = await createRouter();
if (container.hasChildNodes()) hydrateRoot(container, app(router));
else createRoot(container).render(app(router));
