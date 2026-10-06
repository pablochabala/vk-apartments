"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { Logo } from "@/components/ui/Hex";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content";
import { BookCallButton } from "./BookCallButton";

/** Fixed header: hides on scroll down, returns on scroll up; transparent over the hero. */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const { menuOpen, setMenuOpen, scrollTo, introDone } = useSite();
  const [scrolled, setScrolled] = useState(false);

  useGSAP(
    () => {
      const show = gsap.quickTo(ref.current, "yPercent", { duration: 0.6, ease: "power3.out" });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const y = self.scroll();
          setScrolled(y > window.innerHeight * 0.6);
          if (document.documentElement.dataset.menu === "open") return;
          show(self.direction === 1 && y > 160 ? -100 : 0);
        },
      });
      return () => st.kill();
    },
    { scope: ref },
  );

  useGSAP(() => {
    if (!introDone) return;
    gsap.from(ref.current, { yPercent: -100, autoAlpha: 0, duration: 1.2, ease: "expo.out", delay: 0.4 });
  }, { dependencies: [introDone] });

  const solid = scrolled && !menuOpen;

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
        solid ? "bg-limestone/85 text-ink backdrop-blur-md" : "text-paper"
      } ${introDone ? "" : "invisible"}`}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
        <a
          href="#top"
          className="relative z-10"
          aria-label={`${site.name} — back to top`}
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            scrollTo(0);
          }}
        >
          <Logo />
        </a>

        <div className="flex items-center gap-3 md:gap-6">
          <a href={site.phone.tel} className="link-u hidden items-center gap-2 text-sm font-semibold tracking-wider md:inline-flex">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone.display}
          </a>
          <a
            href={site.phone.tel}
            aria-label={`Call ${site.phone.display}`}
            className="grid h-11 w-11 place-items-center rounded-full border border-current md:hidden"
          >
            <Icon name="phone" className="h-4 w-4" />
          </a>
          <div className="hidden sm:block">
            <BookCallButton className={solid ? "btn-ink" : "btn-copper"} />
          </div>
          <button
            id="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="group flex h-11 items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em]"
          >
            <span className="relative block h-5 overflow-hidden">
              <span className={`block transition-transform duration-500 ease-[var(--ease-expo)] ${menuOpen ? "-translate-y-1/2" : ""}`}>
                <span className="block h-5 leading-5">Menu</span>
                <span className="block h-5 leading-5">Close</span>
              </span>
            </span>
            <span className="relative block h-3 w-7" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "-translate-y-1.5 -rotate-45" : "group-hover:w-2/3"}`} />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
