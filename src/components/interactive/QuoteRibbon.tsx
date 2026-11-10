import { useRef } from 'react';
import { testimonialById } from '../../data/testimonials';

const PICKS = ['sarah', 'laura', 'michelle', 'wendi-quick', 'megan', 'dave-howie'];

/** A slow ribbon of quotes. Pointing at it slows it down, so a quote can be read. */
export function QuoteRibbon() {
  const track = useRef<HTMLDivElement>(null);
  const speed = (rate: number) => track.current?.getAnimations().forEach((a) => a.updatePlaybackRate(rate));
  const quotes = PICKS.map(testimonialById).filter((t) => !!t);
  const row = (copy: boolean) => quotes.map((q) => (
    <figure key={`${q.id}${copy ? '-2' : ''}`} className="ribbon-item" aria-hidden={copy || undefined}>
      <blockquote>“{q.quote}”</blockquote>
      <figcaption className="mono">{q.name}</figcaption>
    </figure>
  ));
  return (
    <div className="ribbon" onPointerEnter={() => speed(0.25)} onPointerLeave={() => speed(1)} onFocus={() => speed(0.25)} onBlur={() => speed(1)}>
      <div className="ribbon-track" ref={track}>{row(false)}{row(true)}</div>
    </div>
  );
}
