/**
 * Versions of the Hire me form for each banner offer. Each one changes the opening words,
 * preselects what fits, and asks the one or two extra things that offer needs.
 */
export type OfferKey = 'booking' | 'meet' | 'community';

export interface OfferForm {
  /** Shown in the lead email so Kean knows which offer it came from. */
  label: string;
  title: string;
  sub: string;
  projects?: string[];
  company: string;
  companyRequired?: boolean;
  extra: { key: string; label: string; placeholder?: string; required?: boolean; type?: 'text' | 'area' }[];
}

export const OFFER_FORMS: Record<OfferKey, OfferForm> = {
  booking: {
    label: 'Early 2027 booking',
    title: 'Let’s get your project on the calendar.',
    sub: 'Spots for early 2027 are open. Start with your email.',
    projects: ['Website builds'],
    company: 'Company Name',
    extra: [{ key: 'When would you like to start?', label: 'When would you like to start?', placeholder: 'January, February, as soon as possible' }],
  },
  meet: {
    label: 'Meet in person',
    title: 'Let’s meet in person.',
    sub: 'I can come to your business to talk it through, or to present your project. Start with your email.',
    company: 'Company Name',
    extra: [
      { key: 'Where should we meet?', label: 'Where should we meet?', placeholder: 'Your business address or town', required: true },
      { key: 'Days and times that work', label: 'What days and times work?', placeholder: 'Weekday mornings, Thursday afternoon' },
    ],
  },
  community: {
    label: 'Community rate',
    title: 'Let’s talk about your community rate.',
    sub: 'Tell me about your organization and what it needs. Start with your email.',
    projects: ['Website builds'],
    company: 'Organization Name',
    companyRequired: true,
    extra: [{ key: 'What the organization does', label: 'What does your organization do?', type: 'area' }],
  },
};
