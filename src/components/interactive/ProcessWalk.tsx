import { useState } from 'react';
import { process, type JobKind } from '../../data/process';
import { contactLink } from '../../lib/lead';
import { Button } from '../ui/Button';

export function ProcessWalk() {
  const [kind, setKind] = useState<JobKind>('small');
  const [at, setAt] = useState(0);
  const job = process[kind];
  const stop = job.stops[at];
  const last = at === job.stops.length - 1;
  return (
    <div className="walk">
      <div className="chips" role="group" aria-label="Type of job">
        {(Object.keys(process) as JobKind[]).map((k) => (
          <button key={k} type="button" aria-pressed={k === kind} className={k === kind ? 'on' : ''} onClick={() => setKind(k)}>{process[k].label}</button>
        ))}
      </div>
      <div className="walk-line" style={{ '--at': at / (job.stops.length - 1) } as React.CSSProperties}>
        <input type="range" min="0" max={job.stops.length - 1} step="1" value={at} onChange={(e) => setAt(Number(e.target.value))} aria-label="Step" aria-valuetext={`Step ${at + 1} of ${job.stops.length}: ${stop.title}`} />
        <ol>
          {job.stops.map((s, i) => (
            <li key={s.title}>
              <button type="button" className={i <= at ? 'on' : ''} onClick={() => setAt(i)} aria-current={i === at ? 'step' : undefined}>
                <i aria-hidden="true" /><span>{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="walk-card" key={`${kind}${at}`}>
        <div className="walk-title"><h3>{stop.title}</h3><p>{stop.when}</p></div>
        <dl>
          <div><dt>What you do</dt><dd>{stop.you}</dd></div>
          <div><dt>What I do</dt><dd>{stop.me}</dd></div>
          <div><dt>What you have</dt><dd>{stop.have}</dd></div>
        </dl>
        {last && <Button to={contactLink({ source: 'process' })} arrow>Start with a message</Button>}
      </div>
    </div>
  );
}
