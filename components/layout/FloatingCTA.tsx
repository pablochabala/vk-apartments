"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HexFill } from "@/components/ui/Hex";

/** Persistent "Choose an apartment" pill — appears after the hero, steps aside on the apartments & contact sections. */
export function FloatingCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollTo, menuOpen } = useSite();

  useGSAP(
    () => {
      const el = ref.current;
      gsap.set(el, { autoAlpha: 0, yPercent: 120 });
      const update = () => {
        const show = past.isActive && !blockers.some((t) => t.isActive);
        gsap.to(el, { autoAlpha: show ? 1 : 0, yPercent: show ? 0 : 120, duration: 0.7, ease: "expo.out", overwrite: true });
      };
      const past = ScrollTrigger.create({ start: () => window.innerHeight * 0.8, end: "max", onToggle: () => update() });
      const blockers = ["#apartments", "#contact"].map((sel) =>
        ScrollTrigger.create({ trigger: document.querySelector(sel), start: "top 70%", end: "bottom 30%", onToggle: () => update() }),
      );
      const triggers = [past, ...blockers];
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`fixed bottom-4 right-4 z-[60] md:bottom-8 md:right-8 ${menuOpen ? "pointer-events-none opacity-0" : ""}`}>
      <MagneticButton className="btn-ink shadow-[0_18px_40px_-12px_rgba(30,27,23,.55)]" onClick={() => scrollTo("#apartments")}>
        <HexFill className="h-3 w-3 text-copper-light" />
        Choose an apartment
      </MagneticButton>
    </div>
  );
}
