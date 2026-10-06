"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  items: string[];
  /** 1 = moves left, -1 = moves right. */
  direction?: 1 | -1;
  /** Seconds for one full loop at rest. */
  duration?: number;
  className?: string;
  separator?: React.ReactNode;
  /** Classes for [even, odd] items, so the strip can alternate display / serif. */
  itemClassNames?: [string, string];
};

/**
 * Infinite looping text strip. The loop speeds up with scroll velocity and
 * flips direction when the user scrolls back up.
 */
export function Marquee({ items, direction = 1, duration = 40, className = "", separator, itemClassNames = ["", ""] }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current?.querySelector<HTMLElement>(".js-track");
      if (!track) return;

      const tween = gsap.fromTo(
        track,
        { xPercent: direction === 1 ? 0 : -50 },
        { xPercent: direction === 1 ? -50 : 0, duration, ease: "none", repeat: -1 },
      );
      // Start far from time 0 so a negative timeScale (scrolling up) never hits the start and stalls.
      tween.totalTime(duration * 1000);

      let dir = 1;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          dir = self.direction;
          const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400);
          gsap.to(tween, { timeScale: boost * dir, duration: 0.2, overwrite: true });
          gsap.to(tween, { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out", overwrite: false });
        },
      });

      return () => st.kill();
    },
    { scope: root, dependencies: [direction, duration] },
  );

  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className={`whitespace-nowrap px-[0.35em] ${itemClassNames[i % 2]}`}>{item}</span>
          {separator}
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div className="js-track flex w-max will-change-transform">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
