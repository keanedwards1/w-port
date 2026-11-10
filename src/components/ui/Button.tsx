import type { ReactNode } from 'react';
import { A } from './A';
import { Icon } from './Icon';

export const Button = ({ to, children, kind = 'primary', arrow }: { to: string; children: ReactNode; kind?: 'primary' | 'secondary'; arrow?: boolean }) => (
  <A to={to} className={`btn btn-${kind}`}>{children}{arrow && <Icon name="arrow" size={18} />}</A>
);

export const TextLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <A to={to} className="text-link">{children}<Icon name="arrow" size={16} /></A>
);
