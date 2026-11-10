/**
 * The Site Check runs entirely in the visitor's browser, with no server.
 *  - Google public DNS: email records and hosting clues. No key.
 *  - RDAP: domain age and renewal date. No key.
 *  - Microlink: page title, description, and a phone screenshot. No key, a few a day per visitor.
 *  - Google PageSpeed: scores. Keyless quota is shared and often empty, so VITE_PSI_API_KEY turns it on.
 * Each source fails on its own without affecting the others.
 */
export type Status = 'good' | 'fix' | 'info';
export type Area = 'Search basics' | 'Email' | 'Domain and hosting' | 'Speed';

export interface Finding { id: string; area: Area; status: Status; title: string; detail: string; service?: string }

export interface DnsResult { exists: boolean; mx: string[]; spf: string | null; dmarc: string | null; dkim: boolean; host: string | null; emailProvider: string | null }
export interface RdapResult { registered: string | null; expires: string | null }
export interface PageResult { title: string | null; description: string | null; image: string | null; lang: string | null; finalUrl: string | null; screenshot: string | null }
export interface SpeedResult {
  scores: { performance: number | null; accessibility: number | null; bestPractices: number | null; seo: number | null };
  lcp: string | null; cls: string | null; fieldSpeed: string | null;
}

export function parseSite(input: string) {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!url.hostname.includes('.') || /\s/.test(raw)) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    return { url: url.href, host, root: rootDomain(host) };
  } catch {
    return null;
  }
}

const TWO_PART = /\.(co|com|org|net|gov|ac)\.[a-z]{2}$/;
export function rootDomain(host: string) {
  const parts = host.split('.');
  return parts.slice(TWO_PART.test(host) ? -3 : -2).join('.');
}

const cleanTxt = (s: string) => s.replace(/^"|"$/g, '').replace(/"\s*"/g, '');

const HOSTS: [RegExp, string][] = [
  [/vercel-dns|vercel\.app/, 'Vercel'], [/squarespace|^198\.185\.159\.|^198\.49\.23\./, 'Squarespace'],
  [/wixdns|wixsite|^185\.230\.63\./, 'Wix'], [/shopify/, 'Shopify'], [/netlify/, 'Netlify'],
  [/webflow/, 'Webflow'], [/wordpress\.com|wpengine|wpenginepowered/, 'WordPress hosting'],
  [/bluehost/, 'Bluehost'], [/godaddy|secureserver|domaincontrol/, 'GoDaddy'], [/^76\.76\.21\./, 'Vercel'], [/github\.io/, 'GitHub Pages'],
];
const MAIL: [RegExp, string][] = [
  [/google|gmail/, 'Google Workspace'], [/outlook|protection\.office|microsoft/, 'Microsoft 365'],
  [/zoho/, 'Zoho'], [/secureserver/, 'GoDaddy'], [/protonmail|proton\.me/, 'Proton'],
  [/icloud/, 'iCloud'], [/mailgun/, 'Mailgun'], [/sendgrid/, 'SendGrid'], [/fastmail|messagingengine/, 'Fastmail'],
];
const match = (table: [RegExp, string][], values: string[]) => {
  for (const v of values) for (const [re, name] of table) if (re.test(v.toLowerCase())) return name;
  return null;
};

export function parseDns(input: { mx: string[]; txt: string[]; dmarc: string[]; dkim: boolean; www: string[]; a: string[]; ns: string[] }): DnsResult {
  const spf = input.txt.map(cleanTxt).find((t) => t.toLowerCase().startsWith('v=spf1')) ?? null;
  const dmarc = input.dmarc.map(cleanTxt).find((t) => t.toLowerCase().startsWith('v=dmarc1')) ?? null;
  return {
    exists: [input.mx, input.a, input.ns, input.www].some((list) => list.length > 0),
    mx: input.mx, spf, dmarc, dkim: input.dkim,
    host: match(HOSTS, [...input.www, ...input.a]),
    emailProvider: match(MAIL, input.mx),
  };
}

export function parseRdap(json: unknown): RdapResult {
  const events = (json as { events?: { eventAction?: string; eventDate?: string }[] })?.events ?? [];
  const find = (name: string) => events.find((e) => e.eventAction === name)?.eventDate ?? null;
  return { registered: find('registration'), expires: find('expiration') };
}

