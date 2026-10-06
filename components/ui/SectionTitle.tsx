"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  eyebrow?: string;
  serif: string;
  title: string;
  /** "light" = on limestone, "dark" = on slate. */
  tone?: "light" | "dark";
  align?: "left" | "center";
  size?: "lg" | "xl";
  className?: string;
  id?: string;
};

/**
 * The VK headline pairing: an italic serif accent line over an oversized
 * condensed uppercase line. Both lines are masked and slide up on scroll.
 */
export function SectionTitle({ eyebrow, serif, title, tone = "light", align = "left", size = "lg", className = "", id }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>(".mask-line > span", ref.current);
      const eyebrowEl = ref.current?.querySelector(".js-eyebrow");
      const st = { trigger: ref.current, start: "top 85%", once: true };
      if (prefersReducedMotion()) {
        gsap.from(ref.current, { autoAlpha: 0, duration: 0.6, scrollTrigger: st });
        return;
      }
      const tl = gsap.timeline({ scrollTrigger: st });
      if (eyebrowEl) tl.from(eyebrowEl, { autoAlpha: 0, y: 12, duration: 0.8, ease: "power3.out" }, 0);
      tl.from(lines, { yPercent: 115, rotate: 2, duration: 1.4, ease: "expo.out", stagger: 0.1 }, 0.05);
    },
    { scope: ref },
  );

  const sizes =
    size === "xl"
      ? "text-[clamp(3.6rem,13vw,13rem)]"
      : "text-[clamp(3rem,9vw,8.5rem)]";
  const accent = tone === "dark" ? "text-copper-light" : "text-copper-deep";

  return (
    <div ref={ref} className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <p className={`js-eyebrow eyebrow mb-6 flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${accent}`}>
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 hex-clip bg-current" />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={`display ${sizes}`}>
        <span className="mask-line">
          <span className={`serif ${accent} text-[0.62em] leading-[1.05]`}>{serif}</span>
        </span>
        <span className="mask-line">
          <span>{title}</span>
        </span>
      </h2>
    </div>
  );
}
