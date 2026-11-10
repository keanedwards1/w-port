import { primaryNav } from '../../data/nav';
import { services } from '../../data/services';
import { Seo } from '../../lib/seo';
import { A } from '../ui/A';
import { Icon } from '../ui/Icon';
import { PageHead } from './Blocks';

export function Directory({ section, description }: { section: string; description: string }) {
  const item = primaryNav.find((entry) => entry.label === section)!;
  return (
    <>
      <Seo title={section} description={description} path={item.to!} />
      <PageHead title={section}>{description}</PageHead>
      <div className="directory wrap">
        {item.groups?.map((group) => (
          <section className="directory-group" key={group.label} aria-label={group.label}>
            {item.groups!.length > 1 && <h2>{group.label}</h2>}
            <ul>
              {group.links.map((link) => {
                const service = services.find((entry) => link.to === `/services/${entry.slug}`);
                return (
                  <li key={link.to}>
                    <A to={link.to} className="directory-link">
                      <span><strong>{service?.name ?? link.label}</strong>{service && <span className="directory-description">{service.line}</span>}</span>
                      <Icon name="arrow" size={20} />
                    </A>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
