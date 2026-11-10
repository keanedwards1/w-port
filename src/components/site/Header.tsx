import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { primaryNav, isCurrent } from '../../data/nav';
import { site } from '../../data/site';
import { hasDatedOffer } from '../../lib/offers';
import { useNow } from '../../lib/hooks';
import { A } from '../ui/A';
import { Icon } from '../ui/Icon';
import { Dropdown } from './Dropdown';
import { MobileMenu } from './MobileMenu';
import { LeadButton } from '../lead/EmailStart';

export function Header() {
  const { pathname } = useLocation();
  const now = useNow();
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpenDrop(null); setMenu(false); }, [pathname]);

  useEffect(() => {
    if (!openDrop) return;
    const onDown = (e: PointerEvent) => { if (!(e.target as Element).closest('.drop')) setOpenDrop(null); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openDrop]);

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        <A to="/" className="wordmark">{site.name}</A>
        <nav className="nav" aria-label="Main">
          {primaryNav.map((item) => {
            const current = isCurrent(item.match, pathname);
            if (item.groups) {
              return (
                <Dropdown
                  key={item.label} item={item} current={current}
                  open={openDrop === item.label}
                  onOpen={() => setOpenDrop(item.label)}
                  onClose={() => setOpenDrop((o) => (o === item.label ? null : o))}
                />
              );
            }
            return (
              <A key={item.label} to={item.to as string} className={`nav-link${current ? ' current' : ''}`} aria-current={current ? 'page' : undefined}>
                {item.label}
                {item.label === 'Offers' && hasDatedOffer(now) && <span className="offer-dot" title="Offer running now"><span className="sr-only"> (offer running now)</span></span>}
              </A>
            );
          })}
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={site.phoneHref} aria-label={`Call ${site.phone}`}>
            <Icon name="phone" size={18} /><span>{site.phone}</span>
          </a>
          <LeadButton source="header" className="btn btn-primary btn-small header-cta">Hire me</LeadButton>
          <button type="button" className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}>
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>
      <MobileMenu open={menu} path={pathname} onClose={closeMenu} />
    </header>
  );
}
