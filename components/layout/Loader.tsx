"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { ARCH_PATH } from "@/components/ui/Arch";
import { site } from "@/content";

/** Intro: arch monogram draws in with a % counter, then a two-tone curtain lifts away on an arched edge into the hero. */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const { setIntroDone, stopScroll, startScroll } = useSite();
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      window.scrollTo(0, 0);
      const finish = () => {
        startScroll();
        setGone(true);
      };

      if (prefersReducedMotion()) {
        setIntroDone(true);
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        return;
      }

      stopScroll();
      const counter = { v: 0 };
      const num = root.current!.querySelector(".js-count")!;
      const fontsReady = document.fonts?.ready ?? Promise.resolve();

      const tl = gsap.timeline({ paused: true, onComplete: finish });
      tl.fromTo(".js-arch", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0)
        .from(".js-mono", { yPercent: 110, duration: 1, ease: "expo.out" }, 0.35)
        .to(counter, {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, "0")),
        }, 0)
        .fromTo(".js-bar", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .addLabel("out", 1.8)
        .to(".js-content", { yPercent: -30, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, "out")
        .to(".js-panel", { yPercent: -125, borderBottomLeftRadius: "50% 22vh", borderBottomRightRadius: "50% 22vh", duration: 1.3, ease: "expo.inOut" }, "out+=0.25")
        .to(".js-panel-copper", { yPercent: -125, borderBottomLeftRadius: "50% 22vh", borderBottomRightRadius: "50% 22vh", duration: 1.3, ease: "expo.inOut" }, "out+=0.38")
        .call(() => setIntroDone(true), [], "out+=0.75");

      // Start once fonts are in (or after 1.2s at most) so the reveal never shows fallback fonts.
      Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(() => tl.play());
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100]" role="status" aria-live="polite" aria-label={`Loading ${site.name}`}>
      <div className="js-panel-copper absolute inset-x-0 top-0 h-[110%] bg-copper" />
      <div className="js-panel absolute inset-x-0 top-0 h-[110%] bg-slate text-paper">
        <div className="js-content flex h-[calc(100%/1.1)] flex-col items-center justify-center gap-8">
          <div className="relative h-32 w-[6.15rem]">
            <svg viewBox="0 0 100 130" className="absolute inset-0 h-full w-full text-copper-light" fill="none" aria-hidden="true">
              <path className="js-arch" d={ARCH_PATH} pathLength={1} stroke="currentColor" strokeWidth="2.5" strokeDasharray="1" />
            </svg>
            <span className="absolute inset-0 grid place-items-center pt-8">
              <span className="mask-line">
                <span className="js-mono display text-5xl">VK</span>
              </span>
            </span>
          </div>
          <div className="flex w-48 flex-col items-center gap-3">
            <span className="display text-sm tracking-[0.3em] text-sand/80">
              <span className="js-count tabular-nums">000</span>%
            </span>
            <span className="h-px w-full bg-paper/15">
              <span className="js-bar block h-full origin-left bg-copper-light" />
            </span>
            <span className="eyebrow text-[0.65rem] text-sand/60">{site.address.short}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
