"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { HexMark } from "./HexMark";

type Props = {
  items: string[];
  reverse?: boolean;
  /** Seconds for one full loop at rest. */
  duration?: number;
  className?: string;
  outline?: boolean;
};

/**
 * Infinite looping text strip. Speeds up with scroll velocity and follows scroll direction.
 * Pauses off-screen and on hover; static under reduced motion.
 */
export function Marquee({ items, reverse, duration = 40, className = "", outline }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tween = gsap.fromTo(
        track.current,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 },
      );

      let velocity = 0;
      let dir = 1;
      let ts = 1;
      let hovered = false;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          velocity = Math.abs(self.getVelocity());
          dir = self.direction;
        },
        onToggle(self) {
          if (self.isActive) tween.play();
          else tween.pause();
        },
      });
      const tick = () => {
        const target = hovered ? 0.15 * dir : dir * (1 + Math.min(velocity / 250, 8));
        ts += (target - ts) * 0.08;
        velocity *= 0.92;
        tween.timeScale(ts);
      };
      gsap.ticker.add(tick);
      const enter = () => (hovered = true);
      const leave = () => (hovered = false);
      root.current!.addEventListener("pointerenter", enter);
      root.current!.addEventListener("pointerleave", leave);
      const el = root.current!;
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  const row = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {items.map((item) => (
        <span key={item + copy} className="flex items-center whitespace-nowrap">
          <span className={`display px-[0.35em] ${outline ? "text-outline" : ""}`}>{item}</span>
          <HexMark className="h-[0.35em] w-[0.35em] shrink-0 text-copper" decorative />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
