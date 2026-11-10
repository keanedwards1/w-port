import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { App } from './App';
import { SeoProvider, headTags, type SeoData } from './lib/seo';
import { staticPaths } from './routes';
import { site } from './data/site';
import { services } from './data/services';
import { prices, priceLabel, type PriceId } from './data/prices';

export { staticPaths };
export const siteUrl = site.url;

export function render(url: string) {
  const seo: { data: SeoData | null } = { data: null };
  const html = renderToString(
    <SeoProvider value={seo}>
      <StaticRouter location={url}><App /></StaticRouter>
    </SeoProvider>,
  );
  if (!seo.data) throw new Error(`No <Seo> on ${url}`);
  return { html, head: headTags(seo.data).html, noindex: !!seo.data.noindex };
}

/** A plain text summary for tools that read llms.txt. */
export const llmsText = () => [
  `# ${site.name}`, '', `> ${site.description}`, '',
  `Area: ${site.area}. Phone: ${site.phone}. Email: ${site.email}.`, '',
  '## Services', ...services.map((s) => `- [${s.name}](${site.url}/services/${s.slug}): ${s.line}`), '',
  '## Prices', ...prices.map((p) => `- ${p.name}: ${priceLabel(p.id as PriceId)}. ${p.summary}`), '',
  '## More', `- [Work](${site.url}/work)`, `- [Reviews](${site.url}/reviews)`, `- [Offers](${site.url}/offers)`, `- [FAQ](${site.url}/faq)`, `- [Contact](${site.url}/contact)`, '',
].join('\n');
