import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

/**
 * `vite preview` mirrors Vercel (vercel.json): a prerendered page
 * (dist/<path>/index.html, scripts/prerender.mjs) is served as a file, every
 * other app route gets the empty shell.
 */
const previewRewrites = {
  name: 'rifkus-preview-rewrites',
  configurePreviewServer(server) {
    const dist = path.resolve(server.config.root, server.config.build.outDir);
    server.middlewares.use((req, _res, next) => {
      const [pathname, query = ''] = req.url.split('?');
      const q = query ? `?${query}` : '';
      if (pathname === '/' || /\.[a-z0-9]+$/i.test(pathname)) return next();
      const page = `${pathname.replace(/\/$/, '')}/index.html`;
      req.url = fs.existsSync(path.join(dist, page)) ? `${page}${q}` : `/shell.html${q}`;
      next();
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), previewRewrites],
});
