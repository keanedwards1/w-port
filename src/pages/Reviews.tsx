import { Seo } from '../lib/seo';
import { testimonials } from '../data/testimonials';
import { PageHead, Quote } from '../components/sections/Blocks';
import { LeadButton } from '../components/lead/EmailStart';

export function Reviews() {
  const seen = new Set<string>();
  const people = testimonials.filter((t) => t.long && !seen.has(t.name) && seen.add(t.name));
  return (
    <>
      <Seo title="Reviews" description="What clients say about working with Kean Edwards, in their own words." path="/reviews" />
      <PageHead kicker="Reviews" title="In their own words.">
        <p>These are from people I’ve worked with.</p>
      </PageHead>
      <section className="section-tight wrap reviews">
        {people.map((t) => <Quote key={t.id} id={t.id} long />)}
      </section>
      <section className="section-tight wrap row" data-reveal><LeadButton source="reviews">Hire me</LeadButton></section>
    </>
  );
}
