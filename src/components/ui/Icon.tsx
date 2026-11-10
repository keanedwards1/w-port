const paths = {
  phone: 'M6.6 3h2.6l1.4 3.8-1.9 1.5a11 11 0 0 0 5 5l1.5-1.9 3.8 1.4v2.6A2.1 2.1 0 0 1 16.9 18 13.9 13.9 0 0 1 4.5 5.1 2.1 2.1 0 0 1 6.6 3Z',
  menu: 'M3 6h14M3 10h14M3 14h14',
  close: 'M5 5l10 10M15 5L5 15',
  chevron: 'M5 8l5 5 5-5',
  arrow: 'M4 10h12M11 5l5 5-5 5',
  check: 'M4 10.5l4 4 8-9',
  info: 'M10 9v5M10 6v.5',
  fix: 'M10 4v7M10 14.5v.5',
  message: 'M3 5h14v9H8l-4 3v-3H3Z',
  mail: 'M3 5h14v10H3ZM3 6l7 5 7-5',
} as const;

export const Icon = ({ name, size = 20 }: { name: keyof typeof paths; size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={paths[name]} />
  </svg>
);
