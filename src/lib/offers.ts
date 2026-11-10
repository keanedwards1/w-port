import { offers, type Offer } from '../data/offers';

const DAY = 86_400_000;
const pacificDay = (now: number) => new Date(now).toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });

export const isLive = (offer: Offer, now: number) => !offer.endsOn || pacificDay(now) <= offer.endsOn;

export const liveOffers = (now: number) => offers.filter((o) => isLive(o, now));

export const bannerOffer = (now: number) => liveOffers(now).find((o) => o.banner);

export const hasDatedOffer = (now: number) => liveOffers(now).some((o) => o.endsOn);

/** Whole days left, counting today. Null when the offer has no end date. */
export function daysLeft(offer: Offer, now: number) {
  if (!offer.endsOn) return null;
  const today = Date.parse(`${pacificDay(now)}T00:00:00Z`);
  const end = Date.parse(`${offer.endsOn}T00:00:00Z`);
  return Math.max(0, Math.round((end - today) / DAY) + 1);
}
