import type { PriceId } from './prices';

export interface Service {
  slug: string;
  name: string;
  nav: string;
  group: 'Websites' | 'Getting found' | 'Everything else';
  line: string;
  intro: string;
  does: string[];
  needs: string;
  note?: string;
  priceIds: PriceId[];
  quote: string;
  work: string[];
  image: string;
}

const shot = (n: string) => `/images/projects/${n}.webp`;

export const services: Service[] = [
  {
    slug: 'website-builds', name: 'Website builds', nav: 'Builds', group: 'Websites',
    line: 'A new site, designed and built for your business.',
    intro: 'I design and build the site myself, from a single page up to as many pages as you need. It works on phones, loads quickly, and you can reach me when you want something changed.',
    does: ['Design the pages around what your customers need to find', 'Write or tidy the words from your notes', 'Build the site and connect your domain', 'Add a contact form and test that it reaches you', 'Set up search basics', 'Show you the site before it goes live'],
    needs: 'Your logo if you have one, your photos, and notes on what you do.',
    priceIds: ['one-page', 'five-page', 'extra-page'], quote: 'sarah',
    work: ['geronimo-woodworks', 'golden-island-massage', 'sarah-spector'], image: shot('geronimo-woodworks'),
  },
  {
    slug: 'website-edits', name: 'Website edits', nav: 'Edits', group: 'Websites',
    line: 'Changes to the site you already have.',
    intro: 'New hours, new photos, a page that needs rewriting, a form that stopped working. Send me the list and I make the changes. I work on WordPress, Squarespace, Wix, and custom sites.',
    does: ['Change text, photos, prices, and hours', 'Add or rewrite pages', 'Fix broken links and forms', 'Fix layouts that look wrong on phones', 'Tell you what it will take before I start'],
    needs: 'A login for your site, or an invite. I can walk you through it.',
    priceIds: ['fix-it-hour', 'hourly'], quote: 'megan',
    work: ['aninha-livingstone', 'dark-sky-west-marin', 'dave-and-howie'], image: shot('dave-and-howie'),
  },
  {
    slug: 'website-maintenance', name: 'Website maintenance', nav: 'Maintenance', group: 'Websites',
    line: 'Updates, backups, and someone watching the site.',
    intro: 'Sites break quietly when nobody looks after them. Site Care covers the routine work each month, and 30 minutes of edits is included.',
    does: ['Hosting and SSL', 'Software updates', 'Regular backups', 'Uptime monitoring', '30 minutes of edits each month', 'Month to month, cancel any time'],
    needs: 'Access to your site and hosting.',
    priceIds: ['site-care'], quote: 'wendi-quick',
    work: ['all-star-organics', 'sustainable-marin', 'venturepad'], image: shot('all-star-organics'),
  },
  {
    slug: 'website-hosting', name: 'Website hosting', nav: 'Hosting', group: 'Websites',
    line: 'Move your site, or keep it running for less.',
    intro: 'If I built or moved your site, I can host it. If you are paying a lot for a simple site, I will look at what you have and tell you what moving would cost and save.',
    does: ['Move your site to new hosting', 'Connect your domain', 'Set up SSL', 'Keep the old site running until the new one is ready'],
    needs: 'Your domain login and your current hosting login.',
    note: 'One example: I moved an artist’s portfolio off Squarespace and her running costs went from about $200 a year to $12.',
    priceIds: ['hosting', 'site-care'], quote: 'wendi-platform',
    work: ['sarah-spector', 'sustainable-marin'], image: shot('sustainable-marin'),
  },
  {
    slug: 'google-business-profile', name: 'Google Business Profile and reviews', nav: 'Google Business Profile', group: 'Getting found',
    line: 'To make sure your clients can find you easily.',
    intro: 'Your Google listing is often the first thing people see, and it can show the wrong hours, the wrong category, or old photos. I fix what is wrong and help you handle reviews.',
    does: ['Fix categories, services, hours, and description', 'Add and organize photos', 'Make a review link and QR code you can share', 'Write replies to reviews for you to approve', 'Report reviews that break Google’s policies'],
    needs: 'Access to your Business Profile. I can help you claim it if you do not have that yet.',
    note: 'About removing reviews: Google only removes reviews that break its policies, and Google makes that decision. I can report a review and file the appeal, but I cannot remove it myself. Disagreeing with a review is not enough.',
    priceIds: ['google-profile-fix', 'hourly'], quote: 'michelle',
    work: ['golden-island-massage'], image: shot('golden-island'),
  },
  {
    slug: 'seo', name: 'SEO', nav: 'SEO', group: 'Getting found',
    line: 'The technical work that helps Google read your site.',
    intro: 'SEO means making your site easy for search engines to read and match to what people look for. I do the technical basics. Nobody can control where Google places you, so I stick to the work that is in our hands.',
    does: ['Write page titles and descriptions', 'Clean up headings', 'Create and submit a sitemap', 'Set up Google Search Console', 'Add structured data', 'Fix broken links and missing pages'],
    needs: 'A login for your site, and a list of the services and towns that matter to you.',
    priceIds: ['seo-setup', 'hourly'], quote: 'wendi-quick',
    work: ['golden-island-massage', 'all-star-organics', 'venturepad'], image: shot('venturepad'),
  },
  {
    slug: 'ai-seo', name: 'AI SEO', nav: 'AI SEO', group: 'Getting found',
    line: 'The same idea as SEO, for ChatGPT and Google’s AI answers.',
    intro: 'GEO stands for generative engine optimization. It means making sure tools like ChatGPT and Google’s AI answers can find accurate facts about your business. Google says its AI features need no special tricks, so this is mostly clear information, kept consistent, in places these tools can read.',
    does: ['Check what AI tools currently say about you', 'Make your name, address, phone, and services match everywhere', 'Add plain question-and-answer content to your site', 'Add structured data', 'Make sure search engines are allowed to read your site'],
    needs: 'A login for your site and access to your Google Business Profile.',
    note: 'AI tools decide for themselves what to say. I can give them accurate information to work from, but I can’t control their answers.',
    priceIds: ['ai-search-setup', 'hourly'], quote: 'dave-howie',
    work: ['all-star-organics'], image: shot('plain-terms'),
  },
  {
    slug: 'email-management', name: 'Email management', nav: 'Email management', group: 'Everything else',
    line: 'Business email that works, and newsletters that go out.',
    intro: 'I set up email on your own domain, add the records that help your mail reach the inbox, and can send your newsletters for you.',
    does: ['Set up mailboxes on your domain', 'Add SPF, DKIM, and DMARC records', 'Move old email to a new account', 'Build and send newsletters', 'Manage a shared email system for a group'],
    needs: 'Your domain login and a list of the addresses you want.',
    priceIds: ['email-setup', 'hourly'], quote: 'laura',
    work: ['dark-sky-west-marin', 'all-star-organics'], image: shot('dark-sky'),
  },
  {
    slug: 'small-jobs', name: 'Small jobs', nav: 'Small jobs', group: 'Everything else',
    line: 'The odd web task that does not fit anywhere else.',
    intro: 'If it is small and web related, ask. I charge by the hour and give you an estimate first. If it is not something I can do, I will tell you.',
    does: ['Transfer a domain', 'Set up Google Analytics', 'Add online ticketing or donations', 'Connect a booking tool', 'Update Facebook and Instagram pages', 'Explain what your last web person left behind'],
    needs: 'Just a description of what you need.',
    priceIds: ['hourly', 'fix-it-hour'], quote: 'megan',
    work: ['sustainable-marin', 'painted-bins'], image: shot('painted-bins'),
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const serviceGroups = ['Websites', 'Getting found', 'Everything else'] as const;
