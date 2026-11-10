/** What things always cost. Offers live in offers.ts and point back to these ids. */
export interface Price {
  id: string;
  name: string;
  amount: number | null;
  unit?: '/mo' | '/hr';
  summary: string;
  includes: string[];
  group: 'Websites' | 'Upkeep' | 'Getting found' | 'Email' | 'By the hour';
  service: string;
}

export const prices = [
  {
    id: 'one-page', name: 'One-Page Site', amount: 995, group: 'Websites', service: 'website-builds',
    summary: 'Everything on one page, for a business that needs to be findable and look right.',
    includes: ['One custom page', 'Contact form', 'Works on phones', 'Domain connected', 'Search basics'],
  },
  {
    id: 'five-page', name: 'Five-Page Site', amount: 2900, group: 'Websites', service: 'website-builds',
    summary: 'A full site for a business with more to explain.',
    includes: ['Up to five custom pages', 'Contact form', 'Works on phones', 'Search basics', 'Google Analytics and Search Console'],
  },
  {
    id: 'extra-page', name: 'Extra page', amount: 320, group: 'Websites', service: 'website-builds',
    summary: 'One more page on a Five-Page Site, now or later.',
    includes: ['One new page in the same design'],
  },
  {
    id: 'site-care', name: 'Site Care', amount: 129, unit: '/mo', group: 'Upkeep', service: 'website-maintenance',
    summary: 'I host your site and look after it. Month to month.',
    includes: ['Hosting and SSL', 'Updates', 'Backups', 'Uptime monitoring', '30 minutes of edits each month'],
  },
  {
    id: 'hosting', name: 'Hosting only', amount: 29, unit: '/mo', group: 'Upkeep', service: 'website-hosting',
    summary: 'Hosting for a site I built or moved. No edits or upkeep included.',
    includes: ['Hosting and SSL'],
  },
  {
    id: 'fix-it-hour', name: 'Fix-It Hour', amount: 90, group: 'Upkeep', service: 'website-edits',
    summary: 'One hour of edits or fixes on your site. No contract. Done within 3 business days.',
    includes: ['One hour of work', 'Any platform I can log in to'],
  },
  {
    id: 'google-profile-fix', name: 'Google Profile Fix', amount: 149, group: 'Getting found', service: 'google-business-profile',
    summary: 'One location, cleaned up. Done within 5 business days of getting access.',
    includes: ['Categories', 'Services', 'Hours', 'Description', 'Photos', 'Review link and QR code'],
  },
  {
    id: 'seo-setup', name: 'SEO Setup', amount: 390, group: 'Getting found', service: 'seo',
    summary: 'The technical basics Google reads, on up to 10 pages.',
    includes: ['Titles and descriptions', 'Headings', 'Sitemap', 'Search Console', 'Structured data'],
  },
  {
    id: 'ai-search-setup', name: 'AI SEO Setup', amount: 290, group: 'Getting found', service: 'ai-seo',
    summary: 'Makes your business facts easy for AI tools to read and repeat correctly.',
    includes: ['Structured data', 'Consistent business facts', 'Plain question-and-answer content'],
  },
  {
    id: 'email-setup', name: 'Email Setup', amount: 190, group: 'Email', service: 'email-management',
    summary: 'Up to 5 mailboxes on your domain, with the records that help mail reach the inbox.',
    includes: ['Up to 5 mailboxes', 'SPF', 'DKIM', 'DMARC'],
  },
  {
    id: 'hourly', name: 'Everything else', amount: 90, unit: '/hr', group: 'By the hour', service: 'small-jobs',
    summary: 'Email management, review replies, and small jobs. Estimated before I start.',
    includes: ['You see the estimate first'],
  },
] as const satisfies readonly Price[];

export type PriceId = (typeof prices)[number]['id'];

export const priceById = (id: PriceId): Price => {
  const found = prices.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown price: ${id}`);
  return found;
};

export const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

export const priceLabel = (id: PriceId) => {
  const p = priceById(id);
  return `${money(p.amount ?? 0)}${p.unit ?? ''}`;
};

export const priceGroups = ['Websites', 'Upkeep', 'Getting found', 'Email', 'By the hour'] as const;

/** What a site of a given size costs. Two to five pages fall under the Five-Page Site. */
export function sitePrice(pages: number) {
  const one = priceById('one-page').amount ?? 0;
  const five = priceById('five-page').amount ?? 0;
  const extra = priceById('extra-page').amount ?? 0;
  if (pages <= 1) return { total: one, label: 'One-Page Site' };
  if (pages <= 5) return { total: five, label: 'Five-Page Site' };
  const extras = pages - 5;
  return { total: five + extras * extra, label: `Five-Page Site + ${extras} extra ${extras === 1 ? 'page' : 'pages'}` };
}
