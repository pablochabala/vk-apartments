"use client";

import { nearby } from "@/content";
import { Marquee } from "@/components/ui/Marquee";

/** Two oversized strips of nearby Kitwe places, moving in opposite directions. */
export function Nearby() {
  return (
    <section aria-labelledby="nearby-title" className="overflow-hidden bg-malachite py-16 text-limestone md:py-24">
      <h2 id="nearby-title" className="sr-only">
        Nearby in Kitwe
      </h2>
      <ul className="sr-only">
        {[...nearby.rowA, ...nearby.rowB].map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="space-y-2 md:space-y-4">
        <Marquee items={nearby.rowA} className="text-[clamp(2.75rem,8vw,7.5rem)] leading-[1.05]" duration={45} />
        <Marquee items={nearby.rowB} className="text-[clamp(2.75rem,8vw,7.5rem)] leading-[1.05] text-sand" duration={50} reverse outline />
      </div>
    </section>
  );
}
