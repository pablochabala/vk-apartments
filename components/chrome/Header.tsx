"use client";

import { useRef, useState } from "react";
import { site } from "@/content";
import { gsap, ScrollTrigger, useGSAP, isTouch, prefersReducedMotion } from "@/lib/gsap";
import { useUI } from "@/components/providers/AppProviders";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { MagneticButton } from "@/components/ui/MagneticButton";

/** Fixed header — hides on scroll down, returns on scroll up, turns solid past the hero. */
export function Header() {
  const { menuOpen, setMenuOpen, openBooking } = useUI();
  const ref = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);

  useGSAP(() => {
    const el = ref.current!;
    const reduce = prefersReducedMotion();
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const y = self.scroll();
        setSolid(y > window.innerHeight * 0.85);
        const hide = self.direction === 1 && y > 240;
        gsap.to(el, { yPercent: hide ? -110 : 0, duration: reduce ? 0 : 0.5, ease: "power3.out", overwrite: true });
      },
    });
    return () => st.kill();
  });

  const onBook = (e: React.MouseEvent) => {
    // Phones call directly; desktop opens the booking form.
    if (!isTouch()) {
      e.preventDefault();
      openBooking();
    }
  };

  const tone = solid || menuOpen ? "dark" : "light";
  const light = tone === "light" && !menuOpen;

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ${solid && !menuOpen ? "bg-limestone/85 backdrop-blur-md" : ""}`}
    >
      <div className="gutter flex h-[var(--header-h)] items-center justify-between gap-3 md:gap-4">
        <div className="order-3 flex items-center md:order-1">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className={`group flex min-h-11 items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] ${
              menuOpen ? "text-limestone" : light ? "text-limestone" : "text-ink"
            }`}
            data-cursor="link"
          >
            <span className="relative block h-3 w-7" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "translate-y-1.5 rotate-45" : "group-hover:scale-x-75"} origin-center`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
            <span className="max-[379px]:sr-only">{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        <a href="#top" aria-label="VK Apartments — back to top" className="order-1 md:absolute md:left-1/2 md:-translate-x-1/2" data-cursor="link">
          <Logo tone={light || menuOpen ? "light" : "dark"} />
        </a>

        <div className="order-2 ml-auto flex items-center gap-3 md:order-3 md:gap-6">
          <a
            href={site.phone.tel}
            className={`hidden min-h-11 items-center gap-2 text-sm font-medium tracking-wide tabular-nums lg:inline-flex ${light || menuOpen ? "text-limestone" : "text-ink"}`}
            data-cursor="link"
          >
            <Icon name="phone" className="h-4 w-4" />
            {site.phone.display}
          </a>
          <span className="hidden sm:block">
            <MagneticButton href={site.phone.tel} onClick={onBook} variant={light || menuOpen ? "light" : "copper"}>
              Book a call
            </MagneticButton>
          </span>
          <a
            href={site.phone.tel}
            aria-label={`Call VK Apartments on ${site.phone.display}`}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border sm:hidden ${
              light || menuOpen ? "border-limestone/40 text-limestone" : "border-ink/20 text-ink"
            }`}
          >
            <Icon name="phone" className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
