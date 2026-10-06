"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { amenities } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Icon } from "@/components/ui/Icon";
import { HexFill } from "@/components/ui/Hex";

/** Desktop: section pins and the cards slide horizontally. Mobile: native swipe row with snap. */
export function Amenities() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(".js-amen-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        gsap.from(".js-card", {
          yPercent: 30,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
        });
        return () => tween.scrollTrigger?.kill();
      });
      mm.add(MQ.mobile, () => {
        gsap.from(".js-card", {
          x: 60,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: track.current, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="amenities" aria-labelledby="amenities-title" className="relative overflow-hidden bg-limestone lg:h-screen">
      <div className="flex h-full flex-col justify-center gap-10 py-[var(--section-y)] lg:gap-[5vh] lg:py-[calc(var(--header-h)+2vh)]">
        <div className="container-x flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle id="amenities-title" eyebrow={amenities.eyebrow} serif={amenities.titleSerif} title={amenities.title} />
          <div className="flex items-center gap-4 lg:w-80">
            <span className="eyebrow text-ink-soft">{String(amenities.items.length).padStart(2, "0")} features</span>
            <span className="hidden h-px flex-1 bg-line lg:block">
              <span className="js-amen-progress block h-full origin-left scale-x-0 bg-copper" />
            </span>
          </div>
        </div>

        <ul
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 will-change-transform md:gap-6 lg:w-max lg:snap-none lg:overflow-visible lg:pr-[20vw]"
        >
          {amenities.items.map((item, i) => (
            <li key={item.title} className="js-card group w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[clamp(280px,24vw,400px)]">
              <article className="flex h-full flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-slate/10 lg:aspect-auto lg:h-[44vh]" data-cursor={item.title.split(" ")[0]}>
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 24vw, 78vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 grid h-14 w-14 place-items-center text-paper">
                    <HexFill className="absolute inset-0 h-full w-full text-copper-deep transition-transform duration-700 group-hover:rotate-90" />
                    <Icon name={item.icon} className="relative h-6 w-6" />
                  </span>
                  <span className="display absolute right-4 top-6 text-sm text-paper/80">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="border-x border-b border-line bg-paper p-5 md:p-6">
                  <h3 className="display text-3xl">{item.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
