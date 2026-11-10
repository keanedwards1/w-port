import { describe, expect, it } from 'vitest';
import { offers } from '../src/data/offers';
import { priceById, sitePrice } from '../src/data/prices';
import { bannerOffer, daysLeft, isLive, liveOffers } from '../src/lib/offers';

const at = (iso: string) => Date.parse(iso);
const sale = offers.find((o) => o.id === 'google-profile-sale')!;

describe('offers', () => {
  it('stays live through the last day, Pacific time', () => {
    expect(isLive(sale, at('2027-01-01T07:59:00Z'))).toBe(true); // 11:59pm Dec 31 in California
    expect(isLive(sale, at('2027-01-01T08:01:00Z'))).toBe(false);
  });
  it('drops the banner after the end date, and keeps undated offers', () => {
    const later = at('2027-06-01T12:00:00Z');
    expect(bannerOffer(later)).toBeUndefined();
    expect(liveOffers(later).map((o) => o.id)).toEqual(['neighbor-referral', 'nonprofit-rate']);
  });
  it('counts the days left, including today', () => {
    expect(daysLeft(sale, at('2026-12-31T20:00:00Z'))).toBe(1);
    expect(daysLeft(sale, at('2026-12-30T20:00:00Z'))).toBe(2);
    expect(daysLeft(offers[3], at('2026-12-30T20:00:00Z'))).toBeNull();
  });
  it('points every offer at a real price', () => {
    offers.forEach((o) => expect(priceById(o.priceId).amount).toBeGreaterThan(0));
  });
  it('quotes the standing price in sale copy, so prices cannot drift', () => {
    expect(sale.deal).toContain(`$${priceById('google-profile-fix').amount}`);
    expect(sale.salePrice).toBeLessThan(priceById('google-profile-fix').amount as number);
  });
});

describe('site size pricing', () => {
  it('prices each size from the price list', () => {
    expect(sitePrice(1).total).toBe(995);
    expect(sitePrice(2).total).toBe(2900);
    expect(sitePrice(5).total).toBe(2900);
    expect(sitePrice(6).total).toBe(3220);
    expect(sitePrice(10).total).toBe(4500);
    expect(sitePrice(7).label).toBe('Five-Page Site + 2 extra pages');
  });
});
