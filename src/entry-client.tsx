import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/instrument-serif';
import '@fontsource-variable/inter-tight';
import '@fontsource/ibm-plex-mono/400.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/site.css';
import './styles/sections.css';
import './styles/lead.css';
import './styles/footer.css';
import './styles/home.css';
import { App } from './App';

const root = document.getElementById('root') as HTMLElement;
const tree = <BrowserRouter><App /></BrowserRouter>;
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
