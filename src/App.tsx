import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Banner } from './components/site/Banner';
import { Header } from './components/site/Header';
import { Footer } from './components/site/Footer';
import { MobileBar } from './components/site/MobileBar';
import { AppRoutes } from './routes';
import { LeadProvider } from './components/lead/LeadContext';
import { Water } from './components/gl/Water';
import { useReveal } from './lib/hooks';

function useRouteChange() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else if (!first.current) {
      window.scrollTo(0, 0);
    }
    if (!first.current) document.getElementById('main')?.focus({ preventScroll: true });
    first.current = false;
  }, [pathname, hash]);
}

export function App() {
  const { pathname } = useLocation();
  useRouteChange();
  useReveal(pathname);
  return (
    <LeadProvider>
      <Water milk={['/services', '/resources', '/about'].includes(pathname)} />
      <a className="skip" href="#main">Skip to content</a>
      <Banner />
      <Header />
      <main id="main" tabIndex={-1}><AppRoutes /></main>
      <Footer />
      <MobileBar />
      <Analytics />
    </LeadProvider>
  );
}
