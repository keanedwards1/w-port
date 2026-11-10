import { useEffect, useRef, useState, type FormEvent } from 'react';
import { services } from '../../data/services';
import { site } from '../../data/site';
import { sendLead } from '../../lib/lead';
import { replyBy } from '../../lib/hours';
import { Icon } from '../ui/Icon';
import type { LeadStart } from './LeadContext';
import { Topo } from '../gl/Topo';
import { OFFER_FORMS } from './offerForms';

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const OTHER = 'Something else';
export const BUDGETS = ['Under $2,500', '$2,500 – $5,000', '$5,000 – $10,000', '$10,000 +', 'Not sure yet'];

/** Step one is the email. Steps two and three fill in the rest. */
export function LeadModal({ start, onClose }: { start: LeadStart; onClose: () => void }) {
  const hasEmail = !!start.email && isEmail(start.email);
  const [step, setStep] = useState(hasEmail ? 1 : 0);
  const [email, setEmail] = useState(start.email ?? '');
  const offer = start.offer ? OFFER_FORMS[start.offer] : null;
  const [needs, setNeeds] = useState<string[]>(offer?.projects ?? []);
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [budget, setBudget] = useState('');
  const [form, setForm] = useState({ first: '', last: '', business: '', website: '', phone: '', details: '', honey: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'failed'>('idle');
  const [error, setError] = useState('');
  const panel = useRef<HTMLDivElement>(null);
  const titleId = 'lead-title';

  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>('button, a, input, textarea')).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      before?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    const target = panel.current?.querySelector<HTMLElement>('[data-autofocus]');
    window.requestAnimationFrame(() => target?.focus());
  }, [step]);

  const field = (key: keyof typeof form) => ({ value: form[key], onChange: (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value }) });
  const toggle = (name: string) => setNeeds((n) => (n.includes(name) ? n.filter((x) => x !== name) : [...n, name]));

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) { setError('That email doesn’t look right yet.'); return; }
    setError('');
    // Saved now, so the lead isn't lost if the rest is never finished.
    sendLead({ email, need: 'Started the form', source: `${start.source}:email`, offer: offer?.label }).catch(() => {});
    setStep(1);
  };

  const submitAbout = (e: FormEvent) => {
    e.preventDefault();
    if (!form.first.trim()) { setError('What should I call you?'); return; }
    if (!form.last.trim()) { setError('And your last name?'); return; }
    if (form.phone.replace(/\D/g, '').length < 7) { setError('What’s the best number to reach you?'); return; }
    if (offer?.companyRequired && !form.business.trim()) { setError(`What’s the ${offer.company.toLowerCase()}?`); return; }
    const missing = offer?.extra.find((q) => q.required && !extra[q.key]?.trim());
    if (missing) { setError(`${missing.label}`); return; }
    setError('');
    setStep(2);
  };

  const submitAll = async (e: FormEvent) => {
    e.preventDefault();
    if (!needs.length) { setError('Pick at least one project, or Something else.'); return; }
    if (!budget) { setError('Pick a budget, or Not sure yet.'); return; }
    setError('');
    setState('sending');
    const { first: f, last: l, ...rest } = form;
    try {
      await sendLead({ ...rest, name: `${f.trim()} ${l.trim()}`, email, budget, need: needs.join(', '), source: start.source, offer: offer?.label, extra });
      setStep(3);
      setState('idle');
    } catch {
      setState('failed');
    }
  };

  const first = form.first.trim();
  const steps = ['Email', 'About you', 'Projects'];

  return (
    <div className="lead" role="presentation" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`lead-panel${step === 3 ? ' milk' : ''}`} ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <Topo milk={step === 3} />
        <div className="lead-top">
          {step < 3 ? (
            <ol className="lead-steps" aria-label={`Step ${step + 1} of 3`}>
              {steps.map((s, i) => (
                <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}>
                  <span>{i < step ? <Icon name="check" size={13} /> : i + 1}</span>{s}
                </li>
              ))}
            </ol>
          ) : <p className="lead-steps">Sent</p>}
          <button type="button" className="lead-close" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        </div>

        {step === 0 && (
          <form className="lead-body" onSubmit={submitEmail} noValidate key="s0">
            {offer ? (
              <>
                <h2 id={titleId}>{offer.title}</h2>
                <p className="lead-sub">{offer.sub}</p>
              </>
            ) : (
              <>
                <h2 id={titleId}>We can’t wait to hear from you;<br />get in touch.</h2>
                <p className="lead-sub">There is no time like now! If you are ready to start a project or have an inquiry, fill out the details below.</p>
              </>
            )}
            <label className="sr-only" htmlFor="lead-email">Email</label>
            <input id="lead-email" data-autofocus className="lead-big" type="email" autoComplete="email" placeholder="you@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="lead-error" role="alert">{error}</p>
            <div className="lead-actions"><button type="submit" className="lead-next">Continue<Icon name="arrow" size={18} /></button></div>
          </form>
        )}

        {step === 1 && (
          <form className="lead-body" onSubmit={submitAbout} noValidate key="s1">
            <h2 id={titleId}>First, a little about you.</h2>
            <div className="lead-fields">
              <label>First Name<span className="req" aria-hidden="true">*</span><input type="text" data-autofocus required autoComplete="given-name" {...field('first')} /></label>
              <label>Last Name<span className="req" aria-hidden="true">*</span><input type="text" required autoComplete="family-name" {...field('last')} /></label>
              <label>{offer?.company ?? 'Company Name'}{offer?.companyRequired && <span className="req" aria-hidden="true">*</span>}<input type="text" required={offer?.companyRequired} autoComplete="organization" {...field('business')} /></label>
              <label>Phone<span className="req" aria-hidden="true">*</span><input type="tel" required autoComplete="tel" {...field('phone')} /></label>
              <label className="wide">Website<input type="text" inputMode="url" placeholder="yourbusiness.com" {...field('website')} /></label>
              {offer?.extra.map((q) => (
                <label key={q.key} className="wide">{q.label}{q.required && <span className="req" aria-hidden="true">*</span>}
                  {q.type === 'area'
                    ? <textarea rows={3} required={q.required} placeholder={q.placeholder} value={extra[q.key] ?? ''} onChange={(e) => setExtra({ ...extra, [q.key]: e.target.value })} />
                    : <input type="text" required={q.required} placeholder={q.placeholder} value={extra[q.key] ?? ''} onChange={(e) => setExtra({ ...extra, [q.key]: e.target.value })} />}
                </label>
              ))}
              <label className="trap" aria-hidden="true">Leave empty<input type="text" tabIndex={-1} autoComplete="off" {...field('honey')} /></label>
            </div>
            <p className="lead-error" role="alert">{error}</p>
            <div className="lead-actions">
              {!hasEmail && <button type="button" className="lead-back" onClick={() => setStep(0)}>Back</button>}
              <button type="submit" className="lead-next">Continue<Icon name="arrow" size={18} /></button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="lead-body" onSubmit={submitAll} noValidate key="s2">
            <h2 id={titleId}>Which project(s) are you interested in?</h2>
            <p className="lead-sub">Pick as many as you like.</p>
            <div className="lead-tiles" role="group" aria-label="Services">
              {[...services.map((s) => s.name), OTHER].map((name, i) => (
                <button key={name} type="button" data-autofocus={i === 0 || undefined} aria-pressed={needs.includes(name)} className={needs.includes(name) ? 'on' : ''} onClick={() => toggle(name)}>
                  <span className="lead-tile-num">{String(i + 1).padStart(2, '0')}</span><span>{name}</span>
                </button>
              ))}
            </div>
            <fieldset className="lead-budget">
              <legend>Do you have a design budget in mind?<span className="req" aria-hidden="true">*</span></legend>
              <div>
                {BUDGETS.map((b) => (
                  <button key={b} type="button" aria-pressed={budget === b} className={budget === b ? 'on' : ''} onClick={() => setBudget(b)}>{b}</button>
                ))}
              </div>
            </fieldset>
            <label className="lead-over">
              <span className="lead-over-title">Now, over to you; Tell us more about your company</span>
              <textarea rows={4} placeholder="What you do, what’s not working, and anything else on your mind." {...field('details')} />
            </label>
            <p className="lead-error" role="alert">{error}{state === 'failed' && `That didn’t send. Call or text me at ${site.phone} instead.`}</p>
            <div className="lead-actions">
              <button type="button" className="lead-back" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="lead-next" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : 'Send to Kean'}<Icon name="arrow" size={18} /></button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="lead-body lead-done" key="s3">
            <img src="/images/kean/avatar.webp" alt="" width="96" height="96" />
            <h2 id={titleId} tabIndex={-1} data-autofocus>Thanks{first ? `, ${first}` : ''}. It’s on my desk.</h2>
            <p className="lead-sub">I’ll reply to {email} by {replyBy(new Date())}.</p>
            <p className="lead-alt">In a hurry? <a href={site.phoneHref}>Call</a> or <a href={site.smsHref}>text</a> {site.phone}.</p>
            <div className="lead-actions"><button type="button" className="lead-next" onClick={onClose}>Back to the site</button></div>
          </div>
        )}
      </div>
    </div>
  );
}
