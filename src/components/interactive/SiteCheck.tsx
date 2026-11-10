import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { A } from '../ui/A';
import { Icon } from '../ui/Icon';
import { sendLead, contactLink } from '../../lib/lead';
import {
  checkDns, checkDomain, checkPage, checkSpeed, dnsFindings, pageFindings, parseSite, rdapFindings, speedFindings, summarize,
  type Area, type DnsResult, type Finding, type PageResult, type RdapResult, type SpeedResult,
} from '../../lib/site-check';

type Slot<T> = { state: 'idle' | 'loading' | 'failed' } | { state: 'done'; data: T };
interface Results { dns: Slot<DnsResult>; domain: Slot<RdapResult>; page: Slot<PageResult>; speed: Slot<SpeedResult> }
const empty: Results = { dns: { state: 'idle' }, domain: { state: 'idle' }, page: { state: 'idle' }, speed: { state: 'idle' } };
const AREAS: Area[] = ['Search basics', 'Speed', 'Email', 'Domain and hosting'];
const WAIT: Record<keyof Results, string> = { dns: 'Looking up your email records', domain: 'Reading your domain record', page: 'Opening your site on a phone', speed: 'Running the speed test' };

/** Compact field for the home page hero. Sends people to the full check. */
export function HeroCheck() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const go = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/check?url=${encodeURIComponent(value)}&run=1`);
  };
  return (
    <form className="hero-check" onSubmit={go}>
      <label htmlFor="hero-url">Free Site Check</label>
      <div className="inline-field">
        <input id="hero-url" type="text" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit" className="btn btn-secondary btn-small">Check my site</button>
      </div>
    </form>
  );
}

export function SiteCheck() {
  const [params] = useSearchParams();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [checked, setChecked] = useState('');
  const [results, setResults] = useState<Results>(empty);
  const [asking, setAsking] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState<'no' | 'sending' | 'yes' | 'failed'>('no');
  const abort = useRef<AbortController | null>(null);
  const [now, setNow] = useState(0);

  const run = (value: string) => {
    const site = parseSite(value);
    if (!site) { setError('Enter a website, like yourbusiness.com'); return; }
    setError('');
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    setChecked(site.url);
    setNow(Date.now());
    setResults({ dns: { state: 'loading' }, domain: { state: 'loading' }, page: { state: 'loading' }, speed: { state: 'loading' } });
    const track = <K extends keyof Results>(key: K, p: Promise<unknown>) => {
      p.then((data) => { if (!ctrl.signal.aborted) setResults((r) => ({ ...r, [key]: { state: 'done', data } })); })
        .catch(() => { if (!ctrl.signal.aborted) setResults((r) => ({ ...r, [key]: { state: 'failed' } })); });
    };
    track('dns', checkDns(site.root, ctrl.signal));
    track('domain', checkDomain(site.root, ctrl.signal));
    track('page', checkPage(site.url, ctrl.signal));
    track('speed', checkSpeed(site.url, ctrl.signal));
  };

  useEffect(() => {
    const q = params.get('url');
    if (q) { setUrl(q); if (params.get('run')) run(q); }
    return () => abort.current?.abort();
    // Runs once, for links that arrive with a site already filled in.
  }, []);

  const findings = useMemo(() => {
    const list: Finding[] = [];
    const { dns, domain, page, speed } = results;
    if (page.state === 'done') list.push(...pageFindings(page.data));
    if (page.state === 'failed') list.push({ id: 'page-fail', area: 'Search basics', status: 'info', title: 'I couldn’t open your page from here', detail: 'This free reader allows a few checks a day. I can look by hand.' });
    if (speed.state === 'done') list.push(...speedFindings(speed.data));
    if (speed.state === 'failed') list.push({ id: 'speed-fail', area: 'Speed', status: 'info', title: 'Speed scores aren’t available right now', detail: 'Google’s free speed test is at its limit. I can run it for you by hand.' });
    if (dns.state === 'done') list.push(...dnsFindings(dns.data));
    if (dns.state === 'failed') list.push({ id: 'dns-fail', area: 'Email', status: 'info', title: 'I couldn’t look up your email records', detail: 'Try again, or ask me to check by hand.' });
    if (domain.state === 'done') list.push(...rdapFindings(domain.data, now));
    return list;
  }, [results, now]);

  const pending = (Object.keys(results) as (keyof Results)[]).filter((k) => results[k].state === 'loading');
  const started = results.dns.state !== 'idle';
  const toFix = findings.filter((f) => f.status === 'fix').length;
  const screenshot = results.page.state === 'done' ? results.page.data.screenshot : null;
  const scores = results.speed.state === 'done' ? results.speed.data.scores : null;

  const submit = (e: FormEvent) => { e.preventDefault(); run(url); };

  const ask = () => {
    if (!parseSite(url)) { setError('Enter your website first, so I know what to look at.'); return; }
    setError('');
    setAsking(true);
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setSent('sending');
    try {
      await sendLead({ email, website: parseSite(url)?.url ?? url, need: 'Look at my site', details: summarize(findings), source: 'site-check' });
      setSent('yes');
    } catch {
      setSent('failed');
    }
  };

  return (
    <div className="check">
      <form className="check-form" onSubmit={submit} noValidate>
        <label htmlFor="check-url">Your website</label>
        <input id="check-url" type="text" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" value={url} onChange={(e) => setUrl(e.target.value)} aria-describedby="check-error" />
        <div className="row">
          <button type="submit" className="btn btn-primary">Run the check</button>
          <button type="button" className="btn btn-secondary" onClick={ask} aria-expanded={asking}>Have Kean look at it</button>
        </div>
        <p id="check-error" className="form-error" role="alert">{error}</p>
      </form>

      {asking && sent !== 'yes' && (
        <form className="check-ask" onSubmit={send}>
          <label htmlFor="check-email">Where should I send my notes?</label>
          <div className="inline-field">
            <input id="check-email" type="email" required autoComplete="email" placeholder="you@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="btn btn-primary btn-small" disabled={sent === 'sending'}>{sent === 'sending' ? 'Sending' : 'Send'}</button>
          </div>
          <p className="hint">I’ll look at your site myself and reply with three things to fix. It’s free.</p>
          {sent === 'failed' && <p className="form-error" role="alert">That didn’t send. Call or text me instead: 415-930-2468.</p>}
        </form>
      )}
      {sent === 'yes' && <p className="check-sent" role="status"><Icon name="check" /> Got it. I’ll send your notes within 1 business day.</p>}

      {started && (
        <div className="check-results" aria-live="polite">
          <div className="check-main">
            <h2>{pending.length ? 'Checking' : toFix ? `${toFix} ${toFix === 1 ? 'thing' : 'things'} to look at` : 'Nothing urgent found'}</h2>
            <p className="check-site">{checked}</p>
            {pending.length > 0 && <ul className="check-wait">{pending.map((k) => <li key={k}><span className="spinner" />{WAIT[k]}</li>)}</ul>}
            {scores && (
              <dl className="scores">
                {([['Speed', scores.performance], ['Accessibility', scores.accessibility], ['Best practices', scores.bestPractices], ['SEO', scores.seo]] as const).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v ?? 'n/a'}</dd></div>)}
              </dl>
            )}
            {AREAS.map((area) => {
              const items = findings.filter((f) => f.area === area);
              if (!items.length) return null;
              return (
                <section key={area} className="check-area">
                  <h3>{area}</h3>
                  <ul>
                    {items.map((f) => (
                      <li key={f.id} className={`finding ${f.status}`}>
                        <span className="finding-icon"><Icon name={f.status === 'good' ? 'check' : f.status === 'fix' ? 'fix' : 'info'} size={16} /></span>
                        <div>
                          <p className="finding-title">{f.title}</p>
                          <p>{f.detail}</p>
                          {f.service && <A to={`/services/${f.service}`} className="text-link">How I fix this<Icon name="arrow" size={15} /></A>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
            {!pending.length && <p className="check-next">Want this fixed? <A to={contactLink({ need: 'Fix what the Site Check found', website: checked, source: 'site-check' })}>Send it to me</A> and I’ll tell you what it costs.</p>}
          </div>
          {screenshot && (
            <aside className="check-phone">
              <p className="kicker">On a phone</p>
              <div className="phone-frame"><img src={screenshot} alt={`How ${checked} looks on a phone`} /></div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
