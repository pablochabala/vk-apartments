"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { ArchNest } from "@/components/ui/Arch";
import { Icon } from "@/components/ui/Icon";
import { nav, site } from "@/content";
import { BookCallButton } from "./BookCallButton";

/** Full-screen menu: two-tone curtain reveal, staggered oversized links, reverses on close. */
export function MenuOverlay() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { menuOpen, setMenuOpen, scrollTo, stopScroll, startScroll } = useSite();

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set(root.current, { visibility: "visible" })
        .fromTo(".js-curtain-copper", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0.01 : 0.9 }, 0)
        .fromTo(".js-curtain", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0.01 : 1 }, reduced ? 0 : 0.12)
        .from(".js-link", { yPercent: 115, duration: reduced ? 0.01 : 1.1, ease: "expo.out", stagger: 0.06 }, reduced ? 0 : 0.55)
        .from(".js-fade", { autoAlpha: 0, y: 20, duration: reduced ? 0.01 : 0.8, ease: "power3.out", stagger: 0.08 }, reduced ? 0 : 0.8)
        .from(".js-archdeco", { yPercent: 25, scale: 0.8, autoAlpha: 0, transformOrigin: "50% 100%", duration: reduced ? 0.01 : 1.6, ease: "expo.out" }, reduced ? 0 : 0.5);
    },
    { scope: root },
  );

  // Play / reverse + scroll lock + focus management
  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    document.documentElement.dataset.menu = menuOpen ? "open" : "closed";
    if (menuOpen) {
      stopScroll();
      t.timeScale(1).play();
      const first = root.current?.querySelector<HTMLElement>(".js-link a");
      window.setTimeout(() => first?.focus({ preventScroll: true }), 500);
    } else {
      t.timeScale(1.6).reverse();
      startScroll();
    }
  }, [menuOpen, stopScroll, startScroll]);

  // Escape to close, Tab trapped between the overlay and the header's Close button.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("menu-button")?.focus();
      }
      if (e.key !== "Tab" || !root.current) return;
      const btn = document.getElementById("menu-button");
      const items = [btn, ...root.current.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    startScroll();
    // Jump while the curtain still covers the page, then reveal the destination.
    scrollTo(href, { immediate: true });
    setMenuOpen(false);
  };

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!menuOpen}
      inert={!menuOpen}
      className="invisible fixed inset-0 z-[70]"
    >
      <div className="js-curtain-copper absolute inset-0 bg-copper" />
      <div className="js-curtain absolute inset-0 overflow-hidden bg-slate text-paper">
        <ArchNest className="js-archdeco pointer-events-none absolute -right-[14vmin] -bottom-[6vmin] h-[110vmin] w-[85vmin] text-paper/[0.07]" />

        <div className="container-x flex h-full flex-col justify-between gap-10 overflow-y-auto pb-10 pt-[calc(var(--header-h)+4vh)] lg:flex-row lg:items-end lg:pb-16">
          <nav aria-label="Main">
            <ul className="flex flex-col">
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <div className="js-link">
                    <a
                      href={item.href}
                      onClick={(e) => go(e, item.href)}
                      className="group flex items-baseline gap-4 py-1 focus-visible:outline-copper-light"
                    >
                      <span className="eyebrow w-8 text-copper-light">{String(i + 1).padStart(2, "0")}</span>
                      <span className="relative block overflow-hidden">
                        <span className="block transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                          <span className="display block text-[clamp(2.4rem,min(7.5vh,13vw),6.5rem)]">{item.label}</span>
                          <span className="serif absolute left-0 top-full block text-[clamp(2.2rem,min(7vh,12vw),6rem)] leading-[0.9] text-copper-light">
                            {item.label}
                          </span>
                        </span>
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-8 lg:max-w-sm lg:text-right">
            <div className="js-fade">
              <p className="eyebrow mb-2 text-sand/60">Call or WhatsApp</p>
              <a href={site.phone.tel} className="display link-u text-4xl md:text-5xl">
                {site.phone.display}
              </a>
            </div>
            <div className="js-fade">
              <p className="eyebrow mb-2 text-sand/60">Address</p>
              <p className="text-lg">{site.address.full}</p>
              <a href={site.map.shortLink} target="_blank" rel="noopener noreferrer" className="link-u mt-1 inline-flex items-center gap-2 text-copper-light">
                Get directions <Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
            <div className="js-fade flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link-u text-sm uppercase tracking-[0.18em]">
                  {s.label}
                </a>
              ))}
            </div>
            <div className="js-fade sm:hidden">
              <BookCallButton className="btn-light w-full" label={`Call ${site.phone.display}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
