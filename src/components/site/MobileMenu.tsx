import { useEffect, useRef, useState } from 'react';
import { primaryNav, isCurrent } from '../../data/nav';
import { site } from '../../data/site';
import { A } from '../ui/A';
import { Icon } from '../ui/Icon';
import { LeadButton } from '../lead/EmailStart';

export function MobileMenu({ open, path, onClose }: { open: boolean; path: string; onClose: () => void }) {
  const sheet = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    sheet.current?.querySelector<HTMLElement>('button, a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !sheet.current) return;
      const items = Array.from(sheet.current.querySelectorAll<HTMLElement>('a, button')).filter((el) => el.offsetParent !== null);
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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet" ref={sheet} role="dialog" aria-modal="true" aria-label="Menu">
      <div className="sheet-top">
        <A to="/" className="wordmark" onClick={onClose}>{site.name}</A>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu"><Icon name="close" size={22} /></button>
      </div>
      <nav className="sheet-nav" aria-label="Mobile">
        {primaryNav.map((item) => {
          const current = isCurrent(item.match, path);
          if (!item.groups) return <A key={item.label} to={item.to!} className={`sheet-link${current ? ' current' : ''}`} aria-current={current ? 'page' : undefined} onClick={onClose}>{item.label}</A>;
          const isOpen = section === item.label;
          return (
            <div key={item.label} className={`sheet-group${isOpen ? ' open' : ''}`}>
              <div className="sheet-trigger">
                <A to={item.to!} className={`sheet-link${current ? ' current' : ''}`} onClick={onClose}>{item.label}</A>
              <button type="button" className="sheet-toggle" aria-label={`Toggle ${item.label} menu`} aria-controls={`mobile-panel-${item.label}`} aria-expanded={isOpen} onClick={() => setSection(isOpen ? null : item.label)}>
                <Icon name="chevron" size={20} />
              </button>
              </div>
              {isOpen && (
                <div className="sheet-sub" id={`mobile-panel-${item.label}`}>
                  {item.groups?.flatMap((g) => g.links).map((l) => <A key={l.to} to={l.to} onClick={onClose}>{l.label}</A>)}
                  {item.footerLink && <A to={item.footerLink.to} onClick={onClose}>{item.footerLink.label}</A>}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="sheet-contact">
        <a href={site.phoneHref}><Icon name="phone" />Call {site.phone}</a>
        <a href={site.smsHref}><Icon name="message" />Text me</a>
        <a href={site.emailHref}><Icon name="mail" />Email me</a>
        <LeadButton source="menu" onClick={onClose}>Hire me</LeadButton>
      </div>
    </div>
  );
}
