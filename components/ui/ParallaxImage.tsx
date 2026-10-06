"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Img = { src: string; alt: string; w: number; h: number };

type Props = {
  image: Img;
  className?: string;
  /** Parallax strength in % of the frame height (0 = off). */
  speed?: number;
  /** Reveal with a clip-path wipe (inset → full) when scrolled into view. */
  reveal?: boolean | "up" | "center";
  sizes?: string;
  priority?: boolean;
  /** Extra classes for the inner <Image> (e.g. hover zoom). */
  imgClassName?: string;
  cursorLabel?: string;
};

/** Image in a clipped frame with scroll parallax and an optional clip-path reveal. */
export function ParallaxImage({
  image,
  className = "",
  speed = 12,
  reveal = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  imgClassName = "",
  cursorLabel,
}: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (speed) {
        gsap.fromTo(
          inner.current,
          { yPercent: -speed / 2 },
          {
            yPercent: speed / 2,
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
      if (reveal) {
        const from = reveal === "center" ? "inset(18% 18% 18% 18%)" : "inset(100% 0% 0% 0%)";
        gsap.fromTo(
          frame.current,
          { clipPath: from },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: frame.current, start: "top 85%", once: true },
          },
        );
        gsap.from(inner.current?.querySelector("img") ?? [], {
          scale: 1.35,
          duration: 2,
          ease: "expo.out",
          scrollTrigger: { trigger: frame.current, start: "top 85%", once: true },
        });
      }
    },
    { scope: frame, dependencies: [speed, reveal] },
  );

  return (
    <div ref={frame} className={`relative overflow-hidden bg-slate/10 ${className}`} data-cursor={cursorLabel}>
      <div
        ref={inner}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `-${speed / 2 + 1}%`, bottom: `-${speed / 2 + 1}%` }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
        />
      </div>
    </div>
  );
}
