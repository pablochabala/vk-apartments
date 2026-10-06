import { nav, site, footer } from "@/content";
import { ArchDivider } from "@/components/ui/Arch";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate text-paper">
      <div className="container-x pt-20 md:pt-28">
        <ArchDivider count={16} className="mb-16 h-10 w-full text-paper/15 md:h-14" />
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="serif text-4xl leading-tight text-sand md:text-5xl">A home that shapes how you live.</p>
            <a href={site.phone.tel} className="display link-u mt-8 inline-block text-5xl md:text-6xl">
              {site.phone.display}
            </a>
          </div>
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <p className="eyebrow mb-5 text-copper-light">Explore</p>
            <ul className="grid grid-cols-2 gap-y-3 md:grid-cols-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-u text-paper/80 hover:text-paper">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow mb-5 text-copper-light">Visit</p>
            <address className="not-italic text-paper/80">{site.address.full}</address>
            {site.email && (
              <a href={`mailto:${site.email}`} className="link-u mt-2 inline-block text-paper/80">
                {site.email}
              </a>
            )}
            <a href={site.map.shortLink} target="_blank" rel="noopener noreferrer" className="link-u mt-3 inline-flex items-center gap-2">
              Get directions <Icon name="arrow" className="h-4 w-4" />
            </a>
            <p className="mt-6 text-sm text-paper/60">
              {site.branch.label}. {site.branch.text}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-u text-sm uppercase tracking-[0.18em]">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p aria-hidden="true" className="display mt-16 select-none whitespace-nowrap text-center text-[17.5vw] leading-[0.78] text-paper/[0.92]">
        VK <span className="serif text-copper-light">Apartments</span>
      </p>
      <div className="container-x flex flex-col justify-between gap-2 border-t border-paper/10 py-6 text-xs uppercase tracking-[0.18em] text-paper/50 sm:flex-row">
        <span>{footer.copyright}</span>
        <span>{site.address.full}</span>
      </div>
    </footer>
  );
}
