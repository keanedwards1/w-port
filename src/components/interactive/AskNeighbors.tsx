import { useState } from 'react';
import { testimonials } from '../../data/testimonials';

/** Visitors pick a question, and someone who hired Kean answers it in their own words. */
export function AskNeighbors() {
  const [id, setId] = useState(testimonials[0]?.id);
  const t = testimonials.find((x) => x.id === id);
  if (!t) return null;
  return (
    <div className="ask">
      <div className="ask-list" role="radiogroup" aria-label="Pick a question">
        {testimonials.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={x.id === id} className={x.id === id ? 'on' : ''} onClick={() => setId(x.id)}>{x.question}</button>
        ))}
      </div>
      <figure className="ask-answer" key={t.id} aria-live="polite">
        <blockquote>“{t.quote}”</blockquote>
        <figcaption><strong>{t.name}</strong><span>{t.role}</span></figcaption>
      </figure>
    </div>
  );
}
