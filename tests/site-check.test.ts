import { describe, expect, it } from 'vitest';
import { dnsFindings, pageFindings, parseDns, parsePage, parseRdap, parseSite, parseSpeed, rdapFindings, rootDomain, speedFindings, summarize } from '../src/lib/site-check';

const dns = (o = {}) => parseDns({ mx: [], txt: [], dmarc: [], dkim: false, www: [], a: [], ns: [], ...o });

describe('parseSite', () => {
  it('accepts plain domains and full URLs', () => {
    expect(parseSite('example.com')).toMatchObject({ url: 'https://example.com/', host: 'example.com', root: 'example.com' });
    expect(parseSite('http://www.Example.com/about')?.host).toBe('example.com');
    expect(parseSite('shop.example.co.uk')?.root).toBe('example.co.uk');
  });
  it('rejects things that are not websites', () => {
    ['', '   ', 'hello', 'not a site.com'].forEach((v) => expect(parseSite(v)).toBeNull());
  });
  it('finds the root domain', () => { expect(rootDomain('a.b.example.org')).toBe('example.org'); });
});

describe('DNS', () => {
  it('reads records and names the providers', () => {
    const r = dns({ mx: ['1 smtp.google.com.'], txt: ['"v=spf1 include:_spf.google.com ~all"'], dmarc: ['"v=DMARC1; p=none"'], dkim: true, www: ['abc.vercel-dns-017.com.'], a: ['76.76.21.21'], ns: ['ns1.x.'] });
    expect(r).toMatchObject({ exists: true, emailProvider: 'Google Workspace', host: 'Vercel', dkim: true });
    expect(r.spf).toContain('spf1');
    expect(dnsFindings(r).filter((f) => f.status === 'fix')).toHaveLength(0);
  });
  it('flags missing SPF and DMARC when email exists', () => {
    const ids = dnsFindings(dns({ mx: ['1 mx.example.'], a: ['1.1.1.1'] })).filter((f) => f.status === 'fix').map((f) => f.id);
    expect(ids).toEqual(['spf', 'dmarc']);
  });
  it('does not call a missing DKIM a failure, since it may use another name', () => {
    expect(dnsFindings(dns({ mx: ['1 mx.example.'] })).find((f) => f.id === 'dkim')?.status).toBe('info');
  });
  it('says so when a domain does not exist', () => {
    expect(dnsFindings(dns())[0].id).toBe('exists');
  });
});

describe('domain record', () => {
  const now = Date.parse('2026-11-06T00:00:00Z');
  it('warns when renewal is close', () => {
    const r = parseRdap({ events: [{ eventAction: 'registration', eventDate: '2000-11-07T00:00:00Z' }, { eventAction: 'expiration', eventDate: '2026-12-11T00:00:00Z' }] });
    expect(r.expires).toContain('2026-12-11');
    const renew = rdapFindings(r, now).find((f) => f.id === 'renew');
    expect(renew?.status).toBe('fix');
    expect(renew?.detail).toContain('35 days');
  });
  it('stays calm when renewal is far off', () => {
    expect(rdapFindings({ registered: null, expires: '2029-01-01T00:00:00Z' }, now)[0].status).toBe('good');
  });
});

describe('page results', () => {
  it('reads Microlink data', () => {
    const p = parsePage({ data: { title: 'T', description: 'D', image: { url: 'i' }, url: 'https://x.com/', screenshot: { url: 's' } } });
    expect(p).toMatchObject({ title: 'T', image: 'i', screenshot: 's' });
  });
  it('flags missing basics', () => {
    const fix = pageFindings(parsePage({ data: { url: 'http://x.com/' } })).filter((f) => f.status === 'fix').map((f) => f.id);
    expect(fix).toEqual(['title', 'desc', 'image', 'https']);
  });
  it('passes a healthy page', () => {
    const list = pageFindings({ title: 'Marin Plumbing and Drain Repair', description: 'Short and clear.', image: 'i', lang: 'en', finalUrl: 'https://x.com/', screenshot: null });
    expect(list.every((f) => f.status === 'good')).toBe(true);
  });
});

describe('speed results', () => {
  it('turns scores into 0 to 100', () => {
    const s = parseSpeed({ lighthouseResult: { categories: { performance: { score: 0.42 }, seo: { score: 1 } }, audits: { 'largest-contentful-paint': { displayValue: '6.1 s' } } } });
    expect(s.scores).toMatchObject({ performance: 42, seo: 100, accessibility: null });
    expect(speedFindings(s)[0]).toMatchObject({ status: 'fix', service: 'website-edits' });
  });
});

it('summarizes findings for the lead email', () => {
  expect(summarize([])).toBe('No results yet.');
  expect(summarize(dnsFindings(dns()))).toContain('[fix]');
});
