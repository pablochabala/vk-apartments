"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { architecture } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";

/* An arcade of doorway arches — the VK motif, drawn as a colonnade. */
const AW = 64; // arch width
const AR = AW / 2;
const POST = 70; // straight sides below the curve
const GAP = 14;
const COLS = 7;
const ROWS = 2;
const cells: { d: string; fill: boolean; key: string }[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const x0 = c * (AW + GAP) + (r % 2 ? (AW + GAP) / 2 : 0);
    const x1 = x0 + AW;
    const top = r * (AR + POST + GAP);
    const base = top + AR + POST;
    // A scattered few filled in copper, like lit doorways.
    const fill = (r * 5 + c * 3) % 4 === 0;
    cells.push({ d: `M${x0} ${base} L${x0} ${top + AR} A${AR} ${AR} 0 0 1 ${x1} ${top + AR} L${x1} ${base} Z`, fill, key: `${r}-${c}` });
  }
}
const VB_W = COLS * (AW + GAP) + (AW + GAP) / 2;
const VB_H = ROWS * (AR + POST + GAP);

export function Architecture() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const strokes = gsap.utils.toArray<SVGPathElement>(".js-arch-stroke", root.current);
      const fills = gsap.utils.toArray<SVGPathElement>(".js-arch-fill", root.current);
      if (prefersReducedMotion()) {
        gsap.set(strokes, { strokeDashoffset: 0 });
        gsap.set(fills, { opacity: 0.7 });
        return;
      }
      gsap
        .timeline({ scrollTrigger: { trigger: ".js-arcade", start: "top 85%", end: "bottom 35%", scrub: 0.8 } })
        .fromTo(strokes, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: { each: 0.04, from: "random" } })
        .fromTo(fills, { opacity: 0, scaleY: 0, transformOrigin: "50% 100%" }, { opacity: 0.7, scaleY: 1, ease: "power2.out", stagger: 0.05 }, ">-0.4");
    },
    { scope: root },
  );

  return (
    <section ref={root} id="architecture" aria-labelledby="architecture-title" className="relative overflow-hidden bg-limestone py-[var(--section-y)]">
      <div className="container-x">
        <div className="relative">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="js-arcade pointer-events-none mb-8 w-full md:absolute md:-top-[6vw] md:right-0 md:mb-0 md:w-[52%]"
            fill="none"
            aria-hidden="true"
          >
            {cells.map((cell) => (
              <g key={cell.key}>
                {cell.fill && <path className="js-arch-fill" d={cell.d} fill="var(--color-copper)" opacity={0.7} />}
                <path
                  className="js-arch-stroke"
                  d={cell.d}
                  pathLength={1}
                  strokeDasharray="1"
                  stroke="var(--color-copper-deep)"
                  strokeOpacity={0.55}
                  strokeWidth={1.2}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
          <SectionTitle id="architecture-title" eyebrow={architecture.eyebrow} serif={architecture.titleSerif} title={architecture.title} size="xl" className="relative" />
        </div>

        <div className="mt-16 grid gap-12 md:mt-28 md:grid-cols-12 md:gap-8">
          <ParallaxImage
            image={architecture.image}
            reveal
            speed={14}
            className="arch-mask aspect-[4/5] md:col-span-5"
            sizes="(min-width:768px) 40vw, 100vw"
            cursorLabel="Facade"
          />
          <div className="flex flex-col justify-end gap-6 text-lg text-ink-soft md:col-span-5 md:col-start-8">
            {architecture.text.map((t) => (
              <RevealText key={t}>{t}</RevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
