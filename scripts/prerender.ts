// Writes real HTML for every route, so search engines and AI tools can read the site without running JavaScript.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist/client');
const template = await readFile(join(dist, 'index.html'), 'utf8');
const server = await import(pathToFileURL(resolve('dist/server/entry-server.js')).href);

const page = (route: string) => {
  const { html, head } = server.render(route);
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
};

const today = new Date().toISOString().slice(0, 10);
const paths: string[] = server.staticPaths();
for (const route of paths) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  await mkdir(dirname(join(dist, file)), { recursive: true });
  await writeFile(join(dist, file), page(route));
}
await writeFile(join(dist, '404.html'), page('/__not-found__'));

const listed = paths.filter((p) => p !== '/thanks');
const urls = listed.map((p) => `  <url><loc>${server.siteUrl}${p === '/' ? '' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n');
await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
await writeFile(join(dist, 'robots.txt'), `${robots.trim()}\n\nSitemap: ${server.siteUrl}/sitemap.xml\n`);
await writeFile(join(dist, 'llms.txt'), server.llmsText());
console.log(`Prerendered ${paths.length} pages plus 404, sitemap, robots, llms.txt`);
