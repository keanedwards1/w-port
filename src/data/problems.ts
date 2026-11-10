import type { PriceId } from './prices';

/** Plain problems for the "What's wrong?" picker. */
export interface Problem {
  id: string;
  label: string;
  fix: string;
  priceId: PriceId;
  service: string;
}

export const problems: Problem[] = [
  { id: 'google-info', label: 'My hours or phone number are wrong on Google', fix: 'I correct your listing and fill in everything else that is missing, for one location.', priceId: 'google-profile-fix', service: 'google-business-profile' },
  { id: 'bad-review', label: 'There’s a bad or fake review on my listing', fix: 'I report reviews that break Google’s policies and write replies for the rest. Google decides what comes down.', priceId: 'hourly', service: 'google-business-profile' },
  { id: 'phone-layout', label: 'My site looks bad on phones', fix: 'I look at what is wrong, tell you how long it will take, and fix the layout.', priceId: 'fix-it-hour', service: 'website-edits' },
  { id: 'cant-edit', label: 'I need something changed and can’t do it', fix: 'Send me the list. A Fix-It Hour is done within 3 business days.', priceId: 'fix-it-hour', service: 'website-edits' },
  { id: 'site-down', label: 'My site is down or broken', fix: 'Call or text me. I find what broke and fix it, and tell you the cost before I start on anything big.', priceId: 'fix-it-hour', service: 'website-maintenance' },
  { id: 'no-site', label: 'I don’t have a website yet', fix: 'A single page with your services, your contact details, and a form. It can grow later.', priceId: 'one-page', service: 'website-builds' },
  { id: 'old-site', label: 'My site is old and I want a new one', fix: 'A new site with up to five pages, built around what your customers look for.', priceId: 'five-page', service: 'website-builds' },
  { id: 'overpaying', label: 'I’m paying too much for my website', fix: 'I look at your bills and tell you what moving would cost and save.', priceId: 'hosting', service: 'website-hosting' },
  { id: 'spam', label: 'My emails land in spam', fix: 'I check and add the records that tell other mail servers your email is really from you.', priceId: 'email-setup', service: 'email-management' },
  { id: 'not-found', label: 'I don’t show up when people search', fix: 'I set up the technical basics Google reads and connect Search Console so you can see what is happening.', priceId: 'seo-setup', service: 'seo' },
  { id: 'ai-wrong', label: 'ChatGPT gets my business wrong', fix: 'I make your business facts clear and consistent across the places these tools read.', priceId: 'ai-search-setup', service: 'ai-seo' },
];
