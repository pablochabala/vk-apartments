"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { gallery } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Desktop: section pins and the strip scrolls horizontally with vertical scroll.
 * Mobile / reduced motion: Embla swipe carousel with arrow buttons.
 */
export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", breakpoints: { [DESKTOP]: { active: false } } });
  const total = gallery.images.length;

  useEffect(() => {
    if (!embla) return;
    const on = () => setCurrent(embla.selectedScrollSnap());
    embla.on("select", on);
    return () => {
      embla.off("select", on);
    };
  }, [embla]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
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
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setCurrent(Math.min(total - 1, Math.round(self.progress * (total - 1))));
              gsap.set("[data-progress]", { scaleX: self.progress });
            },
          },
        });
        // Each image drifts inside its frame for depth
        gsap.utils.toArray<HTMLElement>("[data-gimg]").forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="gallery" className="overflow-hidden bg-limestone py-24 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0">
      <div className="gutter mb-10 flex items-end justify-between gap-6 lg:mb-12 lg:pt-[var(--header-h)]">
        <div>
          <p className="eyebrow mb-6 text-copper">{gallery.eyebrow}</p>
          <Heading serif={gallery.titleSerif} title={gallery.title} size="m" />
        </div>
        <div className="flex items-center gap-6">
          <p className="display whitespace-nowrap text-2xl tabular-nums" aria-live="polite">
            <span className="text-copper">{String(current + 1).padStart(2, "0")}</span>
            <span className="text-muted"> / {String(total).padStart(2, "0")}</span>
          </p>
          <div className="flex gap-2 lg:hidden">
            <button type="button" aria-label="Previous photo" onClick={() => embla?.scrollPrev()} className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20">
              <Icon name="chevron-left" className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => embla?.scrollNext()} className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20">
              <Icon name="chevron-right" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden lg:overflow-visible">
        <div ref={track} className="gutter flex gap-4 will-change-transform lg:w-max lg:gap-8">
          {gallery.images.map((img, i) => (
            <figure key={img.src} className={`relative min-w-0 shrink-0 basis-[82%] sm:basis-[55%] lg:basis-auto ${i % 2 ? "lg:mt-16" : ""}`}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className={`chamfer group relative block aspect-[4/5] w-full overflow-hidden lg:h-[58vh] lg:w-auto ${i % 3 === 0 ? "lg:aspect-[4/3]" : ""}`}
                style={{ ["--cut" as string]: "28px" }}
                aria-label={`Open photo: ${img.alt}`}
                data-cursor="view"
              >
                <span data-gimg className="absolute -inset-x-[10%] inset-y-0 block">
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 45vw, 85vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105" />
                </span>
              </button>
              <figcaption className="mt-3 text-xs uppercase tracking-[0.15em] text-muted">{String(i + 1).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="gutter mt-10 hidden lg:block" aria-hidden="true">
        <div className="h-px w-full bg-ink/10">
          <div data-progress className="h-px w-full origin-left scale-x-0 bg-copper" />
        </div>
      </div>

      {open !== null && <Lightbox index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </section>
  );
}

function Lightbox({ index, onClose, onIndex }: { index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const total = gallery.images.length;
  const img = gallery.images[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const prev = useCallback(() => onIndex((index - 1 + total) % total), [index, onIndex, total]);
  const next = useCallback(() => onIndex((index + 1) % total), [index, onIndex, total]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[160] flex items-center justify-center bg-malachite/95 p-4 backdrop-blur" data-lenis-prevent onClick={onClose}>
      <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image src={img.src} alt={img.alt} fill sizes="90vw" className="object-contain" />
      </div>
      <p className="absolute bottom-6 left-1/2 max-w-[80vw] -translate-x-1/2 text-center text-sm text-sand">{img.alt}</p>
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo viewer" className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-limestone/30 text-limestone">
        <Icon name="close" className="h-5 w-5" />
      </button>
      <button type="button" onClick={(e) => (e.stopPropagation(), prev())} aria-label="Previous photo" className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-limestone/30 text-limestone">
        <Icon name="chevron-left" className="h-5 w-5" />
      </button>
      <button type="button" onClick={(e) => (e.stopPropagation(), next())} aria-label="Next photo" className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-limestone/30 text-limestone">
        <Icon name="chevron-right" className="h-5 w-5" />
      </button>
    </div>
  );
}
