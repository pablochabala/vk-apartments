"use client";

import { location, site } from "@/content";
import { Heading } from "@/components/ui/Heading";
import { RevealText } from "@/components/ui/RevealText";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HexMark } from "@/components/ui/HexMark";
import { Icon } from "@/components/ui/Icon";

/** Text column stays pinned (sticky) on desktop while images parallax past at different speeds. */
export function Location() {
  const [a, b, c] = location.images;
  return (
    <section id="location" className="relative bg-limestone-2 py-24 md:py-40">
      <div className="gutter mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <p className="eyebrow mb-6 text-copper">{location.eyebrow}</p>
            <Heading serif={location.titleSerif} title={location.title} />
            <div className="mt-10 max-w-[48ch] space-y-5 text-lg text-muted">
              {location.body.map((p) => (
                <RevealText key={p}>{p}</RevealText>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {location.chips.map((c) => (
                <li key={c} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm">
                  <HexMark className="h-2.5 w-2.5 text-copper" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-sm border-l-2 border-copper bg-limestone/70 px-5 py-4">
              <p className="eyebrow text-copper">{site.branch.label}</p>
              <p className="mt-1 text-sm text-muted">{site.branch.text}</p>
            </div>
            <div className="mt-10">
              <MagneticButton href={site.map.shortLink} external size="lg">
                <Icon name="pin" className="h-4 w-4" /> Get directions
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-6 gap-4 md:gap-6 lg:col-span-7">
          <ParallaxImage image={a} className="col-span-6 aspect-[4/5] md:col-span-4" speed={8} sizes="(min-width:1024px) 40vw, 100vw" />
          <ParallaxImage image={b} className="col-span-4 col-start-3 -mt-24 aspect-[4/3] md:col-span-4 md:col-start-3 md:-mt-40" speed={14} sizes="(min-width:1024px) 40vw, 70vw" />
          <ParallaxImage image={c} className="col-span-4 aspect-square md:col-span-3 md:-mt-20" speed={6} sizes="(min-width:1024px) 30vw, 70vw" />
        </div>
      </div>
    </section>
  );
}
