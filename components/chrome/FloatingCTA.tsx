"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useUI } from "@/components/providers/AppProviders";
import { HexMark } from "@/components/ui/HexMark";

/** Persistent "Choose an apartment" pill. Appears after the hero; steps aside over Apartments and Contact. */
export function FloatingCTA() {
  const { scrollTo, ready } = useUI();
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      const el = ref.current!;
      const d = prefersReducedMotion() ? 0 : 0.6;
      gsap.set(el, { yPercent: 160, autoAlpha: 0 });
      let past = false;
      let hidden = false;
      const update = () => {
        const v = past && !hidden;
        gsap.to(el, { yPercent: v ? 0 : 160, autoAlpha: v ? 1 : 0, duration: d, ease: "power3.out", overwrite: true });
      };
      const triggers = [
        ScrollTrigger.create({
          trigger: "#manifesto",
          start: "top 60%",
          onEnter: () => {
            past = true;
            update();
          },
          onLeaveBack: () => {
            past = false;
            update();
          },
        }),
        ...["#apartments", "#contact", "footer"].map((sel) =>
          ScrollTrigger.create({
            trigger: sel,
            start: "top 80%",
            end: "bottom 20%",
            onToggle: (s) => {
              hidden = s.isActive;
              update();
            },
          }),
        ),
      ];
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [ready] },
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => scrollTo("#apartments")}
      className="group fixed bottom-4 right-4 z-[80] inline-flex min-h-12 items-center gap-3 rounded-full bg-copper py-2 pl-2 pr-6 text-xs font-semibold uppercase tracking-[0.16em] text-limestone shadow-[0_12px_40px_-12px_rgba(23,48,42,.6)] transition-colors hover:bg-malachite md:bottom-8 md:right-8"
      style={{ visibility: "hidden" }}
      data-cursor="link"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-limestone/15 transition-transform duration-500 group-hover:rotate-[60deg]">
        <HexMark className="h-4 w-4 text-blush" />
      </span>
      Choose an apartment
    </button>
  );
}
