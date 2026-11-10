import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { LeadModal } from './LeadModal';
import type { OfferKey } from './offerForms';

export interface LeadStart { source: string; email?: string; from?: HTMLElement | null; offer?: OfferKey }
const Ctx = createContext<(start: LeadStart) => void>(() => {});

/** Holds the two-step form. Anything on the site can open it. */
export function LeadProvider({ children }: { children: ReactNode }) {
  const [start, setStart] = useState<LeadStart | null>(null);

  const open = useCallback((s: LeadStart) => {
    const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!s.from || !motion || !document.startViewTransition) { setStart(s); return; }
    // The button grows into the form panel.
    s.from.style.viewTransitionName = 'lead-panel';
    document.startViewTransition(() => {
      if (s.from) s.from.style.viewTransitionName = '';
      flushSync(() => setStart(s));
    });
  }, []);

  const close = useCallback(() => setStart(null), []);

  return (
    <Ctx.Provider value={open}>
      {children}
      {start && <LeadModal start={start} onClose={close} />}
    </Ctx.Provider>
  );
}

export const useLead = () => useContext(Ctx);
