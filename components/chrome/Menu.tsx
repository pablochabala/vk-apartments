"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gallery, nav, site } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useUI } from "@/components/providers/AppProviders";
import { HexMark } from "@/components/ui/HexMark";
import { Icon } from "@/components/ui/Icon";

/** Full-screen menu: malachite curtain drops in, links rise staggered; reverses (faster) on close. */
export function Menu() {
  const { menuOpen, setMenuOpen, scrollTo } = useUI();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [preview, setPreview] = useState(0);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set(root.current, { visibility: "visible" })
        .fromTo(root.current, { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: reduce ? 0.01 : 0.9 })
        .fromTo("[data-link]", { yPercent: 110 }, { yPercent: 0, duration: reduce ? 0.01 : 1, stagger: 0.05, ease: "expo.out" }, reduce ? 0 : 0.45)
        .fromTo("[data-fade]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: reduce ? 0.01 : 0.8, stagger: 0.06, ease: "power3.out" }, reduce ? 0 : 0.6);
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (menuOpen) {
      t.timeScale(1).play();
      // Move focus into the dialog
      requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("a,button")?.focus());
    } else {
      t.timeScale(1.6).reverse();
    }
  }, [menuOpen]);

  // Esc to close + simple focus trap
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.querySelector<HTMLElement>('[aria-controls="site-menu"]')?.focus();
      }
      if (e.key === "Tab" && root.current) {
        const items = [...root.current.querySelectorAll<HTMLElement>("a,button"), document.querySelector<HTMLElement>('[aria-controls="site-menu"]')!];
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => scrollTo(href), 350);
  };

  const previews = gallery.images;

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!menuOpen}
      className="hex-lattice fixed inset-0 z-[95] overflow-y-auto bg-malachite text-limestone"
      style={{ visibility: "hidden", clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
    >
      <div className="gutter grid min-h-full grid-cols-1 gap-12 pb-12 pt-[calc(var(--header-h)+32px)] lg:grid-cols-12 lg:items-end lg:pb-16">
        <nav aria-label="Main" className="lg:col-span-7">
          <ul className="space-y-1">
            {nav.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <a
                  data-link
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  onMouseEnter={() => setPreview(i % previews.length)}
                  onFocus={() => setPreview(i % previews.length)}
                  className="group flex items-baseline gap-4 py-1 text-[clamp(2.5rem,7vw,5.5rem)] leading-[1]"
                  data-cursor="link"
                >
                  <span className="w-8 text-xs font-medium tracking-[0.2em] text-sand/60 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative block overflow-hidden">
                    <span className="display block transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                      {item.label}
                    </span>
                    <span className="serif-accent absolute left-0 top-full block text-copper-lt transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-full group-focus-visible:-translate-y-full" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                  <HexMark className="h-3 w-3 -translate-x-2 text-copper-lt opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10 lg:col-span-5">
          <div data-fade className="chamfer relative hidden aspect-[4/3] overflow-hidden lg:block" style={{ ["--cut" as string]: "36px" }}>
            {previews.map((img, i) => (
              <Image
                key={img.src}
                src={img.src}
                alt=""
                fill
                sizes="40vw"
                className={`object-cover transition-all duration-700 ${preview === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
              />
            ))}
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div data-fade>
              <p className="eyebrow mb-3 text-sand/70">Call or WhatsApp</p>
              <a href={site.phone.tel} className="display text-3xl tabular-nums hover:text-copper-lt" data-cursor="link">
                {site.phone.display}
              </a>
            </div>
            <div data-fade>
              <p className="eyebrow mb-3 text-sand/70">Address</p>
              <a href={site.map.shortLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-2 text-lg hover:text-copper-lt" data-cursor="link">
                {site.address.short}
                <Icon name="arrow-up-right" className="mt-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
          <ul data-fade className="flex flex-wrap gap-6 text-sm uppercase tracking-[0.15em] text-sand">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-copper-lt" data-cursor="link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