export function parsePage(json: unknown): PageResult {
  const d = (json as { data?: Record<string, any> })?.data ?? {};
  return {
    title: d.title ?? null, description: d.description ?? null, image: d.image?.url ?? null,
    lang: d.lang ?? null, finalUrl: d.url ?? null, screenshot: d.screenshot?.url ?? null,
  };
}

export function parseSpeed(json: unknown): SpeedResult {
  const d = json as { lighthouseResult?: { categories?: Record<string, { score?: number | null }>; audits?: Record<string, { displayValue?: string }> }; loadingExperience?: { overall_category?: string } };
  const cat = d.lighthouseResult?.categories ?? {};
  const score = (k: string) => (cat[k]?.score == null ? null : Math.round((cat[k].score as number) * 100));
  const audits = d.lighthouseResult?.audits ?? {};
  return {
    scores: { performance: score('performance'), accessibility: score('accessibility'), bestPractices: score('best-practices'), seo: score('seo') },
    lcp: audits['largest-contentful-paint']?.displayValue ?? null,
    cls: audits['cumulative-layout-shift']?.displayValue ?? null,
    fieldSpeed: d.loadingExperience?.overall_category ?? null,
  };
}

const longDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export function pageFindings(p: PageResult): Finding[] {
  const out: Finding[] = [];
  const area: Area = 'Search basics';
  const t = p.title?.trim();
  if (!t) out.push({ id: 'title', area, status: 'fix', title: 'No page title found', detail: 'The title is the headline Google shows for your site.', service: 'seo' });
  else if (t.length < 15 || t.length > 65) out.push({ id: 'title', area, status: 'fix', title: `Your page title is ${t.length} characters`, detail: `"${t}". Around 30 to 60 characters is a good length for search results.`, service: 'seo' });
  else out.push({ id: 'title', area, status: 'good', title: 'Your page has a clear title', detail: `"${t}"` });
  const d = p.description?.trim();
  if (!d) out.push({ id: 'desc', area, status: 'fix', title: 'No page description found', detail: 'This is the short summary that can show under your title on Google.', service: 'seo' });
  else if (d.length > 170) out.push({ id: 'desc', area, status: 'fix', title: `Your description is ${d.length} characters`, detail: 'Google usually cuts these off at about 160, so the end may not show.', service: 'seo' });
  else out.push({ id: 'desc', area, status: 'good', title: 'Your page has a description', detail: d });
  out.push(p.image
    ? { id: 'image', area, status: 'good', title: 'Links to your site show a preview image', detail: 'This is what people see when your site is shared in a text or on social media.' }
    : { id: 'image', area, status: 'fix', title: 'No preview image found', detail: 'Links to your site will show up bare in texts and on social media.', service: 'website-edits' });
  if (p.finalUrl) out.push(p.finalUrl.startsWith('https://')
    ? { id: 'https', area, status: 'good', title: 'Your site uses HTTPS', detail: 'Browsers show it as secure.' }
    : { id: 'https', area, status: 'fix', title: 'Your site does not use HTTPS', detail: 'Browsers mark sites like this as not secure.', service: 'website-hosting' });
  return out;
}

export function dnsFindings(r: DnsResult): Finding[] {
  const area: Area = 'Email';
  const out: Finding[] = [];
  if (!r.exists) return [{ id: 'exists', area: 'Domain and hosting', status: 'fix', title: 'I could not find that domain', detail: 'Check the spelling. If it is right, the domain may have lapsed.' }];
  if (r.mx.length === 0) {
    out.push({ id: 'mx', area, status: 'info', title: 'No email is set up on this domain', detail: 'Addresses like you@yourbusiness.com will not work until mailboxes are set up.', service: 'email-management' });
  } else {
    out.push({ id: 'mx', area, status: 'good', title: `Email is set up${r.emailProvider ? ` with ${r.emailProvider}` : ''}`, detail: 'Your domain can receive mail.' });
    out.push(r.spf
      ? { id: 'spf', area, status: 'good', title: 'SPF record found', detail: 'It lists the servers allowed to send your email.' }
      : { id: 'spf', area, status: 'fix', title: 'No SPF record found', detail: 'Without SPF or DKIM, Gmail may reject or block your mail.', service: 'email-management' });
    out.push(r.dmarc
      ? { id: 'dmarc', area, status: 'good', title: 'DMARC record found', detail: 'It tells receivers what to do with mail that fails checks.' }
      : { id: 'dmarc', area, status: 'fix', title: 'No DMARC record found', detail: 'It is only required for very large senders, but it helps protect your domain from being faked.', service: 'email-management' });
    out.push(r.dkim
      ? { id: 'dkim', area, status: 'good', title: 'DKIM record found', detail: 'Your mail can be signed, so receivers can check it is genuine.' }
      : { id: 'dkim', area, status: 'info', title: 'No DKIM record at the common names', detail: 'You may still have one under a different name. I can check by hand.', service: 'email-management' });
  }
  if (r.host) out.push({ id: 'host', area: 'Domain and hosting', status: 'info', title: `Your site looks like it is on ${r.host}`, detail: 'This is a best guess from your domain records.' });
  return out;
}

