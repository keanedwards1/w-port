import { useState } from 'react';
import { footerNav, type NavGroup } from '../../data/nav';
import { site } from '../../data/site';
import { useClock } from '../../lib/hooks';
import { replyBy } from '../../lib/hours';
import { A } from '../ui/A';
import { Icon } from '../ui/Icon';

const ELSEWHERE: NavGroup = {
  label: 'Elsewhere',
  links: [
    { label: 'My photography', to: 'https://www.kean-edwards.com/elsewhere' },
    { label: 'LinkedIn', to: 'https://www.linkedin.com/in/kean-edwards/' },
    { label: 'GitHub', to: 'https://github.com/keanedwards1' },
  ],
};

function Column({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`foot-col${open ? ' open' : ''}`}>
      <h2><button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>{group.label}<Icon name="chevron" size={16} /></button></h2>
      <ul>{group.links.map((l) => <li key={l.to}>{l.to.startsWith('http') ? <a href={l.to} target="_blank" rel="noopener noreferrer">{l.label}</a> : <A to={l.to}>{l.label}</A>}</li>)}</ul>
    </div>
  );
}

export function Footer() {
  const clock = useClock();
  return (
    <footer className="pf">
      <div className="wrap pf-hello">
        <div className="pf-photo"><img src="/images/kean/smile.webp" alt="Kean Edwards, smiling, outdoors" width="700" height="859" loading="lazy" /></div>
        <div className="pf-note">
          <p className="pf-big">Something on your website bugging you? Send it my way.</p>
          <p className="pf-contact">
            <a href={site.phoneHref}>Call {site.phone}</a>
            <a href={site.smsHref}>Text</a>
            <a href={site.emailHref}>{site.email}</a>
          </p>
        </div>
        <aside className="pf-now" aria-label="Right now in Lagunitas">
          <p className="pf-time">{clock?.time ?? ' '}</p>
          <p className="mono"><span className={`status-dot${clock?.open ? ' on' : ''}`} />{clock ? (clock.open ? 'In Lagunitas, at my desk' : `In Lagunitas. Reply by ${replyBy(new Date())}`) : 'Lagunitas, California'}</p>
        </aside>
      </div>
      <div className="wrap pf-links">
        {[...footerNav, ELSEWHERE].map((g) => <Column key={g.label} group={g} />)}
      </div>
      <p className="pf-name" aria-hidden="true">Kean Edwards</p>
      <div className="wrap pf-legal mono">
        <span>© {new Date().getFullYear()} {site.name}, {site.town}</span>
        <span><A to="/privacy">Privacy</A> <a href="#main" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); document.getElementById('main')?.focus({ preventScroll: true }); }}>Back to top</a></span>
      </div>
    </footer>
  );
}
