import { track } from '@vercel/analytics';
import { site } from '../data/site';

export interface Lead {
  name?: string;
  business?: string;
  need?: string;
  budget?: string;
  email: string;
  phone?: string;
  website?: string;
  details?: string;
  /** Which tool or page the lead came from. */
  source: string;
  /** The banner offer they came from, if any. */
  offer?: string;
  /** Extra answers an offer's form asks for, keyed by question. */
  extra?: Record<string, string>;
  /** Honeypot. People never see this field, so anything in it means a bot. */
  honey?: string;
}

export function leadPayload(lead: Lead) {
  const { name, business, need, budget, email, phone, website, details, source, honey, offer, extra } = lead;
  const who = name?.trim() || email;
  return {
    name: who,
    business: business ?? '',
    need: need ?? '',
    budget: budget ?? '',
    email,
    phone: phone ?? '',
    website: website ?? '',
    details: details ?? '',
    source,
    ...(offer ? { offer } : {}),
    ...(extra ?? {}),
    _subject: `New lead from ${who} (${offer ?? source})`,
    _replyto: email,
    _template: 'table',
    _honey: honey ?? '',
  };
}

export async function sendLead(lead: Lead, fetcher: typeof fetch = fetch) {
  const response = await fetcher(site.formEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(leadPayload(lead)),
  });
  const result = (await response.json().catch(() => null)) as { success?: boolean | string } | null;
  if (!response.ok || (result?.success !== undefined && String(result.success) !== 'true')) {
    throw new Error('The form could not be sent');
  }
  track('lead', { source: lead.source });
}

export const contactLink = (params: { need?: string; service?: string; source: string; website?: string }) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) q.set(k, v); });
  return `/contact?${q.toString()}`;
};
