import { useEffect, useState } from 'react';
import { site } from '../data/site';

/** Starts at build time so server and client HTML match, then moves to the real time. */
export function useNow() {
  const [now, setNow] = useState<number>(__BUILD_TIME__);
  useEffect(() => { setNow(Date.now()); }, []);
  return now;
}

const parts = (d: Date) => Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(d).map((p) => [p.type, p.value]));

export function isOpen(d: Date) {
  const p = parts(d);
  const hour = Number(p.hour) % 24;
  return !['Sat', 'Sun'].includes(p.weekday) && hour >= site.office.open && hour < site.office.close;
}

/** Live Pacific time. Null until the page is running in a browser. */
export function useClock() {
  const [state, setState] = useState<{ time: string; open: boolean } | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setState({ time: d.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' }), open: isOpen(d) });
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return state;
}

/** Fades in anything marked data-reveal as it scrolls into view, including anything added to the page later. */
export function useReveal(key: string) {
  useEffect(() => {
    document.documentElement.dataset.ready = 'true';
    const pending = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window)) { pending().forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    pending().forEach((el) => io.observe(el));
    const mo = new MutationObserver(() => pending().forEach((el) => io.observe(el)));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [key]);
}
