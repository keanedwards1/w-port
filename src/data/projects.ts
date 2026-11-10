export type WorkTag = 'Build' | 'Edits and upkeep' | 'Migration' | 'Email and social' | 'SEO';
export const workTags: WorkTag[] = ['Build', 'Edits and upkeep', 'Migration', 'Email and social', 'SEO'];

export interface Project {
  slug: string;
  name: string;
  kind: string;
  url: string;
  image: string;
  summary: string;
  tags: WorkTag[];
  marin?: boolean;
  nonprofit?: boolean;
  experiment?: boolean;
  /** Listed on kean-edwards.com with no description, so not counted as client work until Kean confirms it. */
  unconfirmed?: boolean;
  /** Projects with a case page. */
  caseStudy?: { did: string[]; quote?: string };
}

const img = (name: string) => `/images/projects/${name}.webp`;

export const projects: Project[] = [
  {
    slug: 'sustainable-marin', name: 'Sustainable Marin', kind: 'Nonprofit', url: 'https://sustainablemarin.org/', image: img('sustainable-marin'),
    summary: 'Moved the site to new hosting with no downtime, and replaced the donation system that 7 nonprofits rely on.',
    tags: ['Migration', 'Edits and upkeep'], marin: true, nonprofit: true,
    caseStudy: {
      did: [
        'Moved the site from its old location to Bluehost with no downtime.',
        'Moved the old donation system to a new one. Seven nonprofits rely on it.',
        'Helped with the donations database and other data needs.',
        'Set up ticketing for special events.',
        'Completed a site upgrade on the platform they asked for.',
      ],
      quote: 'wendi-platform',
    },
  },
  {
    slug: 'dark-sky-west-marin', name: 'Dark Sky West Marin', kind: 'Nonprofit', url: 'https://darkskywestmarin.com/', image: img('dark-sky'),
    summary: 'Ongoing website updates, plus the group’s email system and its Facebook and Instagram.',
    tags: ['Edits and upkeep', 'Email and social'], marin: true, nonprofit: true,
    caseStudy: {
      did: [
        'Update the website on an ongoing basis.',
        'Manage and update the central email system.',
        'Look after Facebook and Instagram.',
        'Review existing systems, troubleshoot problems, and suggest what to do next.',
      ],
      quote: 'laura',
    },
  },
  {
    slug: 'sarah-spector', name: 'Sarah Spector', kind: 'Artist portfolio', url: 'https://sarahspector.com', image: img('sarah-spector'),
    summary: 'Rebuilt a Canadian artist’s portfolio and moved it off Squarespace. Her only running cost now is $12 a year for the domain, down from about $200.',
    tags: ['Build', 'Migration'],
    caseStudy: {
      did: [
        'Rebuilt the portfolio as a custom site.',
        'Moved it off Squarespace.',
        'Cut her running costs from about $200 a year to $12, the cost of the domain.',
      ],
      quote: 'sarah',
    },
  },
  {
    slug: 'venturepad', name: 'VenturePad', kind: 'Coworking space', url: 'https://www.venturepad.works/', image: img('venturepad'),
    summary: 'Three years of work on an environmentally focused coworking space: simpler pages, better images, new content.',
    tags: ['Build', 'Edits and upkeep', 'SEO'], marin: true,
    caseStudy: {
      did: [
        'Redesigned the website.',
        'Worked with them over 3 years to cut complexity, improve image quality, and add new pages.',
        'Maintained newsletters, pages, and SEO.',
      ],
    },
  },
  {
    slug: 'rock-steady-fest', name: 'Rock Steady Fest', kind: 'Festival', url: 'https://rocksteadyfest.org', image: img('rock-steady-fest'),
    summary: 'Built the festival’s website and campaigned the county, which secured $4,000 in funding.',
    tags: ['Build'],
    caseStudy: {
      did: [
        'Worked with Jeffrey Trotter to set up the festival’s website.',
        'Campaigned the county and secured $4,000 in funding for the festival.',
      ],
    },
  },
  {
    slug: 'golden-island-massage', name: 'Golden Island Massage', kind: 'Local business', url: 'https://www.goldenislandmassagesanrafael.com/', image: img('golden-island'),
    summary: 'Two websites for Tony’s two spa locations, with search setup, Google Analytics, and Search Console. This was my first official project.',
    tags: ['Build', 'SEO'], marin: true,
    caseStudy: {
      did: [
        'Built two websites, one for each of Tony’s two spa locations.',
        'Set up the pages for search.',
        'Connected Google Analytics and Google Search Console.',
      ],
    },
  },
  {
    slug: 'geronimo-woodworks', name: 'Geronimo Woodworks', kind: 'Woodworker', url: 'https://www.geronimowoodworks.com/', image: img('geronimo-woodworks'),
    summary: 'A custom site built over months with Michael and Denise to show his furniture and woodwork properly.',
    tags: ['Build'], marin: true,
  },
  {
    slug: 'all-star-organics', name: 'All Star Organics', kind: 'West Marin farm business', url: 'https://allstarorganics.com', image: img('all-star-organics'),
    summary: 'Site updates, newsletters, and anything else that comes up, for Janet, a longtime West Marin figure in farming and the environment.',
    tags: ['Edits and upkeep', 'Email and social', 'SEO'], marin: true,
  },
  {
    slug: 'wisdom-trust', name: 'Wisdom Trust', kind: 'Nonprofit', url: 'https://thewisdomtrust.live', image: img('wisdom-trust'),
    summary: 'A website for the launch of the book Hello My Darling: A Tribute to Ethel Seiderman.',
    tags: ['Build'], nonprofit: true, marin: true,
  },
  {
    slug: 'painted-bins', name: 'Painted Bins', kind: 'Community project', url: 'https://paintedbins.org', image: img('painted-bins'),
    summary: 'I manage the backend system Painted Bins uses to run fundraisers and donations, and update the site as needed.',
    tags: ['Build'], nonprofit: true,
  },
  {
    slug: 'life-is-change', name: 'Life Is Change', kind: 'Nonprofit', url: 'https://lifeischange.vercel.app', image: img('life-is-change'),
    summary: 'Moved Richard’s site from plain HTML, CSS, and JavaScript to a modern framework. The work is ongoing.',
    tags: ['Build', 'Migration'], nonprofit: true,
  },
  {
    slug: 'civic-knit', name: 'Civic Knit', kind: 'Organization', url: 'https://civicknit.com', image: img('civic-knit'),
    summary: 'A website for an organization founded by Steve Kinsey to help settle disputes between counties and residents, now carried on by Breeze Kinsey.',
    tags: ['Build'], marin: true,
  },
  {
    slug: 'dave-and-howie', name: 'Dave & Howie', kind: 'Campaign site', url: 'https://www.daveandhowie.com/', image: img('dave-and-howie'),
    summary: 'An overhaul of Dave and Howie’s site, with new content for Dave’s school board campaign.',
    tags: ['Edits and upkeep'], marin: true,
  },
  {
    slug: 'emily-murotake', name: 'Emily Murotake', kind: 'Portfolio', url: 'https://www.emilymurotake.com/', image: img('emily-murotake'),
    summary: 'A portfolio site for a director, actor, writer, producer, and editor.',
    tags: ['Build'],
  },
  {
    slug: 'denise-lussier', name: 'Denise Lussier', kind: 'Artist portfolio', url: 'https://deniselussier.com', image: img('denise-lussier'),
    summary: 'An artist’s website, designed with Denise to her specifications.',
    tags: ['Build'],
  },
  {
    slug: 'aninha-livingstone', name: 'Aninha Livingstone', kind: 'Private practice', url: 'https://aninhalivingstone.com/', image: img('aninha-livingstone'),
    summary: 'Simple updates to the website for Aninha’s practice.',
    tags: ['Edits and upkeep'],
  },
  {
    slug: 'island-massage', name: 'Island Massage', kind: 'Local business', url: 'https://islandmassagesanrafael.com', image: img('island-massage'),
    summary: 'The website for the second of Tony’s two spa locations. See Golden Island Massage.',
    tags: ['Build'], marin: true,
  },
  {
    slug: 'wm-guillermo', name: 'Wm Guillermo Ortiz', kind: 'Practice', url: 'https://wmguillermo.com/', image: img('wm-guillermo'),
    summary: 'A website for William’s work in curanderismo, tai chi ch’uan, movement, and ministry in the East Bay.',
    tags: ['Build'],
  },
  {
    slug: 'the-gentle-soul', name: 'The Gentle Soul', kind: 'Wellness', url: 'https://thegentlesoul.com', image: img('the-gentle-soul'),
    summary: 'A website for Christine, to help people find their way through assisted living.',
    tags: ['Build'],
  },
  {
    slug: 'casa-savasana', name: 'Casa Savasana', kind: 'Website', url: 'https://casasavasana.com', image: img('casa-savasana'),
    summary: 'A website for Casa Savasana.',
    tags: ['Build'],
  },
  {
    slug: 'plain-terms', name: 'Plain Terms', kind: 'My own tool', url: 'https://www.plainterms.us/', image: img('plain-terms'),
    summary: 'A contract analysis tool, and the most complex project I’ve built so far.',
    tags: ['Build'], experiment: true,
  },
  {
    slug: 'marqueekit', name: 'MarqueeKit', kind: 'My own tool', url: 'https://www.marqueekit.com', image: img('marqueekit'),
    summary: 'My first solo project, with written documentation and an animated demo page.',
    tags: ['Build'], experiment: true,
  },
  {
    slug: 'logominter', name: 'LogoMinter', kind: 'My own tool', url: 'https://logominter.vercel.app', image: img('logominter'),
    summary: 'A logo maker that turns a short description into an original logo.',
    tags: ['Build'], experiment: true,
  },
];

export const clientProjects = projects.filter((p) => !p.experiment && !p.unconfirmed);
export const caseStudies = projects.filter((p) => p.caseStudy);
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
