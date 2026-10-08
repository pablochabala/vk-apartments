"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useUI } from "@/components/providers/AppProviders";
import { HexMark } from "@/components/ui/HexMark";

/** Persistent "Choose an apartment" pill. Rises in after the intro; steps aside only while an overlay is open. */
export function FloatingCTA() {
  const { scrollTo, ready, menuOpen, bookingOpen } = useUI();
  const ref = useRef<HTMLButtonElement>(null);
  const visible = ready && !menuOpen && !bookingOpen;

  useGSAP(
    () => {
      gsap.to(ref.current, {
        yPercent: visible ? 0 : 160,
        autoAlpha: visible ? 1 : 0,
        duration: prefersReducedMotion() ? 0 : 0.7,
        delay: visible && ready ? 0.6 : 0,
        ease: "expo.out",
        overwrite: true,
      });
    },
    { dependencies: [visible] },
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => scrollTo("#apartments")}
      className="group fixed bottom-4 right-4 z-[80] inline-flex min-h-12 items-center gap-3 rounded-full bg-copper py-2 pl-2 pr-6 text-xs font-semibold uppercase tracking-[0.16em] text-limestone shadow-[0_12px_40px_-12px_rgba(23,48,42,.6)] transition-colors hover:bg-malachite md:bottom-8 md:right-8"
      style={{ visibility: "hidden", transform: "translateY(160%)" }}
      data-cursor="link"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-limestone/15 transition-transform duration-500 group-hover:rotate-[60deg]">
        <HexMark className="h-4 w-4 text-blush" />
      </span>
      Choose an apartment
    </button>
  );
}
