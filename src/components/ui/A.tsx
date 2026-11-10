import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal link with a short crossfade between pages. */
export function A({ to, onClick, children, ...rest }: Props) {
  const navigate = useNavigate();
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!motion || !document.startViewTransition) return;
    e.preventDefault();
    document.startViewTransition(() => { flushSync(() => navigate(to)); });
  };
  return <Link to={to} onClick={go} {...rest}>{children}</Link>;
}
