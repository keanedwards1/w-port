import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { LeadButton } from '../lead/EmailStart';
import type { OfferKey } from '../lead/offerForms';

const KEY = 'note-dismissed';

/** The banner rotates through these. Each one opens its own version of the Hire me form. */
const NOTES: { text: string; action: string; offer: OfferKey }[] = [
  { text: 'Now booking new website projects for early 2027.', action: 'Book a project', offer: 'booking' },
  { text: 'In Marin? I’m happy to meet in person, and I can come present at your business.', action: 'Set up a time', offer: 'meet' },
  { text: 'Building a site for a local organization? Ask about my community rate.', action: 'Ask about it', offer: 'community' },
];

export function Banner() {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    try { if (sessionStorage.getItem(KEY)) setHidden(true); } catch { /* Private windows can block storage. */ }
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % NOTES.length), 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  if (hidden || pathname === '/') return null;

  const dismiss = () => {
    setHidden(true);
    try { sessionStorage.setItem(KEY, '1'); } catch { /* Fine, it just comes back on the next page load. */ }
  };
  const note = NOTES[i];

  return (
    <aside className="banner" aria-label="Note" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <LeadButton source={`banner:${note.offer}`} offer={note.offer} className="banner-link">
        <span key={i} className="banner-note">
          <span>{note.text}</span>
          <span className="banner-more">{note.action} <Icon name="arrow" size={15} /></span>
        </span>
      </LeadButton>
      <button type="button" className="banner-close" onClick={dismiss} aria-label="Dismiss note"><Icon name="close" size={16} /></button>
    </aside>
  );
}
