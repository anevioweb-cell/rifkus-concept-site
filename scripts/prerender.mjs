/**
 * After `vite build`:
 *   dist/index.html  → "/" with the full Home markup (English)
 *   dist/flavors/index.html, dist/flavors/<slug>/index.html → the Flavors
 *                      page and the six flavor pages, prerendered the same way
 *   dist/shell.html  → empty app shell for every other route (SPA fallback)
 *   dist/robots.txt  → follows site.indexable (disallow all when false)
 *   dist/sitemap.xml → only when site.indexable: every indexable static route (config/routes.js) and
 *                      every flavor page (data/flavors.js)
 * Head tags rendered by <Seo> (title, description, canonical, hreflang, OG,
 * Twitter) are moved into <head>. The browser then renders over the
 * markup with hydrateRoot (same DOM, so the prerendered LCP image is kept).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const { render, prerenderPaths, sitemapPaths, siteUrl, indexable } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-prerender.js')).href);

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
await fs.writeFile(path.join(dist, 'shell.html'), template);

const HEAD_TAG = /<title>[\s\S]*?<\/title>|<meta\s[^>]*?\/?>|<link\s[^>]*?rel="(?:canonical|alternate|preload)"[^>]*?\/?>/g;
// Scripts in the markup are dropped, except structured data (ld+json), which
// stays in the HTML for crawlers and matches what React hydrates.
const SCRIPT = /<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g;
// Safety net: a host may serve this file for another path (SPA fallback), and
// a query (e.g. /flavors?filter=hot) changes the markup. In both cases the
// prerendered markup is dropped and the app renders from scratch.
const guard = (url) =>
  `<script>(function(){var p=location.pathname.replace(/\\/$/,"")||"/";if(p!==${JSON.stringify(url)}||location.search){var r=document.getElementById("root");if(r)r.innerHTML="";}})();</script>`;

/**
 * On prerendered pages the hero is already in the HTML, so the app bundle is
 * not needed for the first paint. Start loading it right after the hero
 * image (the Zfiti tile) has been painted (or after 3 s at the latest): the bag, CSS and fonts get
 * the bandwidth first, then the page hydrates.
 */
const MODULE_SCRIPT = /<script type="module" crossorigin src="([^"]+)"><\/script>/;
const deferredLoader = (src) =>
  `<script type="module">` +
  `const load=()=>import(${JSON.stringify(src)});let done=false;const go=()=>{if(done)return;done=true;requestAnimationFrame(()=>setTimeout(load,0));};` +
  `const img=document.querySelector('#root img[fetchpriority=high]');` +
  `if(!img||img.complete)go();else{img.addEventListener('load',go,{once:true});img.addEventListener('error',go,{once:true});}setTimeout(go,3000);` +
  `</script>`;

const pages = prerenderPaths.map((url) => ({ url, out: url === '/' ? 'index.html' : `${url.slice(1)}/index.html` }));

for (const page of pages) {
  const markup = await render(page.url);
  // Mark moved tags so main.jsx can drop them before React renders its own.
  const head = (markup.match(HEAD_TAG) ?? []).map((tag) => tag.replace(/^<(\w+)/, '<$1 data-prerendered=""'));
  const body = markup.replace(HEAD_TAG, '').replace(SCRIPT, '');
  let html = template
    .replace(/\s*<title[^>]*>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta data-prerendered name="description"[^>]*>/, '')
    .replace('</head>', `    ${head.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>${guard(page.url)}`);
  const entry = html.match(MODULE_SCRIPT);
  if (!entry) throw new Error('Module entry script not found in index.html');
  html = html.replace(MODULE_SCRIPT, '').replace('</body>', `  ${deferredLoader(entry[1])}\n  </body>`);
  // Vite preloads the entry's shared chunks; on a prerendered page that would
  // fetch app JS during the first paint and compete with the hero image. The
  // deferred loader imports the entry later and the chunks follow it.
  html = html.replace(/\s*<link rel="modulepreload"[^>]*>/g, '');
  const file = path.join(dist, page.out);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
  console.log(`prerendered ${page.url} → dist/${page.out} (${(html.length / 1024).toFixed(1)} KB, ${head.length} head tags)`);
}
// robots.txt and sitemap.xml follow site.indexable (src/config/site.js).
if (indexable) {
  const today = new Date().toISOString().slice(0, 10);
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemapPaths.map((p) => `  <url><loc>${siteUrl}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    '\n</urlset>\n';
  await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap);
  await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`sitemap.xml: ${sitemapPaths.length} URLs; robots.txt allows indexing`);
} else {
  await fs.writeFile(
    path.join(dist, 'robots.txt'),
    '# Unofficial concept site: not for search engines (site.indexable = false).\nUser-agent: *\nDisallow: /\n',
  );
  console.log(`robots.txt: disallow all (site.indexable = false); sitemap.xml not written (${sitemapPaths.length} URLs would be listed)`);
}
await fs.rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
