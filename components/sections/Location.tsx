"use client";

import Image from "next/image";
import { useRef } from "react";
import { location, site } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { Heading } from "@/components/ui/Heading";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HexMark } from "@/components/ui/HexMark";
import { Icon } from "@/components/ui/Icon";

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/** Resting collage positions on desktop (also the static layout under reduced motion). */
const frames = [
  "left-0 top-[6%] w-[58%] aspect-[3/2]",
  "right-0 top-[22%] w-[38%] aspect-[3/4]",
  "left-[8%] top-[52%] w-[34%] aspect-[3/4]",
  "right-[6%] top-[66%] w-[30%] aspect-[3/4]",
];

/**
 * Desktop: the section pins for ~2 screens; the copy holds still while four images
 * rise past it at different speeds (scrubbed parallax). Mobile: simple stacked layout.
 */
export function Location() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const vh = window.innerHeight;
        const imgs = gsap.utils.toArray<HTMLElement>("[data-stage-img]");
        const paras = gsap.utils.toArray<HTMLElement>("[data-loc-step]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=180%", pin: true, scrub: 1, anticipatePin: 1 },
        });
        imgs.forEach((el, i) => {
          tl.fromTo(el, { y: vh * (0.85 + i * 0.22) }, { y: -vh * (0.55 + i * 0.28), ease: "none", duration: 1 }, 0);
          tl.fromTo(el.querySelector("[data-stage-inner]"), { scale: 1.25 }, { scale: 1, ease: "none", duration: 1 }, 0);
        });
        paras.forEach((p, i) => {
          tl.fromTo(p, { autoAlpha: 0.15, y: 16 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.18 }, 0.08 + i * 0.16);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="location" className="relative overflow-hidden bg-limestone-2 py-24 md:py-32 lg:h-[100svh] lg:py-0">
      <div className="gutter mx-auto grid h-full max-w-[1440px] gap-16 lg:grid-cols-12 lg:items-center lg:pt-[var(--header-h)]">
        <div className="relative z-10 lg:col-span-5">
          <p className="eyebrow mb-6 text-copper">{location.eyebrow}</p>
          <Heading serif={location.titleSerif} title={location.title} />
          <div className="mt-8 max-w-[46ch] space-y-4 text-lg text-muted">
            {location.body.map((p) => (
              <p key={p} data-loc-step>
                {p}
              </p>
            ))}
          </div>
          <ul data-loc-step className="mt-6 flex flex-wrap gap-2">
            {location.chips.map((c) => (
              <li key={c} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm">
                <HexMark className="h-2.5 w-2.5 text-copper" />
                {c}
              </li>
            ))}
          </ul>
          <div data-loc-step className="mt-6 border-l-2 border-copper bg-limestone/70 px-5 py-3">
            <p className="eyebrow text-copper">{site.branch.label}</p>
            <p className="mt-1 text-sm text-muted">{site.branch.text}</p>
          </div>
          <div className="mt-8">
            <MagneticButton href={site.map.shortLink} external size="lg">
              <Icon name="pin" className="h-4 w-4" /> Get directions
            </MagneticButton>
          </div>
        </div>

        {/* Desktop stage */}
        <div className="relative hidden h-full lg:col-span-7 lg:block">
          {location.images.map((img, i) => (
            <div key={img.src} data-stage-img className={`chamfer absolute overflow-hidden will-change-transform ${frames[i]}`} style={{ ["--cut" as string]: "28px" }}>
              <div data-stage-inner className="absolute inset-0">
                <Image src={img.src} alt={img.alt} fill sizes="35vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / tablet stack */}
        <div className="grid grid-cols-6 gap-4 lg:hidden">
          <ParallaxImage image={location.images[0]} className="col-span-6 aspect-[3/2]" speed={8} sizes="100vw" />
          <ParallaxImage image={location.images[1]} className="col-span-3 aspect-[3/4]" speed={10} sizes="50vw" />
          <ParallaxImage image={location.images[2]} className="col-span-3 mt-12 aspect-[3/4]" speed={6} sizes="50vw" />
        </div>
      </div>
    </section>
  );
}
