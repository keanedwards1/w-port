import { useState } from 'react';
import { site } from '../../data/site';

/** Each note and where its pin sits on the real listing, as percentages. */
const NOTES = [
  { title: 'Name and category', text: 'Your real business name, and the category that best fits.', x: 88, y: 32 },
  { title: 'Hours and contact details', text: 'Regular hours, holiday hours, phone, and website.', x: 88, y: 65 },
  { title: 'Services and description', text: 'Written the way your customers say them. These sit under the About tab.', x: 88, y: 41 },
  { title: 'Photos', text: 'Your work, your place, and your team.', x: 88, y: 14 },
  { title: 'Reviews', text: 'A link and QR code to ask for them, and replies to the ones you have.', x: 42, y: 35 },
];

/** Real Google screenshots only. Nothing here recreates Google's interface. */
export function GoogleProfile() {
  const { before, after, listing } = site.googleProfile;
  const [split, setSplit] = useState(50);
  const shot = after || listing;
  return (
    <div className={`gbp${shot ? '' : ' gbp-text'}`}>
      {before && after ? (
        <div className="gbp-slider" style={{ '--split': `${split}%` } as React.CSSProperties}>
          <img src={after} alt="A real Google Business Profile after the fix" />
          <img src={before} alt="The same profile before the fix" className="gbp-before" />
          <input type="range" min="0" max="100" value={split} onChange={(e) => setSplit(Number(e.target.value))} aria-label="Compare before and after" />
          <span className="gbp-handle" aria-hidden="true" />
        </div>
      ) : shot ? (
        <figure className="gbp-figure">
          <div className="gbp-pins">
            <img className="gbp-shot" src={shot} alt="A real Google Maps listing for a business in San Rafael, with its name, rating, address, hours, website, and phone number" loading="lazy" width="720" height="1518" />
            {NOTES.map((n, i) => <span key={n.title} className="gbp-pin" style={{ left: `${n.x}%`, top: `${n.y}%` }} aria-hidden="true">{i + 1}</span>)}
          </div>
          <figcaption>A real listing on Google Maps, for a business whose website I built.</figcaption>
        </figure>
      ) : null}
      <ol className="gbp-notes">
        {NOTES.map((n) => <li key={n.title}><strong>{n.title}</strong><span>{n.text}</span></li>)}
      </ol>
    </div>
  );
}
