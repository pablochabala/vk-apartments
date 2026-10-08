"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { amenities } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

/**
 * "Your own territory": a horizontal-scroll row of amenity cards.
 * Drag / swipe / trackpad, or use the arrow buttons; a copper line tracks progress.
 */
export function Amenities() {
  const root = useRef<HTMLElement>(null);
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", dragFree: true });
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    if (!embla) return;
    setProgress(Math.max(0, Math.min(1, embla.scrollProgress())));
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("scroll", sync).on("reInit", sync).on("select", sync);
    return () => {
      embla.off("scroll", sync).off("reInit", sync).off("select", sync);
    };
  }, [embla, sync]);

  // Cards rise in with a stagger and their images open from the bottom.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-row]", start: "top 85%", once: true } });
      tl.from("[data-card]", { x: 120, autoAlpha: 0, duration: 1.3, stagger: 0.08, ease: "expo.out" }).fromTo(
        "[data-cimg]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.08, ease: "power4.inOut" },
        0.1,
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="amenities" className="overflow-hidden py-24 md:py-40">
      <div className="gutter mx-auto mb-14 flex max-w-[1440px] flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-6 text-copper">{amenities.eyebrow}</p>
          <Heading serif={amenities.titleSerif} title={amenities.title} />
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <p className="max-w-sm text-lg text-muted">Everything you need for a comfortable stay, inside a secure, gated compound.</p>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous amenities" onClick={() => embla?.scrollPrev()} disabled={!canPrev} className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-limestone disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink" data-cursor="link">
              <Icon name="chevron-left" className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next amenities" onClick={() => embla?.scrollNext()} disabled={!canNext} className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-limestone disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink" data-cursor="link">
              <Icon name="chevron-right" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div ref={emblaRef} data-row className="gutter cursor-grab active:cursor-grabbing" aria-roledescription="carousel" aria-label="Amenities">
        <ul className="flex gap-5 md:gap-8">
          {amenities.items.map((a, i) => (
            <li key={a.title} data-card className="group min-w-0 shrink-0 basis-[82%] sm:basis-[46%] lg:basis-[31%] xl:basis-[26%]" aria-roledescription="slide" aria-label={`${i + 1} of ${amenities.items.length}: ${a.title}`}>
              <div className="chamfer relative mb-6 aspect-[4/5]" style={{ ["--cut" as string]: "24px" }}>
                <div data-cimg className="absolute inset-0 overflow-hidden bg-limestone-2">
                  <Image
                    src={a.image.src}
                    alt=""
                    fill
                    sizes="(min-width:1280px) 26vw, (min-width:1024px) 31vw, (min-width:640px) 46vw, 82vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-110"
                    style={{ objectPosition: `${30 + ((i * 17) % 50)}% center` }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-malachite/70 via-transparent to-transparent" />
                  <span className="display absolute bottom-4 left-5 text-5xl text-limestone/90 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
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

      <div className="gutter mx-auto mt-12 max-w-[1440px]" aria-hidden="true">
        <div className="h-px w-full bg-ink/10">
          <div className="h-px w-full origin-left bg-copper transition-transform duration-300" style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} />
        </div>
      </div>
    </section>
  );
}
