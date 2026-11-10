import { useRef, useState, type MouseEvent } from 'react';
import { services } from '../../data/services';
import { priceLabel } from '../../data/prices';
import { A } from '../ui/A';
import { Icon } from '../ui/Icon';

/** A plain list of services. Hovering a row shows real work. Tapping a row on a phone opens it. */
export function ServiceIndex() {
  const box = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const move = (e: MouseEvent) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect || !preview.current) return;
    preview.current.style.transform = `translate(${e.clientX - rect.left + 24}px, ${e.clientY - rect.top - 90}px)`;
  };

  const tap = (slug: string) => (e: MouseEvent) => {
    if (!window.matchMedia('(hover: none)').matches) return;
    e.preventDefault();
    setOpen(open === slug ? null : slug);
  };

  return (
    <div className="svc" ref={box} onMouseMove={move} onMouseLeave={() => setHover(null)}>
      <ol>
        {services.map((s, i) => (
          <li key={s.slug} className={open === s.slug ? 'open' : ''} onMouseEnter={() => setHover(s.slug)}>
            <A to={`/services/${s.slug}`} className="svc-row" onClick={tap(s.slug)} aria-expanded={undefined}>
              <span className="svc-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="svc-name">{s.name}</span>
              <span className="svc-line">{s.line}</span>
              <span className="svc-go"><Icon name="arrow" /></span>
            </A>
            {open === s.slug && (
              <div className="svc-more">
                <p>{s.line}</p>
                <p className="svc-price">{priceLabel(s.priceIds[0])}</p>
                <A to={`/services/${s.slug}`} className="text-link">See {s.nav}<Icon name="arrow" size={16} /></A>
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className={`svc-preview${hover ? ' on' : ''}`} ref={preview} aria-hidden="true">
        {services.map((s) => <img key={s.slug} src={s.image} alt="" loading="lazy" className={hover === s.slug ? 'on' : ''} />)}
      </div>
    </div>
  );
}
