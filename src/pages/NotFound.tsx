import { Seo } from '../lib/seo';
import { PageHead } from '../components/sections/Blocks';
import { ProblemPicker } from '../components/interactive/ProblemPicker';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page doesn’t exist." path="/404" noindex />
      <PageHead kicker="404" title="That page isn’t here.">
        <p>It may have moved, or the link may be wrong. Here’s where most people want to go.</p>
      </PageHead>
      <section className="section-tight wrap row">
        <Button to="/">Home</Button>
        <Button to="/services" kind="secondary">Services</Button>
        <Button to="/contact" kind="secondary">Contact</Button>
      </section>
      <section className="section wrap"><ProblemPicker /></section>
    </>
  );
}
