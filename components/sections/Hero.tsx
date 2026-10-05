"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hero, media } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useUI } from "@/components/providers/AppProviders";
import { VeinLines } from "@/components/ui/VeinLines";

export function Hero() {
  const { ready, scrollTo } = useUI();
  const root = useRef<HTMLElement>(null);
  const [video, setVideo] = useState(false);

  // The clip is a short vertical (9:16) loop: play it on portrait screens only, for visitors who want motion and aren't saving data.
  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
    if (portrait && !prefersReducedMotion() && !saveData) setVideo(true);
  }, []);

  // Entrance — plays when the intro loader hands over.
  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (!ready) {
        if (!reduce) gsap.set("[data-hline]", { yPercent: 115 });
        return;
      }
      if (reduce) return;
      gsap
        .timeline()
        .fromTo("[data-media]", { scale: 1.25 }, { scale: 1, duration: 2.6, ease: "expo.out" }, 0)
        .fromTo("[data-hline]", { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.12, ease: "expo.out" }, 0.2)
        .from("[data-hfade]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.7);

      // Scroll-out: image drifts, content lifts and fades
      gsap.to("[data-media-wrap]", { yPercent: 18, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to("[data-hcontent]", { yPercent: -20, autoAlpha: 0.2, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-malachite text-limestone" aria-label="Introduction">
      <div data-media-wrap className="absolute inset-0 will-change-transform">
        <div data-media className="absolute inset-0 will-change-transform">
          <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="object-cover" />
          {video && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={media.heroVideo}
              poster={hero.image.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-malachite via-malachite/40 to-malachite/30" />
      </div>

      <VeinLines className="pointer-events-none absolute inset-x-0 top-[30%] h-40 w-full opacity-60" color="var(--color-copper-lt)" mode="static" />

      <div data-hcontent className="gutter relative flex h-full flex-col justify-end pb-10 pt-[var(--header-h)] md:pb-14">
        <h1 className="display text-display-xl max-w-[14ch]">
          {hero.lines.map((l) => (
            <span key={l.text} className="line-mask">
              <span data-hline className={`block origin-left ${l.serif ? "serif-accent text-[0.55em] text-blush" : ""}`}>
                {l.text}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-6 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p data-hfade className="eyebrow max-w-xs text-sand">
            {hero.tagline}
          </p>
          <button
            data-hfade
            type="button"
            onClick={() => scrollTo("#manifesto")}
            className="group flex min-h-11 items-center gap-4 self-start text-xs font-semibold uppercase tracking-[0.2em] text-limestone md:self-auto"
            data-cursor="link"
          >
            <span className="relative block h-12 w-px overflow-hidden bg-limestone/25" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_cubic-bezier(.65,0,.35,1)_infinite] bg-copper-lt motion-reduce:animate-none" />
            </span>
            Scroll to discover
          </button>
        </div>
      </div>
    </section>
  );
}
