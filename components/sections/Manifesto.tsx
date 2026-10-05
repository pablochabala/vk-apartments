"use client";

import { useRef } from "react";
import { manifesto } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Heading } from "@/components/ui/Heading";
import { VeinLines } from "@/components/ui/VeinLines";

/** Split the paragraph into words; *starred* words become copper accents. */
function words(text: string) {
  return text.split(/\s+/).map((raw, i) => {
    const accent = /^\*.*\*[.,:;!?]?$/.test(raw);
    const clean = raw.replace(/\*/g, "");
    return { key: i, text: clean, accent };
  });
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const ws = gsap.utils.toArray<HTMLElement>("[data-w]");
      // Scrubbed: each word fades from ghost to full ink as the paragraph moves through the viewport.
      gsap.fromTo(
        ws,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-para]", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        "[data-accent]",
        { color: "var(--color-ink)" },
        {
          color: "var(--color-copper)",
          ease: "none",
          stagger: 0.4,
          scrollTrigger: { trigger: "[data-para]", start: "top 70%", end: "bottom 45%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="manifesto" className="relative overflow-hidden py-24 md:py-48">
      <VeinLines className="pointer-events-none absolute -left-10 top-1/3 h-[60%] w-[120%] opacity-40" mode="scrub" start="top 90%" end="bottom 30%" />
      <div className="gutter relative mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6 text-copper">{manifesto.eyebrow}</p>
            <Heading serif={manifesto.titleSerif} title={manifesto.title} size="m" />
          </div>
          <p data-para className="text-[clamp(1.5rem,3.4vw,3rem)] font-light leading-[1.18] tracking-[-0.01em] lg:col-span-8" style={{ fontStretch: "105%" }}>
            {words(manifesto.paragraph).map((w) =>
              w.accent ? (
                <span key={w.key} data-w data-accent className="serif-accent text-[1.12em] text-copper">
                  {w.text}{" "}
                </span>
              ) : (
                <span key={w.key} data-w>
                  {w.text}{" "}
                </span>
              ),
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
