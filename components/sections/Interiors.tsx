"use client";

import { interiors } from "@/content";
import { Heading } from "@/components/ui/Heading";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";

/** Alternating image/text rows; images open from an inset clip-path to full with inner parallax. */
export function Interiors() {
  return (
    <section id="interiors" className="bg-limestone-2 py-24 md:py-40">
      <div className="gutter mx-auto max-w-[1440px]">
        <div className="mb-20 md:mb-32">
          <p className="eyebrow mb-6 text-copper">{interiors.eyebrow}</p>
          <Heading serif={interiors.titleSerif} title={interiors.title} />
        </div>

        <div className="space-y-24 md:space-y-40">
          {interiors.rows.map((row, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={row.title} className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
                <ParallaxImage
                  image={row.image}
                  className={`aspect-[4/5] w-full md:col-span-6 ${flip ? "md:order-2 md:col-start-7" : ""}`}
                  speed={10}
                  sizes="(min-width:768px) 50vw, 100vw"
                />
                <div className={`md:col-span-5 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}>
                  <span className="display block text-6xl text-copper/30 md:text-8xl" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <RevealText as="h3" className="mt-4 text-3xl font-light uppercase leading-[1.05] md:text-4xl">
                    {row.title}
                  </RevealText>
                  <RevealText className="mt-6 max-w-[46ch] text-lg text-muted" delay={0.1}>
                    {row.text}
                  </RevealText>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
