import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../../data/site';
import { LeadButton } from '../lead/EmailStart';
import { Icon } from '../ui/Icon';

/** Call, text, and contact buttons on phones. Stays out of the way of forms and the keyboard. */
export function MobileBar() {
  const { pathname } = useLocation();
  const [past, setPast] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 480);
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && t.matches('input, textarea, select');
    const onIn = (e: FocusEvent) => { if (isField(e.target)) setTyping(true); };
    const onOut = (e: FocusEvent) => { if (isField(e.target)) setTyping(false); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  const hide = !past || typing || pathname === '/contact' || pathname === '/thanks';
  return (
    <div className={`mobile-bar${hide ? '' : ' show'}`} aria-hidden={hide} inert={hide || undefined}>
      <a href={site.phoneHref}><Icon name="phone" size={18} />Call</a>
      <a href={site.smsHref}><Icon name="message" size={18} />Text</a>
      <LeadButton source="mobile-bar" className="mobile-bar-main">Hire me</LeadButton>
    </div>
  );
}
