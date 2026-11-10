/**
 * Real words from real people. Exact quotes only.
 * Delete an entry to remove it from every page.
 */
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  /** The question this quote answers in the Ask section. */
  question: string;
  /** Short version, used in the Ask section and on service pages. */
  quote: string;
  /** Longer version for the reviews page. */
  long: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'sarah', name: 'Sarah Spector', role: 'Healer / Artist', question: 'Is he any good?',
    quote: 'He is the all-around best web designer I’ve worked with in the last 25 years.',
    long: 'He’s now built me several sites. He always goes above and beyond what I’m expecting. He is the all-around best web designer I’ve worked with in the last 25 years. He worked closely with me every step of the way and produced EXCELLENCE.',
  },
  {
    id: 'michelle', name: 'Michelle Simonson', role: 'Website client', question: 'I’m not good with tech. Is that a problem?',
    quote: 'He does a better job of making it easy than any tech-support person I’ve ever encountered!',
    long: 'I want to give the highest possible recommendation to Kean Edwards for website design/technical assistance. Especially if you happen to be bewildered and hugely stressed out by technology! He is incredibly smart, efficient, patient, kind, warm, encouraging, and offers timely responses to all questions. He does a better job of making it easy than any tech-support person I’ve ever encountered!',
  },
  {
    id: 'wendi-quick', name: 'Wendi Kallins', role: 'President, Sustainable Marin', question: 'Does he get things done?',
    quote: 'He is quick, reliable and thorough in his work.',
    long: 'Kean has been consulting with us for the last year and has been invaluable in helping us with our web site, donations database, and other data needs. He is quick, reliable and thorough in his work. With his assistance we have been able to keep our web site up to date and has provided special services such as setting up ticketing for special events.',
  },
  {
    id: 'wendi-platform', name: 'Wendi Kallins', role: 'President, Sustainable Marin', question: 'Will he work the way I want?',
    quote: 'Even when we requested using a platform for our web site that was not his preference, he was able to complete an upgrade without a hitch.',
    long: '',
  },
  {
    id: 'laura', name: 'Laura Arndt', role: 'Chair, Dark Sky West Marin', question: 'Is he easy to deal with?',
    quote: 'Kean is easy to work with, and very good at understanding key issues across varied stakeholders.',
    long: 'He has helped support the organization in management of our website, updating our email system, and helping to optimize our social media across Facebook and Instagram. Kean has been a much needed digital subject matter expert. Kean is easy to work with, and very good at understanding key issues across varied stakeholders.',
  },
  {
    id: 'megan', name: 'Megan McFeely-Wong', role: 'Website client', question: 'What does he cost?',
    quote: 'This guy is a joy to work with.',
    long: 'He is upgrading my ancient website. This guy is a joy to work with.... He is not too expensive but please do pay his hourly rate.',
  },
  {
    id: 'dave-howie', name: 'Dave and Howie Cort', role: 'San Geronimo Valley', question: 'What’s he like?',
    quote: 'We have been consistently impressed by his creativity, communication skills, and commitment to our community.',
    long: 'Through both our professional and personal roles here in the San Geronimo Valley, we have had the opportunity to work with Kean on web design, social media, and marketing, and we have been consistently impressed by his creativity, communication skills, and commitment to our community.',
  },
];

export const testimonialById = (id: string) => testimonials.find((t) => t.id === id);
