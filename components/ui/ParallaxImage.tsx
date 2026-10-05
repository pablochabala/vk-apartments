"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type Img = { src: string; alt: string; w: number; h: number };

type Props = {
  image: Img;
  /** Sizing/aspect classes for the frame, e.g. "aspect-[4/5] w-full" */
  className?: string;
  /** Parallax travel in % of the frame (0 disables). */
  speed?: number;
  /** Clip-path "inset → full" reveal when scrolled into view. */
  reveal?: boolean;
  /** Hex-cut corners (signature motif). */
  chamfer?: boolean;
  sizes?: string;
  priority?: boolean;
  /** Zoom the image on hover of the closest `.group`. */
  hoverZoom?: boolean;
  objectPosition?: string;
};

export function ParallaxImage({
  image,
  className = "",
  speed = 10,
  reveal = true,
  chamfer = true,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  hoverZoom,
  objectPosition = "center",
}: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const clip = frame.current!.querySelector("[data-clip]");
      const mover = frame.current!.querySelector("[data-mover]");
      const img = frame.current!.querySelector("[data-img]");

      if (reveal) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame.current, start: "top 85%", once: true } });
        tl.fromTo(clip, { clipPath: "inset(16% 12% 16% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut" }).fromTo(
          img,
          { scale: 1.3 },
          { scale: 1, duration: 1.8, ease: "expo.out" },
          0.1,
        );
      }
      if (speed) {
        gsap.fromTo(
          mover,
          { yPercent: -speed },
          { yPercent: speed, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`relative ${chamfer ? "chamfer" : ""} ${className}`}>
      <div data-clip className="absolute inset-0 overflow-hidden bg-limestone-2">
        <div data-mover className="absolute inset-x-0 will-change-transform" style={{ top: `-${speed}%`, bottom: `-${speed}%` }}>
          <div data-img className="absolute inset-0">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              priority={priority}
              className={`object-cover ${hoverZoom ? "transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.08]" : ""}`}
              style={{ objectPosition }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
