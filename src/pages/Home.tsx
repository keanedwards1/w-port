import { Seo } from '../lib/seo';
import { site } from '../data/site';
import { clientProjects, projectBySlug, type Project } from '../data/projects';
import { ServiceIndex } from '../components/interactive/ServiceIndex';
import { QuoteRibbon } from '../components/interactive/QuoteRibbon';
import { EmailStart } from '../components/lead/EmailStart';
import { A } from '../components/ui/A';
import { Statements } from '../components/home/Statements';

/** What each featured site is, in a word or two. */
const WHAT: Record<string, string> = {
  'painted-bins': 'Nonprofit',
  marqueekit: 'Web tool',
  'emily-murotake': 'Filmmaker',
  'sarah-spector': 'Artist',
};

const WORK = ['painted-bins', 'marqueekit', 'emily-murotake', 'sarah-spector']
  .map(projectBySlug).filter((p): p is Project => !!p);

/** Four real sites. Pointing at one scrolls through the whole page, top to bottom. */
function SelectedWork() {
  return (
    <section className="wrap block" data-tone-shift>
      <h2 className="block-title work-title" data-reveal>Selected work</h2>
      <ul className="shelf">
        {WORK.map((p, i) => (
          <li key={p.slug} data-reveal style={{ '--i': i % 2 } as React.CSSProperties}>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="shelf-item">
              <span className="shelf-frame">
                <img src={p.image.replace('.webp', '-full.webp')} width="1000" height="2813" alt={`The ${p.name} website`} loading="lazy" />
              </span>
              <span className="shelf-name">{p.name}</span>
              <span className="shelf-kind">{WHAT[p.slug] ?? p.kind}</span>
            </a>
          </li>
        ))}
      </ul>
      <A to="/work" className="shelf-all" data-reveal>See all {clientProjects.length} client sites</A>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Seo title="Kean Edwards | Websites, Google profiles, and email in West Marin" description={site.description} path="/" />
      <section className="hero2">
        <div className="hero2-center">
          <h1>I build websites, fix them, and keep them running.</h1>
          <EmailStart source="hero" tone="line" />
        </div>
      </section>
      <Statements />
      <SelectedWork />
      <section className="wrap block">
        <h2 className="block-title" data-reveal>What I do</h2>
        <div data-reveal><ServiceIndex /></div>
      </section>
      <section className="block">
        <h2 className="block-title wrap" data-reveal>Testimonials</h2>
        <div data-reveal><QuoteRibbon /></div>
      </section>
    </>
  );
}
