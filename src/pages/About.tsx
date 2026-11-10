import { Directory } from '../components/sections/Directory';
import { PageShell } from '../components/sections/Blocks';

export function About() {
  return <Directory section="About" description="Get to know me, read client reviews, and explore my work with local businesses and nonprofits." />;
}

export function AboutMe() {
  return <PageShell title="About me" description="About Kean Edwards." path="/about/me" />;
}
