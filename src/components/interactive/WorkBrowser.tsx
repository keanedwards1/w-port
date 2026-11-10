import { useState } from 'react';
import { projects, workTags, type WorkTag } from '../../data/projects';
import { ProjectCard } from '../sections/Blocks';

export function WorkBrowser() {
  const [tag, setTag] = useState<WorkTag | 'All'>('All');
  const shown = projects.filter((p) => tag === 'All' || p.tags.includes(tag));
  return (
    <>
      <div className="chips" role="group" aria-label="Filter work">
        {(['All', ...workTags] as const).map((t) => (
          <button key={t} type="button" aria-pressed={tag === t} className={tag === t ? 'on' : ''} onClick={() => setTag(t)}>{t}</button>
        ))}
      </div>
      <p className="count" aria-live="polite">{shown.length} projects</p>
      <div className="work-grid" key={tag}>
        {shown.map((p) => <div className="rise" key={p.slug}><ProjectCard project={p} level={2} /></div>)}
      </div>
    </>
  );
}
