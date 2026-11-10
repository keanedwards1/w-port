import { Seo } from '../lib/seo';
import { projects } from '../data/projects';
import { offers } from '../data/offers';
import { PageHead, PageShell, ProjectCard, Quote, SectionHead, Ticks } from '../components/sections/Blocks';
import { LeadButton } from '../components/lead/EmailStart';

export function Marin() {
  return <PageShell title="Marin County" description="Kean Edwards in Marin County." path="/marin" />;
}

export function Nonprofits() {
  const list = projects.filter((p) => p.nonprofit);
  const rate = offers.find((o) => o.id === 'nonprofit-rate');
  return (
    <>
      <Seo title="Websites for nonprofits" description="Kean Edwards builds and looks after websites, donation systems, and email for nonprofits, with 15% off site builds for registered nonprofits." path="/nonprofits" />
      <PageHead kicker="Nonprofits" title="Websites, donations, and email for nonprofits.">
        <p>I work with volunteer-run groups and small nonprofits, where nobody has time to look after the website. {rate?.deal}, for registered nonprofits.</p>
      </PageHead>
      <section className="section-tight wrap row" data-reveal><LeadButton source="nonprofits">Hire me</LeadButton></section>
      <section className="section wrap two-col">
        <div>
          <SectionHead title="What I’ve done for nonprofits" />
          <div data-reveal><Ticks items={['Moved sites to new hosting with no downtime', 'Replaced a donation system', 'Set up event ticketing', 'Managed a shared email system', 'Looked after Facebook and Instagram', 'Kept websites up to date']} /></div>
        </div>
        <div data-reveal><Quote id="wendi-quick" /></div>
      </section>
      <section className="section wrap">
        <SectionHead title="Recent nonprofit work" />
        <div className="work-grid">{list.map((p) => <div key={p.slug} data-reveal><ProjectCard project={p} cta={false} /></div>)}</div>
      </section>
    </>
  );
}
