import { Route, Routes } from 'react-router-dom';
import { services } from './data/services';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServicePage } from './pages/ServicePage';
import { Work } from './pages/Work';
import { Pricing } from './pages/Pricing';
import { Offers } from './pages/Offers';
import { About, AboutMe } from './pages/About';
import { Resources } from './pages/Resources';
import { Contact } from './pages/Contact';
import { Reviews } from './pages/Reviews';
import { Check } from './pages/Check';
import { Process } from './pages/Process';
import { Faq } from './pages/Faq';
import { Guides } from './pages/Guides';
import { Marin, Nonprofits } from './pages/Audience';
import { Privacy, Thanks } from './pages/Misc';
import { NotFound } from './pages/NotFound';

const pages: [string, React.ReactNode][] = [
  ['/', <Home />], ['/services', <Services />], ['/services/:slug', <ServicePage />], ['/work', <Work />],
  ['/pricing', <Pricing />], ['/offers', <Offers />], ['/about', <About />], ['/about/me', <AboutMe />], ['/resources', <Resources />], ['/contact', <Contact />], ['/reviews', <Reviews />],
  ['/check', <Check />], ['/process', <Process />], ['/faq', <Faq />], ['/guides', <Guides />],
  ['/marin', <Marin />], ['/nonprofits', <Nonprofits />], ['/thanks', <Thanks />], ['/privacy', <Privacy />],
];

export const AppRoutes = () => (
  <Routes>
    {pages.map(([path, element]) => <Route key={path} path={path} element={element} />)}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/** Every URL the build writes to disk. */
export const staticPaths = () => [
  ...pages.map(([p]) => p).filter((p) => !p.includes(':')),
  ...services.map((s) => `/services/${s.slug}`),
];
