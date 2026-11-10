import { useState } from 'react';
import { money, sitePrice } from '../../data/prices';
import { contactLink } from '../../lib/lead';
import { Button } from '../ui/Button';

const NAMES = ['Home', 'Services', 'About', 'Contact', 'Reviews', 'Gallery', 'FAQ', 'Team', 'Blog', 'Locations'];

export function SiteSize() {
  const [pages, setPages] = useState(5);
  const { total, label } = sitePrice(pages);
  return (
    <div className="size" id="site-size">
      <div className="size-control">
        <label htmlFor="size-range">How many pages do you need?</label>
        <p className="size-count">{pages} {pages === 1 ? 'page' : 'pages'}</p>
        <input id="size-range" type="range" min="1" max="10" step="1" value={pages} onChange={(e) => setPages(Number(e.target.value))} aria-valuetext={`${pages} pages, ${money(total)}`} />
        <div className="size-result">
          <p className="size-price">{money(total)}</p>
          <p>{label}</p>
        </div>
        <Button to={contactLink({ need: `A ${pages}-page website`, source: 'site-size' })}>Ask about a site this size</Button>
      </div>
      <ul className="sheets-grid" aria-hidden="true">
        {NAMES.map((n, i) => (
          <li key={n} className={i < pages ? 'on' : ''}><span />{n}</li>
        ))}
      </ul>
    </div>
  );
}
