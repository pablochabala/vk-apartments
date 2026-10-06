"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { manifesto } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArchNest } from "@/components/ui/Arch";

/** Splits "*word*" markers into highlighted tokens. */
function tokens(text: string) {
  return text.split(/\s+/).map((raw) => {
    const highlight = /\*[^*]+\*/.test(raw);
    return { word: raw.replace(/\*/g, ""), highlight };
  });
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Words colour in as the paragraph scrolls through the viewport (scrubbed).
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>(".js-word", root.current),
        { opacity: 0.14 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ".js-para", start: "top 78%", end: "bottom 50%", scrub: 0.6 } },
      );
      // The arches draw themselves, outermost first, over the same stretch of scroll.
      gsap.fromTo(
        gsap.utils.toArray<SVGPathElement>(".js-arch-ring", root.current),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: "none", stagger: 0.25, scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 40%", scrub: 0.8 } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="manifesto" aria-labelledby="manifesto-title" className="relative overflow-hidden">
      <div className="container-x relative py-[var(--section-y)]">
        <ArchNest className="pointer-events-none absolute -left-[8vmin] top-[8vh] h-[52vmin] w-[40vmin] text-copper/20" />
        <SectionTitle id="manifesto-title" eyebrow={manifesto.eyebrow} serif={manifesto.titleSerif} title={manifesto.title} className="mb-12 md:mb-20" />
        <p className="js-para max-w-[22ch] text-[clamp(1.75rem,4.4vw,4.6rem)] font-medium leading-[1.12] tracking-[-0.02em] md:ml-[16.66%] lg:max-w-[26ch]">
          {tokens(manifesto.paragraph).map((t, i) => (
            <span key={i} className={`js-word ${t.highlight ? "serif text-copper-deep" : ""}`}>
              {t.word}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
