import { useParams } from 'react-router-dom';
import { serviceBySlug } from '../data/services';
import { PageShell } from '../components/sections/Blocks';
import { NotFound } from './NotFound';

export function ServicePage() {
  const { slug = '' } = useParams();
  const s = serviceBySlug(slug);
  if (!s) return <NotFound />;
  return <PageShell title={s.name} description={s.line} path={`/services/${s.slug}`} />;
}
