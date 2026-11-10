export type JobKind = 'small' | 'site';

export interface Stop { title: string; you: string; me: string; have: string; when: string }

export const process: Record<JobKind, { label: string; stops: Stop[] }> = {
  small: {
    label: 'A small job',
    stops: [
      { title: 'You get in touch', you: 'Tell me what needs fixing. A text is fine.', me: 'Read it and look at your site.', have: 'A reply from me.', when: 'Within 1 business day' },
      { title: 'I reply with a price', you: 'Read the estimate.', me: 'Tell you what I will do and how long it should take.', have: 'A price before any work starts.', when: 'Same reply' },
      { title: 'You say yes', you: 'Send me a login, or I walk you through an invite.', me: 'Put the job on my list.', have: 'A start date.', when: 'Same day' },
      { title: 'I do the work', you: 'Nothing. Carry on with your day.', me: 'Make the changes and check them on a phone and a computer.', have: 'The finished changes to look at.', when: 'Within 3 business days' },
      { title: 'You sign off', you: 'Look it over and tell me if anything is off.', me: 'Fix anything that is off and send the invoice.', have: 'The job done, and a record of what changed.', when: 'When you are happy' },
    ],
  },
  site: {
    label: 'A new site',
    stops: [
      { title: 'You get in touch', you: 'Tell me about your business and what the site needs to do.', me: 'Look at what you have now and set up a call if you want one.', have: 'A reply from me.', when: 'Within 1 business day' },
      { title: 'I reply with a price', you: 'Read the written quote.', me: 'List the pages, the price, and the dates.', have: 'A fixed price in writing.', when: 'After we talk' },
      { title: 'You say yes', you: 'Pay half and send your photos, logo, and notes.', me: 'Start on the design and the words.', have: 'A start date and a launch date.', when: 'Clock starts when I have your content' },
      { title: 'I build it and show you', you: 'Look at a private preview and send changes.', me: 'Build the pages, then make your changes.', have: 'A working preview you can open on your phone.', when: '2 to 4 weeks, depending on size' },
      { title: 'You sign off', you: 'Approve it and pay the second half.', me: 'Connect your domain, test the form, and go live.', have: 'A live site, and all your logins.', when: 'Launch day' },
    ],
  },
};
