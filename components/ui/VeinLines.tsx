"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  className?: string;
  /** "scrub" draws with scroll position, "enter" draws once when visible, "static" never animates. */
  mode?: "scrub" | "enter" | "static";
  /** Number of parallel strokes. */
  count?: number;
  color?: string;
  start?: string;
  end?: string;
  variant?: "wide" | "tall";
};

const paths = {
  wide: "M-20 120 C 180 20, 320 220, 520 110 S 860 30, 1020 120 S 1260 200, 1460 90",
  tall: "M120 -20 C 20 180, 220 320, 110 520 S 30 860, 120 1020",
};

/**
 * Ore-vein lines — three flowing parallel copper strokes (signature motif).
 * Used as section dividers and drawn on scroll via stroke-dashoffset.
 */
export function VeinLines({ className = "", mode = "enter", count = 3, color = "var(--color-copper)", start = "top 85%", end = "bottom 40%", variant = "wide" }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (mode === "static" || prefersReducedMotion()) return;
      const lines = ref.current!.querySelectorAll("path");
      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(lines, {
        strokeDashoffset: 0,
        ease: mode === "scrub" ? "none" : "power3.inOut",
        duration: mode === "scrub" ? 1 : 2.2,
        stagger: 0.12,
        scrollTrigger: mode === "scrub" ? { trigger: ref.current, start, end, scrub: 1 } : { trigger: ref.current, start, once: true },
      });
    },
    { scope: ref },
  );

  const vb = variant === "wide" ? "0 0 1440 240" : "0 0 240 1000";
  const offset = (i: number) => (variant === "wide" ? `translate(0 ${i * 14})` : `translate(${i * 14} 0)`);

  return (
    <svg ref={ref} viewBox={vb} preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={paths[variant]}
          transform={offset(i)}
          pathLength={1}
          fill="none"
          stroke={color}
          strokeWidth={1.4}
          strokeOpacity={1 - i * 0.3}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
