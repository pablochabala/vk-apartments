"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { hero, media, site } from "@/content";
import { HexOutline } from "@/components/ui/Hex";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { introDone } = useSite();

  // Scroll: image drifts and the headline lifts away as the hero leaves.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Hidden start state for the intro (set before first paint; the loader covers the server render).
      gsap.set(".js-hero-line", { yPercent: 115, rotate: 2.5 });
      gsap.set(".js-hero-fade", { autoAlpha: 0, y: 24 });
      gsap.set(".js-hero-img", { scale: 1.3 });
      gsap.set(".js-hero-hex", { rotate: -40, scale: 0.7, autoAlpha: 0 });

      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".js-hero-media", { yPercent: 18, ease: "none", scrollTrigger: st });
      gsap.to(".js-hero-copy", { yPercent: -30, opacity: 0.2, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  // Intro: slow scale-in, then masked lines.
  useGSAP(
    () => {
      if (!introDone || prefersReducedMotion()) return;
      gsap
        .timeline()
        .to(".js-hero-img", { scale: 1, duration: 2.8, ease: "expo.out" }, 0)
        .to(".js-hero-line", { yPercent: 0, rotate: 0, duration: 1.5, ease: "expo.out", stagger: 0.12 }, 0.2)
        .to(".js-hero-fade", { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.1 }, 0.8)
        .to(".js-hero-hex", { rotate: 0, scale: 1, autoAlpha: 1, duration: 2.4, ease: "expo.out" }, 0.4);
    },
    { scope: root, dependencies: [introDone] },
  );

  return (
    <section ref={root} id="top" aria-label="Introduction" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-slate text-paper">
      <div className="js-hero-media absolute inset-0 will-change-transform">
        <div className="js-hero-img absolute inset-0 origin-center">
          {media.heroVideo ? (
            <video
              className="h-full w-full object-cover"
              src={media.heroVideo}
              poster={hero.image.src}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          ) : (
            <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,16,.55)_0%,rgba(20,18,16,.15)_35%,rgba(20,18,16,.25)_60%,rgba(20,18,16,.82)_100%)]" />
      </div>

      <HexOutline className="js-hero-hex pointer-events-none absolute -right-[12vmin] top-[12vh] h-[70vmin] w-[70vmin] text-paper/15" strokeWidth={1} />

      <div className="js-hero-copy container-x relative flex h-full flex-col justify-end pb-[clamp(28px,7vh,80px)]">
        <h1 className="display text-[clamp(3.6rem,13.5vw,15rem)]">
          {hero.lines.map((line) => (
            <span key={line.text} className="mask-line">
              <span className={`js-hero-line ${line.serif ? "serif text-[0.6em] leading-[1.1] text-sand" : ""}`}>{line.text}</span>
            </span>
          ))}
        </h1>

        <div className="mt-6 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="js-hero-fade flex items-center gap-3 text-base md:text-lg">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 hex-clip bg-copper-light" />
            {hero.tagline}
          </p>
          <div className="js-hero-fade hidden items-center gap-4 md:flex">
            <span className="eyebrow text-paper/70">Scroll</span>
            <span className="relative block h-14 w-px overflow-hidden bg-paper/20">
              <span className="scroll-line absolute inset-0 bg-paper" />
            </span>
          </div>
          <a href={site.phone.tel} className="js-hero-fade display link-u self-start text-2xl md:hidden">
            {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
