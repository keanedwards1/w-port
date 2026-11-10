import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { site } from '../data/site';

export interface SeoData {
  title: string;
  description: string;
  path: string;
  /** Extra JSON-LD objects for this page. */
  jsonLd?: object[];
  noindex?: boolean;
  type?: 'website' | 'article';
  /** The main image, loaded early. */
  preload?: string;
  preloadSet?: string;
  preloadSizes?: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const business = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#business`,
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: '+1-415-930-2468',
  email: site.email,
  image: `${site.url}/images/kean/hero.webp`,
  address: { '@type': 'PostalAddress', addressLocality: 'Lagunitas', addressRegion: 'CA', addressCountry: 'US' },
  areaServed: [{ '@type': 'AdministrativeArea', name: 'Marin County, California' }, { '@type': 'Country', name: 'United States' }],
};

export function headTags(d: SeoData) {
  const url = `${site.url}${d.path === '/' ? '' : d.path}`;
  const full = d.path === '/' ? d.title : `${d.title} | ${site.name}`;
  const json = [business, ...(d.jsonLd ?? [])].map((o) => JSON.stringify(o).replace(/</g, '\\u003c'));
  const tags = [
    `<meta data-seo name="description" content="${esc(d.description)}">`,
    `<link data-seo rel="canonical" href="${esc(url)}">`,
    d.noindex ? '<meta data-seo name="robots" content="noindex">' : '',
    d.preload ? `<link data-seo rel="preload" as="image" href="${d.preload}" imagesrcset="${d.preloadSet ?? ''}" imagesizes="${d.preloadSizes ?? ''}" fetchpriority="high">` : '',
    `<meta data-seo property="og:title" content="${esc(full)}">`,
    `<meta data-seo property="og:description" content="${esc(d.description)}">`,
    `<meta data-seo property="og:url" content="${esc(url)}">`,
    `<meta data-seo property="og:type" content="${d.type ?? 'website'}">`,
    `<meta data-seo property="og:image" content="${site.url}/og.png">`,
    '<meta data-seo name="twitter:card" content="summary_large_image">',
    ...json.map((j) => `<script data-seo type="application/ld+json">${j}</script>`),
  ].filter(Boolean).join('\n    ');
  return { full, tags, html: `<title>${esc(full)}</title>\n    ${tags}` };
}

const Ctx = createContext<{ data: SeoData | null } | null>(null);

export const SeoProvider = ({ value, children }: { value: { data: SeoData | null } | null; children: ReactNode }) =>
  <Ctx.Provider value={value}>{children}</Ctx.Provider>;

export function Seo(props: SeoData) {
  const ctx = useContext(Ctx);
  if (ctx) ctx.data = props; // Prerender: hand the tags to the build script.
  useEffect(() => {
    const { full, tags } = headTags(props);
    document.title = full;
    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
    document.head.insertAdjacentHTML('beforeend', tags);
  }, [props.path, props.title]);
  return null;
}

export const crumbs = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${site.url}${c.path}` })),
});
