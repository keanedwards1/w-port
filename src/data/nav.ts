import { services, serviceGroups } from './services';

/** The only source of site links. Header, mobile menu, and footer all read from here. */
export interface NavLink { label: string; to: string }
export interface NavGroup { label: string; links: NavLink[] }
export interface NavItem {
  label: string;
  to?: string;
  /** Paths that mark this item as current. */
  match: string[];
  groups?: NavGroup[];
  footerLink?: NavLink;
  aside?: { title: string; text: string; link: NavLink };
}

const check: NavLink = { label: 'Free Site Check', to: '/check' };
const process: NavLink = { label: 'How a job goes', to: '/process' };
const guides: NavLink = { label: 'Guides', to: '/guides' };
const faq: NavLink = { label: 'FAQ', to: '/faq' };
const about: NavLink = { label: 'About me', to: '/about/me' };
const reviews: NavLink = { label: 'Reviews', to: '/reviews' };
const marin: NavLink = { label: 'Marin County', to: '/marin' };
const nonprofits: NavLink = { label: 'Nonprofits', to: '/nonprofits' };

const serviceLinks = (group: string, full = false): NavLink[] =>
  services.filter((s) => s.group === group).map((s) => ({ label: full ? s.name : s.nav, to: `/services/${s.slug}` }));

export const primaryNav: NavItem[] = [
  {
    label: 'Services', to: '/services', match: ['/services'],
    groups: serviceGroups.map((g) => ({ label: g, links: serviceLinks(g) })),
    footerLink: { label: 'All services', to: '/services' },
    aside: { title: 'Not sure what you need?', text: 'Enter your website and see what a free check turns up.', link: check },
  },
  { label: 'Work', to: '/work', match: ['/work'] },
  { label: 'Pricing', to: '/pricing', match: ['/pricing'] },
  { label: 'Offers', to: '/offers', match: ['/offers'] },
  { label: 'Resources', to: '/resources', match: ['/resources', '/check', '/process', '/guides', '/faq'], groups: [{ label: 'Resources', links: [check, process, guides, faq] }] },
  { label: 'About', to: '/about', match: ['/about', '/reviews', '/marin', '/nonprofits'], groups: [{ label: 'About', links: [about, reviews, marin, nonprofits] }] },
];

export const footerNav: NavGroup[] = [
  { label: 'Services', links: serviceGroups.flatMap((g) => serviceLinks(g)) },
  { label: 'Company', links: [{ label: 'Work', to: '/work' }, reviews, { label: 'About', to: '/about' }, process, marin, nonprofits] },
  { label: 'Resources', links: [{ label: 'Pricing', to: '/pricing' }, { label: 'Offers', to: '/offers' }, check, guides, faq] },
];

export const isCurrent = (match: string[], path: string) =>
  match.some((m) => path === m || path.startsWith(`${m}/`));
