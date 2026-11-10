import { useState } from 'react';
import { problems } from '../../data/problems';
import { money, priceById, priceLabel } from '../../data/prices';
import { contactLink } from '../../lib/lead';
import { liveOffers } from '../../lib/offers';
import { useNow } from '../../lib/hooks';
import { A } from '../ui/A';
import { Button, TextLink } from '../ui/Button';

export function ProblemPicker() {
  const [id, setId] = useState(problems[0].id);
  const p = problems.find((x) => x.id === id) ?? problems[0];
  const now = useNow();
  const sale = liveOffers(now).find((o) => o.priceId === p.priceId && o.salePrice != null);
  return (
    <div className="picker">
      <div className="picker-list" role="radiogroup" aria-label="What’s wrong?">
        {problems.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={x.id === id} className={x.id === id ? 'on' : ''} onClick={() => setId(x.id)}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="picker-result" key={p.id} aria-live="polite">
        <p className="kicker">The fix</p>
        <p className="picker-fix">{p.fix}</p>
        <p className="picker-price">
          <strong>{sale ? money(sale.salePrice as number) : priceLabel(p.priceId)}</strong>
          <span>{priceById(p.priceId).name}{sale && `, regular price ${priceLabel(p.priceId)}, through ${sale.endsLabel}`}</span>
        </p>
        <div className="row">
          <Button to={contactLink({ need: p.label, source: 'picker' })}>Fix this</Button>
          <TextLink to={`/services/${p.service}`}>How I do it</TextLink>
        </div>
      </div>
      <span className="sr-only"><A to="/services">All services</A></span>
    </div>
  );
}
