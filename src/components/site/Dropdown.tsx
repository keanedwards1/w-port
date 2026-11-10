import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { NavItem } from '../../data/nav';
import { A } from '../ui/A';
import { Icon } from '../ui/Icon';

interface Props {
  item: NavItem;
  open: boolean;
  current: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const HOVER_DELAY = 120;

/** A directory link with a separate dropdown toggle. */
export function Dropdown({ item, open, current, onOpen, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const wide = (item.groups?.length ?? 0) > 1;
  const hoverable = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const later = (fn: () => void) => {
    window.clearTimeout(timer.current);
    if (hoverable()) timer.current = window.setTimeout(fn, HOVER_DELAY);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const links = () => Array.from(root.current?.querySelectorAll<HTMLAnchorElement>('.drop-panel a') ?? []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) { e.stopPropagation(); onClose(); button.current?.focus(); return; }
    const list = links();
    const at = list.indexOf(document.activeElement as HTMLAnchorElement);
    const focus = (i: number) => { e.preventDefault(); list[(i + list.length) % list.length]?.focus(); };
    if (e.key === 'ArrowDown') {
      if (!open) { e.preventDefault(); onOpen(); window.requestAnimationFrame(() => links()[0]?.focus()); return; }
      focus(at + 1);
    } else if (e.key === 'ArrowUp' && open) focus(at <= 0 ? list.length - 1 : at - 1);
    else if (e.key === 'Home' && open) focus(0);
    else if (e.key === 'End' && open) focus(list.length - 1);
  };

  return (
    <div
      ref={root}
      className={`drop${open ? ' open' : ''}${wide ? ' drop-wide' : ''}`}
      onPointerEnter={() => later(onOpen)}
      onPointerLeave={() => later(onClose)}
      onKeyDown={onKey}
      onBlur={(e) => { if (open && e.relatedTarget && !root.current?.contains(e.relatedTarget as Node)) onClose(); }}
    >
      <div className="drop-trigger">
        <A to={item.to!} className={`nav-link${current ? ' current' : ''}`} onClick={() => { window.clearTimeout(timer.current); onClose(); }}>
          {item.label}
        </A>
      <button
        ref={button}
        type="button"
        className="drop-toggle"
        aria-label={`Toggle ${item.label} menu`}
        aria-expanded={open}
        aria-controls={`panel-${item.label}`}
        onClick={() => { window.clearTimeout(timer.current); if (open) onClose(); else onOpen(); }}
      >
        <Icon name="chevron" size={15} />
      </button>
      </div>
      <div id={`panel-${item.label}`} className="drop-panel" hidden={!open}>
        <div className="drop-columns">
          {item.groups?.map((g) => (
            <div key={g.label} className="drop-group">
              {wide && <p className="drop-label">{g.label}</p>}
              <ul>{g.links.map((l) => <li key={l.to}><A to={l.to} onClick={onClose}>{l.label}</A></li>)}</ul>
            </div>
          ))}
          {item.aside && (
            <div className="drop-aside">
              <p className="drop-aside-title">{item.aside.title}</p>
              <p>{item.aside.text}</p>
              <A to={item.aside.link.to} className="text-link" onClick={onClose}>{item.aside.link.label}<Icon name="arrow" size={16} /></A>
            </div>
          )}
        </div>
        {item.footerLink && <A to={item.footerLink.to} className="drop-foot" onClick={onClose}>{item.footerLink.label}<Icon name="arrow" size={16} /></A>}
      </div>
    </div>
  );
}
