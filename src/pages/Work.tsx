import { Seo } from '../lib/seo';
import { clientProjects } from '../data/projects';
import { PageHead } from '../components/sections/Blocks';
import { WorkBrowser } from '../components/interactive/WorkBrowser';

export function Work() {
  return (
    <>
      <Seo title="Work" description="Websites, migrations, email systems, and search work by Kean Edwards for small businesses, nonprofits, and artists." path="/work" />
      <PageHead kicker="Work" title={`${clientProjects.length} client projects, and a few more.`}>
        <p>Filter by the kind of work you’re looking for. Most of these are live sites, so you can see them for yourself.</p>
      </PageHead>
      <section className="section-tight wrap"><WorkBrowser /></section>
    </>
  );
}
