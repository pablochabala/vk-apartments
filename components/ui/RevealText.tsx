"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  as?: "p" | "div" | "span" | "h3" | "h4";
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Body copy that rises line-by-line out of a mask when scrolled into view. */
export function RevealText({ children, as: Tag = "p", className = "", delay = 0, stagger = 0.08 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.from(el, { opacity: 0, duration: 0.3, ease: "none", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
        return;
      }
      let played = false;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          // Re-splits on resize/font load; jump to the end state if it already played.
          if (played) return gsap.set(self.lines, { yPercent: 0 });
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger,
            delay,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true, onEnter: () => (played = true) },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
