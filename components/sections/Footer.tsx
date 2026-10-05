"use client";

import { useRef } from "react";
import { footer, nav, site } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-wordmark]", {
        yPercent: 60,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-limestone/10 bg-malachite text-limestone">
      <div className="gutter mx-auto grid max-w-[1440px] gap-12 py-16 md:grid-cols-12 md:py-24">
        <nav aria-label="Footer" className="md:col-span-4">
          <p className="eyebrow mb-6 text-sand/70">Explore</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-flex min-h-10 items-center hover:text-copper-lt" data-cursor="link">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="eyebrow mb-6 text-sand/70">Visit</p>
          <address className="not-italic">{site.address.full}</address>
          <a href={site.map.shortLink} target="_blank" rel="noopener noreferrer" className="group mt-3 inline-flex min-h-10 items-center gap-2 text-copper-lt" data-cursor="link">
            Get directions <Icon name="arrow-up-right" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <p className="mt-4 text-sm text-sand/80">
            {site.branch.label}: {site.branch.text}
          </p>
        </div>
        <div className="md:col-span-4">
          <p className="eyebrow mb-6 text-sand/70">Contact</p>
          <a href={site.phone.tel} className="display text-3xl tabular-nums hover:text-copper-lt" data-cursor="link">
            {site.phone.display}
          </a>
          <ul className="mt-6 flex flex-wrap gap-x-6">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm uppercase tracking-[0.15em] text-sand hover:text-copper-lt" data-cursor="link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="gutter overflow-hidden" aria-hidden="true">
        <p data-wordmark className="display whitespace-nowrap text-center text-[10.8vw] leading-[0.8] text-copper/80">
          VK Apartments
        </p>
      </div>

      <div className="gutter flex flex-col gap-2 border-t border-limestone/10 py-6 text-xs text-sand/70 sm:flex-row sm:justify-between">
        <p>{footer.copyright}. Nkana East, Kitwe, Zambia.</p>
        <a href="#top" className="inline-flex min-h-10 items-center hover:text-limestone" data-cursor="link">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
