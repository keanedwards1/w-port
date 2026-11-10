/** Business facts in one place. Change them here and they change everywhere. */
export const site = {
  name: 'Kean Edwards',
  url: (import.meta.env?.VITE_SITE_URL as string | undefined) ?? 'https://keanedwards.com',
  description: 'Kean Edwards is a freelancer in West Marin who builds, fixes, hosts, and looks after websites, Google Business Profiles, and email for small businesses and nonprofits.',
  phone: '415-930-2468',
  phoneHref: 'tel:+14159302468',
  smsHref: 'sms:+14159302468',
  email: 'keanedwards1@gmail.com',
  emailHref: 'mailto:keanedwards1@gmail.com',
  area: 'West Marin, and remote',
  town: 'Lagunitas, California',
  hours: 'Weekdays, 9 to 5 Pacific',
  office: { open: 9, close: 17 },
  reply: 'I reply within 1 business day.',
  formEndpoint: 'https://formsubmit.co/ajax/0ea3396f716895f8fe3716200c35118b',
  /** Paste a Cal.com or Calendly link and a "Pick a time" button appears on the contact page. */
  bookingUrl: '',
  /** Add { label: 'Instagram', href: 'https://...' } and it appears in the footer. */
  socials: [] as { label: string; href: string }[],
  /**
   * Real screenshots only. Put them in public/images/google-profile/ and set the paths here.
   * With before and after set, the slider turns on. With only after set, the annotated view shows.
   */
  googleProfile: { before: '', after: '', listing: '/images/google-profile/listing.webp' },
} as const;
