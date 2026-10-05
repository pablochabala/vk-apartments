"use client";

import { useRef } from "react";
import { howToBook, site } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Heading } from "@/components/ui/Heading";
import { HexMark } from "@/components/ui/HexMark";
import { Icon } from "@/components/ui/Icon";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HowToBook() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-steps]", start: "top 80%", once: true } });
      tl.fromTo("[data-connector]", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power3.inOut" }, 0).from(
        "[data-step]",
        { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.15, ease: "expo.out" },
        0.1,
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how-to-book" className="bg-limestone-2 py-24 md:py-40">
      <div className="gutter mx-auto max-w-[1440px]">
        <p className="eyebrow mb-6 text-copper">{howToBook.eyebrow}</p>
        <Heading serif={howToBook.titleSerif} title={howToBook.title} />

        <ol data-steps className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
          <span data-connector aria-hidden="true" className="absolute left-7 right-[16%] top-7 hidden h-px origin-left bg-copper/50 md:block" />
          {howToBook.steps.map((s, i) => (
            <li key={s.title} data-step className="relative">
              <span className="relative flex h-14 w-14 items-center justify-center bg-limestone-2 text-copper">
                <HexMark className="absolute inset-0 h-full w-full" filled={false} strokeWidth={1} />
                <span className="display text-lg">{String(i + 1).padStart(2, "0")}</span>
              </span>
              <h3 className="display mt-8 text-4xl md:text-5xl">{s.title}</h3>
              <p className="mt-4 max-w-[34ch] text-lg text-muted">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-10 border-t border-ink/10 pt-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h3 className="eyebrow text-copper">{howToBook.payment.title}</h3>
            <ul className="mt-6 space-y-3">
              {howToBook.payment.items.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <HexMark className="mt-2 h-2.5 w-2.5 shrink-0 text-copper" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-start gap-3 md:col-span-6 md:col-start-7 md:justify-end">
            <MagneticButton href={`${site.phone.whatsapp}?text=${encodeURIComponent("Hello VK Apartments, I'd like to book a stay.")}`} external size="lg">
              <Icon name="whatsapp" className="h-5 w-5" /> WhatsApp us
            </MagneticButton>
            <MagneticButton href={site.phone.tel} variant="outline" size="lg">
              <Icon name="phone" className="h-4 w-4" /> Call {site.phone.display}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
