"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: "p" | "h2" | "h3" | "div" | "span";
  children: React.ReactNode;
  className?: string;
  /** Split by lines (masked slide-up) or words (masked, staggered). */
  by?: "lines" | "words";
  delay?: number;
  stagger?: number;
};

/** Masked text reveal: each line/word slides up from behind a mask when scrolled into view. */
export function RevealText({ as: Tag = "p", children, className, by = "lines", delay = 0, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.from(el, { autoAlpha: 0, duration: 0.6, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        return;
      }
      const split = SplitText.create(el, {
        type: by === "lines" ? "lines" : "words,lines",
        mask: by,
        autoSplit: true,
        onSplit(self) {
          const targets = by === "lines" ? self.lines : self.words;
          return gsap.from(targets, {
            yPercent: 110,
            duration: 1.25,
            ease: "expo.out",
            stagger: stagger ?? (by === "lines" ? 0.09 : 0.025),
            delay,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
