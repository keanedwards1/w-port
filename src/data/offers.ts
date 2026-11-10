import { priceById, money, type PriceId } from './prices';

/** Deals on top of the standing prices. Dated offers end on their date, in Pacific time. */
export interface Offer {
  id: string;
  name: string;
  priceId: PriceId;
  /** The sale amount, when the offer changes a price. */
  salePrice?: number;
  deal: string;
  body: string;
  terms: string;
  /** Last valid day, YYYY-MM-DD, Pacific time. Leave off for no end date. */
  endsOn?: string;
  endsLabel?: string;
  banner?: string;
}

const care = priceById('site-care').amount ?? 0;
const fix = priceById('google-profile-fix').amount ?? 0;
const hour = priceById('fix-it-hour').amount ?? 0;

export const offers: Offer[] = [
  {
    id: 'google-profile-sale', name: 'Google Profile Fix', priceId: 'google-profile-fix', salePrice: 99,
    deal: `$99 instead of ${money(fix)}`,
    body: 'I fix the categories, services, hours, description, and photos on your listing, and give you a review link and QR code.',
    terms: 'One location per business.',
    endsOn: '2026-12-31', endsLabel: 'December 31, 2026',
    banner: `Google Profile Fix: $99 instead of ${money(fix)}, through December 31.`,
  },
  {
    id: 'new-site-care', name: 'New Site, Care Included', priceId: 'site-care',
    deal: 'First 3 months of Site Care free',
    body: `Book any new site and I host and look after it for the first 3 months. A ${money(care * 3)} value.`,
    terms: 'Regular price after 3 months. Cancel any time.',
    endsOn: '2027-01-31', endsLabel: 'January 31, 2027',
  },
  {
    id: 'neighbor-referral', name: 'Neighbor Referral', priceId: 'fix-it-hour',
    deal: 'One free Fix-It Hour each',
    body: `Send someone my way. When they book any paid site, you each get a free Fix-It Hour, worth ${money(hour)}.`,
    terms: 'Tell me who sent you when you get in touch.',
  },
  {
    id: 'nonprofit-rate', name: 'Nonprofit Rate', priceId: 'five-page',
    deal: '15% off site builds',
    body: 'For registered nonprofits, on a One-Page Site or a Five-Page Site.',
    terms: 'Registered nonprofits only.',
  },
];
