"use client";

import Image from "next/image";
import { useRef } from "react";
import { amenities } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

export function Amenities() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          autoAlpha: 0,
          duration: 1.2,
          delay: (i % 3) * 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });
        gsap.fromTo(
          card.querySelector("[data-cimg]"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, delay: (i % 3) * 0.08 + 0.1, ease: "power4.inOut", scrollTrigger: { trigger: card, start: "top 92%", once: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="amenities" className="py-24 md:py-40">
      <div className="gutter mx-auto max-w-[1440px]">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6 text-copper">{amenities.eyebrow}</p>
            <Heading serif={amenities.titleSerif} title={amenities.title} />
          </div>
          <p className="max-w-sm text-lg text-muted">Everything you need for a comfortable stay, inside a secure, gated compound.</p>
        </div>

        <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.items.map((a, i) => (
            <li key={a.title} data-card className="group">
              <div className="chamfer relative mb-6 aspect-[4/3]" style={{ ["--cut" as string]: "22px" }}>
               <div data-cimg className="absolute inset-0 overflow-hidden bg-limestone-2">
                <Image
                  src={a.image.src}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-110"
                  style={{ objectPosition: `${30 + ((i * 17) % 50)}% center` }}
                />
                <div className="absolute inset-0 bg-malachite/0 transition-colors duration-700 group-hover:bg-malachite/20" />
               </div>
              </div>
              <div className="flex items-start gap-5">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center text-copper">
                  <svg viewBox="0 0 56 60" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:rotate-[60deg]" aria-hidden="true">
                    <path d="M28 2 54 16v28L28 58 2 44V16Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  <Icon name={a.icon} className="relative h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl font-medium uppercase tracking-[0.04em]" style={{ fontStretch: "112%" }}>
                    {a.title}
                  </h3>
                  <p className="mt-2 text-muted">{a.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
