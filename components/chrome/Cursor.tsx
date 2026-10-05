"use client";

import { useEffect, useRef } from "react";
import { gsap, isTouch, prefersReducedMotion } from "@/lib/gsap";

/** Copper ring cursor that grows over links and shows "View" over images. Pointer devices only. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return;
    const r = ring.current!;
    const d = dot.current!;
    const label = r.querySelector("span")!;
    gsap.set([r, d], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3.out" });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set([r, d], { x: e.clientX, y: e.clientY });
        gsap.to([r, d], { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const media = t.closest("[data-cursor='view']");
      const link = t.closest("a,button,[data-cursor='link'],select,label");
      gsap.to(r, {
        scale: media ? 2.4 : link ? 1.7 : 1,
        backgroundColor: media ? "rgba(168,90,50,.92)" : "rgba(168,90,50,0)",
        duration: 0.4,
        ease: "power3.out",
      });
      label.style.opacity = media ? "1" : "0";
      gsap.to(d, { scale: link || media ? 0 : 1, duration: 0.3 });
    };
    const leave = () => {
      gsap.to([r, d], { autoAlpha: 0, duration: 0.3 });
      shown = false;
    };

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="cursor pointer-events-none fixed left-0 top-0 z-[300] flex h-10 w-10 items-center justify-center rounded-full border border-copper"
        style={{ visibility: "hidden" }}
        aria-hidden="true"
      >
        <span className="text-[5px] font-semibold uppercase tracking-[0.2em] text-limestone opacity-0 transition-opacity">View</span>
      </div>
      <div ref={dot} className="cursor pointer-events-none fixed left-0 top-0 z-[300] h-1.5 w-1.5 rounded-full bg-copper" style={{ visibility: "hidden" }} aria-hidden="true" />
    </>
  );
}
