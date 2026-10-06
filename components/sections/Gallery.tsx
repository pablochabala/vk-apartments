"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { gallery } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";

/** Arch masks only suit portrait photos; landscape ones get a soft corner. */
const shapeFor = (img: { w: number; h: number }, i: number) =>
  img.h > img.w ? "arch-mask" : i % 2 ? "rounded-[4px]" : "rounded-tl-[clamp(60px,9vw,160px)]";
const heights = ["lg:h-[64vh]", "lg:h-[50vh]", "lg:h-[70vh]", "lg:h-[56vh]", "lg:h-[66vh]", "lg:h-[52vh]", "lg:h-[62vh]"];

/** Desktop: pinned horizontal scroll with counter. Mobile/tablet: Embla swipe carousel. */
export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(1);
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: false, dragFree: false });
  const total = gallery.images.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => setIndex(Math.min(total, Math.floor(self.progress * (total - 0.001)) + 1)),
          },
        });
        // Each frame zooms out slightly as it travels across.
        gsap.utils.toArray<HTMLElement>(".js-g-img", el).forEach((img) => {
          gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Mobile counter from Embla
  useGSAP(() => {
    if (!embla) return;
    const on = () => setIndex(embla.selectedScrollSnap() + 1);
    embla.on("select", on);
    return () => {
      embla.off("select", on);
    };
  }, { dependencies: [embla] });

  const counter = (
    <p className="display flex items-baseline gap-2 text-2xl tabular-nums" aria-hidden="true">
      <span className="text-copper-deep">{String(index).padStart(2, "0")}</span>
      <span className="text-ink-soft/50">/ {String(total).padStart(2, "0")}</span>
    </p>
  );

  return (
    <section ref={root} id="gallery" aria-labelledby="gallery-title" className="relative overflow-hidden bg-limestone lg:h-screen">
      {/* Desktop */}
      <div className="hidden h-full items-center lg:flex">
        <div ref={track} className="flex h-full w-max items-center gap-[4vw] pl-[var(--gutter)] pr-[12vw] will-change-transform">
          <div className="flex w-[30vw] shrink-0 flex-col gap-10">
            <SectionTitle id="gallery-title" eyebrow={gallery.eyebrow} serif={gallery.titleSerif} title={gallery.title} />
            {counter}
          </div>
          {gallery.images.map((img, i) => (
            <figure key={`${img.src}-${i}`} className={`relative shrink-0 overflow-hidden ${shapeFor(img, i)} ${heights[i % heights.length]} ${i % 2 ? "self-end mb-[10vh]" : "self-start mt-[14vh]"}`} style={{ aspectRatio: `${img.w} / ${img.h}` }} data-cursor="Drag">
              <Image src={img.src} alt={img.alt} fill sizes="45vw" className="js-g-img object-cover" />
            </figure>
          ))}
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="py-[var(--section-y)] lg:hidden">
        <div className="container-x mb-10 flex items-end justify-between gap-6">
          <SectionTitle eyebrow={gallery.eyebrow} serif={gallery.titleSerif} title={gallery.title} />
          {counter}
        </div>
        <div ref={emblaRef} className="overflow-hidden px-[var(--gutter)]" aria-roledescription="carousel" aria-label="Photo gallery">
          <div className="flex gap-4">
            {gallery.images.map((img, i) => (
              <figure key={`${img.src}-m-${i}`} aria-roledescription="slide" aria-label={`${i + 1} of ${total}`} className={`relative aspect-[4/5] w-[80vw] shrink-0 overflow-hidden sm:w-[50vw] ${shapeFor({ w: 4, h: 5 }, i)}`}>
                <Image src={img.src} alt={img.alt} fill sizes="(min-width:640px) 50vw, 80vw" className="object-cover" />
              </figure>
            ))}
          </div>
        </div>
        <div className="container-x mt-6 flex gap-3">
          <button type="button" className="btn btn-outline" onClick={() => embla?.scrollPrev()} aria-label="Previous photo">
            ←
          </button>
          <button type="button" className="btn btn-outline" onClick={() => embla?.scrollNext()} aria-label="Next photo">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
