"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { architecture } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";

/* Honeycomb of pointy-top hexagons — the courtyard pavers, abstracted. */
const R = 40; // hex radius
const W = Math.sqrt(3) * R;
const COLS = 9;
const ROWS = 4;
const cells: { d: string; fill: boolean; key: string }[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const cx = c * W + (r % 2 ? W / 2 : 0) + W / 2;
    const cy = r * R * 1.5 + R;
    const pts = Array.from({ length: 6 }, (_, k) => {
      const a = (Math.PI / 180) * (60 * k - 90);
      return `${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`;
    });
    // A scattered set of "terracotta pavers", like the courtyard.
    const fill = (r * 7 + c * 3) % 5 === 0;
    cells.push({ d: `M${pts.join("L")}Z`, fill, key: `${r}-${c}` });
  }
}
const VB_W = COLS * W + W / 2;
const VB_H = ROWS * R * 1.5 + R / 2;

export function Architecture() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const strokes = gsap.utils.toArray<SVGPathElement>(".js-hex-stroke", root.current);
      const fills = gsap.utils.toArray<SVGPathElement>(".js-hex-fill", root.current);
      if (prefersReducedMotion()) {
        gsap.set(strokes, { strokeDashoffset: 0 });
        gsap.set(fills, { opacity: 0.7 });
        return;
      }
      gsap
        .timeline({ scrollTrigger: { trigger: ".js-honeycomb", start: "top 85%", end: "bottom 35%", scrub: 0.8 } })
        .fromTo(strokes, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: { each: 0.04, from: "random" } })
        .fromTo(fills, { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 0.7, scale: 1, ease: "power2.out", stagger: 0.05 }, ">-0.4");
    },
    { scope: root },
  );

  return (
    <section ref={root} id="architecture" aria-labelledby="architecture-title" className="relative overflow-hidden bg-limestone py-[var(--section-y)]">
      <div className="container-x">
        <div className="relative">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="js-honeycomb pointer-events-none mb-8 w-full md:absolute md:-top-[6vw] md:right-0 md:mb-0 md:w-[52%]"
            fill="none"
            aria-hidden="true"
          >
            {cells.map((cell) => (
              <g key={cell.key}>
                {cell.fill && <path className="js-hex-fill" d={cell.d} fill="var(--color-copper)" opacity={0.7} />}
                <path
                  className="js-hex-stroke"
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
            className="cell-clip aspect-[4/5] md:col-span-5"
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
