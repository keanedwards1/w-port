import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon';
import { testimonialById } from '../../data/testimonials';
import type { Project } from '../../data/projects';
import { Seo } from '../../lib/seo';
import { LeadButton } from '../lead/EmailStart';

export const PageHead = ({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) => (
  <header className="page-head wrap">
    {kicker && <p className="kicker">{kicker}</p>}
    <h1>{title}</h1>
    {children && <div className="lede">{children}</div>}
  </header>
);

export const SectionHead = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="section-head" data-reveal>
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </div>
);

export function Quote({ id, long }: { id: string; long?: boolean }) {
  const t = testimonialById(id);
  if (!t) return null;
  return (
    <figure className="quote" data-reveal>
      <blockquote>“{long && t.long ? t.long : t.quote}”</blockquote>
      <figcaption><strong>{t.name}</strong><span>{t.role}</span></figcaption>
    </figure>
  );
}

export function ProjectCard({ project, cta = true, large = false, level = 3 }: { project: Project; cta?: boolean; large?: boolean; level?: 2 | 3 }) {
  const Title = level === 2 ? 'h2' : 'h3';
  const inner = (
    <>
      <span className="frame-bar" aria-hidden="true"><i /><i /><i /></span>
      <img src={project.image.replace('.webp', '-full.webp')} alt={`${project.name} website`} loading="lazy" width="1000" height="625" />
    </>
  );
  return (
    <article className={`project${large ? ' project-large' : ''}`}>
      <a href={project.url} className="frame" target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name}`}>{inner}</a>
      <div className="project-text">
        <p className="project-kind">{project.kind}</p>
        <Title className="project-name">{project.name}</Title>
        <p>{project.summary}</p>
        {cta && <LeadButton source={`work:${project.slug}`} className="text-link">Want something like this?<Icon name="arrow" size={16} /></LeadButton>}
      </div>
    </article>
  );
}

export const Ticks = ({ items }: { items: readonly string[] }) => (
  <ul className="ticks">{items.map((i) => <li key={i}><Icon name="check" size={18} />{i}</li>)}</ul>
);

/** A page whose content has been cleared. Keeps its address, menu item, and title. */
export const PageShell = ({ title, description, path, noindex }: { title: string; description: string; path: string; noindex?: boolean }) => (
  <>
    <Seo title={title} description={description} path={path} noindex={noindex} />
    <header className="page-head wrap"><h1>{title}</h1></header>
  </>
);
