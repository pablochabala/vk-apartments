"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { howToBook, site } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArchOutline } from "@/components/ui/Arch";
import { Icon } from "@/components/ui/Icon";

export function HowToBook() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".js-step-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".js-steps", start: "top 75%", end: "bottom 60%", scrub: true } });
      gsap.from(".js-step", {
        y: 60,
        autoAlpha: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: { trigger: ".js-steps", start: "top 80%", once: true },
      });
      gsap.from(".js-step-arch", { yPercent: 30, scaleY: 0.4, transformOrigin: "50% 100%", duration: 1.6, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: ".js-steps", start: "top 80%", once: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how-to-book" aria-labelledby="book-title" className="relative bg-paper py-[var(--section-y)]">
      <div className="container-x">
        <SectionTitle id="book-title" eyebrow={howToBook.eyebrow} serif={howToBook.titleSerif} title={howToBook.title} />

        <ol className="js-steps relative mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
          <span aria-hidden="true" className="absolute left-[2.5rem] right-[10%] top-10 hidden h-px bg-line md:block">
            <span className="js-step-line block h-full origin-left bg-copper" />
          </span>
          {howToBook.steps.map((step, i) => (
            <li key={step.title} className="js-step relative">
              <span className="relative grid h-20 w-[3.9rem] place-items-center bg-paper pt-4">
                <ArchOutline className="js-step-arch absolute inset-0 h-full w-full text-copper-deep" strokeWidth={1.5} />
                <span className="display text-3xl text-copper-deep">{i + 1}</span>
              </span>
              <h3 className="display mt-6 text-[clamp(2.2rem,3.4vw,3.2rem)]">{step.title}</h3>
              <p className="mt-3 max-w-xs text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-8 rounded-[28px] bg-limestone p-8 md:mt-28 md:grid-cols-12 md:p-12">
          <div className="md:col-span-4">
            <p className="eyebrow text-copper-deep">{howToBook.payment.title}</p>
            <p className="serif mt-3 text-4xl leading-tight">Simple, direct, personal.</p>
          </div>
          <ul className="space-y-4 md:col-span-5">
            {howToBook.payment.items.map((item) => (
              <li key={item} className="flex gap-3 text-ink-soft">
                <span aria-hidden="true" className="mt-2.5 inline-block h-2.5 w-[0.4rem] shrink-0 arch-dot bg-copper" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 md:col-span-3 md:items-end">
            <a href={site.phone.tel} className="btn btn-ink w-full md:w-auto">
              <Icon name="phone" className="h-4 w-4" /> {site.phone.display}
            </a>
            <a href={site.phone.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full md:w-auto">
              <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
