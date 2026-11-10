import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { footerNav, primaryNav } from '../src/data/nav';
import { services } from '../src/data/services';
import { caseStudies, projects } from '../src/data/projects';
import { guides } from '../src/data/guides';
import { problems } from '../src/data/problems';
import { testimonialById, testimonials } from '../src/data/testimonials';
import { priceById } from '../src/data/prices';

const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? files(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []);

/** Our copy, minus the file of client quotes, which are their words and not our claims. */
const ours = files('src').filter((f) => !f.endsWith('testimonials.ts'));
const banned = [/guarantee/i, /#1\b/, /\b10x\b/i, /skyrocket/i, /dominate/i, /explode/i, /supercharge/i, /game.?chang/i, /world.?class/i, /cutting.?edge/i, /unlock/i, /seamless/i, /—/, /[\u{1F300}-\u{1FAFF}]/u];

describe('copy', () => {
  it.each(ours)('%s has no hype, em dashes, or emoji', (file) => {
    const text = readFileSync(file, 'utf8');
    banned.forEach((re) => expect(text, `${re} in ${file}`).not.toMatch(re));
  });
  it('never mentions the job applications behind the reference letters', () => {
    [...files('src'), 'public/robots.txt'].forEach((f) => expect(readFileSync(f, 'utf8')).not.toMatch(/\bCLAM\b|Communications Associate|Community Land Trust|future digital role/));
  });
  it('does not publish anyone else’s contact details', () => {
    files('src').forEach((f) => expect(readFileSync(f, 'utf8')).not.toMatch(/250-4641|PO Box 201/));
  });
  it('reuses no prices from older sites', () => {
    const data = readFileSync('src/data/prices.ts', 'utf8');
    [/amount: 89\b/, /amount: 450\b/, /amount: 3800\b/, /amount: 1500\b/, /amount: 298\b/].forEach((re) => expect(data).not.toMatch(re));
  });
});

describe('links between data', () => {
  const routes = new Set([
    '/', '/resources', '/about/me', '/services', '/work', '/pricing', '/offers', '/about', '/contact', '/reviews', '/check', '/process', '/faq', '/guides', '/marin', '/nonprofits', '/privacy',
    ...services.map((s) => `/services/${s.slug}`),
  ]);
  it('every nav link goes to a real page', () => {
    const links = [
      ...primaryNav.flatMap((i) => [i.to, i.footerLink?.to, i.aside?.link.to, ...(i.groups?.flatMap((g) => g.links.map((l) => l.to)) ?? [])]),
      ...footerNav.flatMap((g) => g.links.map((l) => l.to)),
    ].filter(Boolean) as string[];
    links.forEach((l) => expect(routes.has(l), l).toBe(true));
  });
  it('lists all nine services in header and footer', () => {
    expect(services).toHaveLength(9);
    expect(footerNav[0].links).toHaveLength(9);
    expect(primaryNav[0].groups?.flatMap((g) => g.links)).toHaveLength(9);
  });
  it('points everything at things that exist', () => {
    services.forEach((s) => {
      expect(testimonialById(s.quote), s.slug).toBeTruthy();
      s.work.forEach((w) => expect(projects.some((p) => p.slug === w), w).toBe(true));
      s.priceIds.forEach((id) => expect(priceById(id)).toBeTruthy());
    });
    problems.forEach((p) => expect(services.some((s) => s.slug === p.service), p.id).toBe(true));
    caseStudies.forEach((c) => { if (c.caseStudy?.quote) expect(testimonialById(c.caseStudy.quote)).toBeTruthy(); });
    guides.forEach((g) => expect(services.some((s) => s.slug === g.service)).toBe(true));
  });
  it('keeps one quote per question', () => {
    expect(new Set(testimonials.map((t) => t.question)).size).toBe(testimonials.length);
  });
});

describe('project counts', () => {
  it('only counts confirmed client work', () => {
    const counted = projects.filter((p) => !p.experiment && !p.unconfirmed).map((p) => p.slug);
    expect(counted).toEqual(expect.arrayContaining(['emily-murotake', 'casa-savasana', 'wm-guillermo', 'island-massage', 'golden-island-massage']));
    expect(counted).not.toContain('plain-terms');
    expect(counted).toHaveLength(20);
  });
});
