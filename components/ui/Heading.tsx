"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  /** Italic serif accent line, e.g. "Come home to" */
  serif?: string;
  /** Uppercase display line(s), e.g. "Nkana East" */
  title: string;
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "l" | "m";
  className?: string;
  serifClassName?: string;
  /** Start immediately (on mount) instead of on scroll. */
  play?: boolean;
  delay?: number;
  align?: "left" | "center";
};

const sizes = { xl: "text-display-xl", l: "text-display-l", m: "text-display-m" };

/**
 * Signature headline: italic serif accent over an oversized uppercase line.
 * Each line rises out of a mask (expo.out, staggered) when it scrolls into view.
 */
export function Heading({ serif, title, as: Tag = "h2", size = "l", className = "", serifClassName = "", play, delay = 0, align = "left" }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const lines = ref.current?.querySelectorAll<HTMLElement>("[data-line]");
      if (!lines?.length) return;
      if (prefersReducedMotion()) {
        gsap.from(lines, { opacity: 0, duration: 0.3, ease: "none", scrollTrigger: play ? undefined : { trigger: ref.current, start: "top 90%", once: true } });
        return;
      }
      if (play === false) {
        gsap.set(lines, { yPercent: 115 });
        return;
      }
      gsap.fromTo(
        lines,
        { yPercent: 115, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.3,
          stagger: 0.1,
          delay,
          ease: "expo.out",
          scrollTrigger: play ? undefined : { trigger: ref.current, start: "top 88%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [play] },
  );

  return (
    <Tag ref={ref} className={`display ${sizes[size]} ${align === "center" ? "text-center" : ""} ${className}`}>
      {serif && (
        <span className="line-mask">
          <span data-line className={`serif-accent block origin-left text-[0.6em] ${serifClassName}`}>
            {serif}
          </span>
        </span>
      )}
      <span className="line-mask">
        <span data-line className="block origin-left">
          {title}
        </span>
      </span>
    </Tag>
  );
}
