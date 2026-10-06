"use client";

import { location, site } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/Icon";

/** Dark section: text column pins (sticky) while three photos drift past at different speeds. */
export function Location() {
  const [a, b, c] = location.images;
  return (
    <section id="location" aria-labelledby="location-title" className="relative bg-slate text-paper">
      <div className="container-x grid gap-16 py-[var(--section-y)] lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+6vh)] lg:col-span-5 lg:self-start">
          <SectionTitle id="location-title" tone="dark" eyebrow={location.eyebrow} serif={location.titleSerif} title={location.title} />
          <div className="mt-10 max-w-md space-y-5 text-paper/80">
            {location.body.map((p) => (
              <RevealText key={p}>{p}</RevealText>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {location.chips.map((chip) => (
              <li key={chip} className="rounded-full border border-paper/20 px-4 py-2 text-sm text-sand">
                {chip}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href={site.map.shortLink} className="btn-light">
              Get directions <Icon name="arrow" className="h-4 w-4" />
            </MagneticButton>
            <span className="flex items-center gap-2 text-sm text-paper/70">
              <Icon name="pin" className="h-4 w-4" /> {site.address.full}
            </span>
          </div>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <div className="grid grid-cols-6 gap-4 md:gap-6">
            <ParallaxImage image={a} reveal className="arch-mask col-span-6 aspect-[4/5] sm:col-span-4" speed={16} sizes="(min-width:1024px) 34vw, 70vw" cursorLabel="Home" />
            <ParallaxImage image={b} reveal className="col-span-4 col-start-3 aspect-[4/3] rounded-[24px] sm:-mt-24" speed={10} sizes="(min-width:1024px) 28vw, 60vw" cursorLabel="Pool" />
            <ParallaxImage image={c} reveal className="col-span-5 aspect-square rounded-t-[999px] sm:col-span-3 sm:-mt-10" speed={20} sizes="(min-width:1024px) 20vw, 70vw" cursorLabel="Lounge" />
          </div>
        </div>
      </div>
    </section>
  );
}
