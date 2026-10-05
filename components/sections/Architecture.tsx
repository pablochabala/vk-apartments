"use client";

import { architecture } from "@/content";
import { Heading } from "@/components/ui/Heading";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";
import { VeinLines } from "@/components/ui/VeinLines";

/** Huge headline with the ore-vein motif drawn across it as you scroll. */
export function Architecture() {
  return (
    <section id="architecture" className="hex-lattice relative overflow-hidden bg-malachite py-24 text-limestone md:py-40">
      <div className="gutter relative mx-auto max-w-[1440px]">
        <p className="eyebrow mb-6 text-copper-lt">{architecture.eyebrow}</p>
        <div className="relative">
          <Heading serif={architecture.titleSerif} title={architecture.title} size="xl" serifClassName="text-blush" />
          <div className="pointer-events-none absolute left-[calc(var(--gutter)*-1)] right-[calc(var(--gutter)*-1)] top-1/2 h-[70%] -translate-y-1/3">
          <VeinLines
            className="h-full w-full"
            color="var(--color-copper-lt)"
            mode="scrub"
            start="top 85%"
            end="bottom 35%"
          />
          </div>
        </div>

        <div className="mt-20 grid items-end gap-12 md:mt-32 md:grid-cols-12">
          <ParallaxImage image={architecture.image} className="aspect-[3/4] md:col-span-5" speed={12} sizes="(min-width:768px) 40vw, 100vw" />
          <div className="space-y-6 text-lg text-sand md:col-span-6 md:col-start-7">
            {architecture.text.map((t, i) => (
              <RevealText key={t} delay={i * 0.1}>
                {t}
              </RevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
