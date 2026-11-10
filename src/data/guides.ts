export interface Guide {
  slug: string;
  title: string;
  description: string;
  service: string;
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
  sources: { label: string; href: string }[];
}

export const guides: Guide[] = [
  {
    slug: 'fix-your-google-business-profile',
    title: 'How to fix your Google Business Profile',
    description: 'What to check on your Google listing, in order, and what to do about reviews you think break the rules.',
    service: 'google-business-profile',
    sections: [
      { heading: 'Make sure you own the listing', paragraphs: ['Search for your business name on Google while signed in to the account you use for the business. If you manage the listing, you will see tools to edit it. If you do not, look for the link to claim it and follow the steps to verify.'] },
      { heading: 'Check these first', paragraphs: ['Most listings need the same few fixes. Work down this list.'], list: ['Business name: your real name, with no extra keywords added.', 'Primary category: the one that best describes what you do.', 'Hours, including holidays.', 'Phone number and website address.', 'Services, written the way customers say them.', 'Photos of your work, your place, and your team.'] },
      { heading: 'Ask for reviews the simple way', paragraphs: ['Your profile gives you a link you can send to customers. Turn it into a QR code for the counter or a receipt. Ask everyone, and do not offer anything in return, because Google does not allow incentives for reviews.'] },
      { heading: 'Dealing with a review that breaks the rules', paragraphs: ['Google removes reviews that break its policies. Disliking a review is not enough. You can report a review from your profile or through the Reviews Management Tool, which shows the status of your report. Google says the check can take several days. If the review stays up, you can appeal once.', 'For a fair review you do not like, write a short and calm reply. Other customers read those replies.'] },
    ],
    sources: [{ label: 'Google: Report inappropriate reviews on your Business Profile', href: 'https://support.google.com/business/answer/4596773?hl=en' }],
  },
  {
    slug: 'spf-dkim-dmarc',
    title: 'What SPF, DKIM, and DMARC do',
    description: 'Three email records explained in plain English, and which ones Gmail requires.',
    service: 'email-management',
    sections: [
      { heading: 'Why they exist', paragraphs: ['Anyone can write any address in the From line of an email. These three records, stored with your domain, help other mail servers tell whether a message really came from you.'] },
      { heading: 'What each one does', paragraphs: ['Each record does a different job.'], list: ['SPF lists the servers allowed to send email for your domain.', 'DKIM adds a digital signature to each message, so the receiver can check it was not changed.', 'DMARC tells receivers what to do when a message fails those checks, and can send you reports.'] },
      { heading: 'What Gmail requires', paragraphs: ['Gmail requires anyone sending to Gmail accounts to use SPF or DKIM. If you send about 5,000 or more messages a day to Gmail accounts, you need SPF, DKIM, and DMARC together.', 'Most small businesses are nowhere near 5,000 a day. I still set up all three, because they take little effort and they protect your domain from being used by someone else.'] },
      { heading: 'How to check yours', paragraphs: ['My free Site Check looks up your SPF and DMARC records and tells you whether they exist. It also looks for DKIM under common names, but it can miss one with an unusual name, so a missing result there is not proof that you do not have it.'] },
    ],
    sources: [{ label: 'Google: Email sender guidelines', href: 'https://support.google.com/mail/answer/81126?hl=en' }],
  },
  {
    slug: 'what-is-geo',
    title: 'What GEO is, and what it isn’t',
    description: 'A plain explanation of generative engine optimization for small businesses, based on what Google has actually said.',
    service: 'ai-seo',
    sections: [
      { heading: 'What it means', paragraphs: ['GEO stands for generative engine optimization. It means making your business easy for AI tools to find and describe correctly, in places like Google’s AI answers and ChatGPT.'] },
      { heading: 'What Google says', paragraphs: ['Google’s guidance is simple. To appear as a link in its AI features, a page needs to be indexed and eligible to show in Search with a snippet. Google says there are no extra technical requirements, no special AI files, and no special structured data needed.', 'So the normal work still applies: let search engines crawl your site, link your pages together, and keep important content in text.'] },
      { heading: 'What is worth doing', paragraphs: ['For a small business, this comes down to being clear and consistent.'], list: ['Say plainly what you do, where, and for whom.', 'Answer common questions on your site in plain text.', 'Make your name, address, phone, and hours match everywhere.', 'Keep your Google Business Profile accurate.', 'Keep structured data in place, since it still helps with normal search results.'] },
      { heading: 'What to be careful of', paragraphs: ['Be wary of anyone selling a secret method. AI tools decide for themselves what to say, and their answers change. Accurate, consistent information is what you can control.'] },
    ],
    sources: [
      { label: 'Google: AI features and your website', href: 'https://developers.google.com/search/docs/appearance/ai-features' },
      { label: 'Google: Optimizing for generative AI features', href: 'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide' },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
