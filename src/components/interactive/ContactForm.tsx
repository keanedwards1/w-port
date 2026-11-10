import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { services } from '../../data/services';
import { site } from '../../data/site';
import { sendLead } from '../../lib/lead';

const empty = { name: '', business: '', need: '', email: '', phone: '', website: '', details: '', honey: '' };

export function ContactForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [source, setSource] = useState('contact');
  const [state, setState] = useState<'idle' | 'sending' | 'failed'>('idle');

  useEffect(() => {
    setForm((f) => ({ ...f, need: params.get('need') ?? f.need, website: params.get('website') ?? f.website }));
    const utm = params.get('utm_source');
    setSource(params.get('source') ?? (utm ? `utm:${utm}` : 'contact'));
    // Reads the link once, when the page opens.
  }, []);

  const field = (key: keyof typeof empty) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value }),
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await sendLead({ ...form, source });
      navigate('/thanks');
    } catch {
      setState('failed');
    }
  };

  return (
    <form className="madlib" onSubmit={submit}>
      <p className="madlib-line">
        <span>Hi Kean, I’m</span>
        <input aria-label="Your name" required autoComplete="name" placeholder="your name" size={10} {...field('name')} />
        <span>from</span>
        <input aria-label="Your business" autoComplete="organization" placeholder="your business" size={13} {...field('business')} />
        <span>. I need help with</span>
        <input aria-label="What you need help with" required placeholder="what’s going on" list="needs" size={16} {...field('need')} />
        <span>.</span>
      </p>
      <datalist id="needs">{services.map((s) => <option key={s.slug} value={s.name} />)}</datalist>
      <div className="form-grid">
        <label>Email<input type="email" required autoComplete="email" {...field('email')} /></label>
        <label>Phone <span>optional</span><input type="tel" autoComplete="tel" {...field('phone')} /></label>
        <label className="wide">Your website <span>optional</span><input type="text" inputMode="url" {...field('website')} /></label>
        <label className="wide">Anything else <span>optional</span><textarea rows={4} {...field('details')} /></label>
        <label className="trap" aria-hidden="true">Leave this empty<input tabIndex={-1} autoComplete="off" {...field('honey')} /></label>
      </div>
      <div className="row">
        <button type="submit" className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : 'Send to Kean'}</button>
        <p className="hint">{site.reply}</p>
      </div>
      {state === 'failed' && <p className="form-error" role="alert">That didn’t send. Call or text me at {site.phone}, or email {site.email}.</p>}
    </form>
  );
}
