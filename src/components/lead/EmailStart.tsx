import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { sendLead } from '../../lib/lead';
import { Icon } from '../ui/Icon';
import { useLead } from './LeadContext';
import { isEmail } from './LeadModal';
import type { OfferKey } from './offerForms';

/** Step one of the form, right on the page. The rest opens in the panel. */
export function EmailStart({ source, tone = 'light' }: { source: string; tone?: 'light' | 'dark' | 'line' }) {
  const open = useLead();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const id = `email-${source}`;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) { setError('Enter your email to start.'); return; }
    setError('');
    sendLead({ email, need: 'Started the form', source: `${source}:email` }).catch(() => {});
    open({ source, email, from: formRef.current });
  };

  return (
    <form ref={formRef} className={`email-start ${tone}`} onSubmit={submit} noValidate>
      <label htmlFor={id} className="sr-only">Your email</label>
      <input id={id} type="email" autoComplete="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby={`${id}-error`} />
      <button type="submit" aria-label="Send"><Icon name="arrow" size={22} /></button>
      <p id={`${id}-error`} className="email-start-error" role="alert">{error}</p>
    </form>
  );
}

/** A button that opens the form at step one. */
export function LeadButton({ source, children, className = 'btn btn-primary', onClick, offer }: { source: string; children: ReactNode; className?: string; onClick?: () => void; offer?: OfferKey }) {
  const open = useLead();
  return <button type="button" className={className} onClick={(e) => { onClick?.(); open({ source, from: e.currentTarget, offer }); }}>{children}</button>;
}