export function rdapFindings(r: RdapResult, now: number): Finding[] {
  const area: Area = 'Domain and hosting';
  const out: Finding[] = [];
  if (r.registered) out.push({ id: 'age', area, status: 'info', title: `Domain registered ${longDate(r.registered)}`, detail: 'This is the public record for your domain.' });
  if (r.expires) {
    const days = Math.round((Date.parse(r.expires) - now) / 86_400_000);
    out.push(days < 60
      ? { id: 'renew', area, status: 'fix', title: `Your domain renews on ${longDate(r.expires)}`, detail: `That is ${Math.max(days, 0)} days away. Check that auto-renew is on and your card is current, because a lapsed domain takes your site and email down.`, service: 'small-jobs' }
      : { id: 'renew', area, status: 'good', title: `Your domain renews on ${longDate(r.expires)}`, detail: 'A lapsed domain takes your site and email down, so it is worth having this date.' });
  }
  return out;
}

export function speedFindings(s: SpeedResult): Finding[] {
  const area: Area = 'Speed';
  const perf = s.scores.performance;
  const out: Finding[] = [];
  if (perf != null) out.push({ id: 'perf', area, status: perf >= 70 ? 'good' : 'fix', title: `Phone speed score: ${perf} out of 100`, detail: s.lcp ? `Main content appears after ${s.lcp} on a simulated phone.` : 'Measured by Google on a simulated phone.', service: perf >= 70 ? undefined : 'website-edits' });
  if (s.scores.accessibility != null && s.scores.accessibility < 90) out.push({ id: 'a11y', area, status: 'fix', title: `Accessibility score: ${s.scores.accessibility} out of 100`, detail: 'Some people may have trouble reading or using parts of your site.', service: 'website-edits' });
  return out;
}

export function summarize(findings: Finding[]) {
  if (!findings.length) return 'No results yet.';
  return findings.map((f) => `[${f.status}] ${f.title}`).join('\n');
}

async function getJson(url: string, ms: number, signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(ms);
  const res = await fetch(url, { signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

async function dns(name: string, type: string, signal?: AbortSignal): Promise<string[]> {
  const json = (await getJson(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`, 10_000, signal)) as { Answer?: { data: string }[] };
  return (json.Answer ?? []).map((a) => a.data);
}

export async function checkDns(root: string, signal?: AbortSignal) {
  const safe = (p: Promise<string[]>) => p.catch(() => [] as string[]);
  const [mx, txt, dmarc, www, a, ns, ...dkim] = await Promise.all([
    dns(root, 'MX', signal), safe(dns(root, 'TXT', signal)), safe(dns(`_dmarc.${root}`, 'TXT', signal)),
    safe(dns(`www.${root}`, 'CNAME', signal)), safe(dns(root, 'A', signal)), safe(dns(root, 'NS', signal)),
    ...['google', 'selector1', 'k1', 's1', 'default'].map((s) => safe(dns(`${s}._domainkey.${root}`, 'TXT', signal))),
  ]);
  return parseDns({ mx, txt, dmarc, dkim: dkim.some((d) => d.length > 0), www, a, ns });
}

export const checkDomain = async (root: string, signal?: AbortSignal) =>
  parseRdap(await getJson(`https://rdap.org/domain/${encodeURIComponent(root)}`, 12_000, signal));

export const checkPage = async (url: string, signal?: AbortSignal) =>
  parsePage(await getJson(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&device=${encodeURIComponent('iPhone 13')}`, 40_000, signal));

export async function checkSpeed(url: string, signal?: AbortSignal) {
  const key = import.meta.env?.VITE_PSI_API_KEY as string | undefined;
  const cats = ['performance', 'accessibility', 'best-practices', 'seo'].map((c) => `category=${c}`).join('&');
  const q = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&${cats}${key ? `&key=${key}` : ''}`;
  return parseSpeed(await getJson(q, 75_000, signal));
}
