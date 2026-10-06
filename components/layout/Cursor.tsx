"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

/** Copper cursor dot that grows over links and shows a label over [data-cursor] media. Fine pointers only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useGSAP(() => {
    const el = dot.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    document.documentElement.classList.add("has-cursor");
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    gsap.set(el, { scale: 0.12 });
    let shown = false;

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
      const t = e.target as HTMLElement;
      const media = t.closest<HTMLElement>("[data-cursor]");
      const link = t.closest("a, button, [role=tab], label, select");
      const text = media?.dataset.cursor ?? "";
      setLabel(text);
      gsap.to(el, { scale: media && text ? 1 : link ? 0.45 : 0.12, duration: 0.5, ease: "expo.out", overwrite: "auto" });
      el.dataset.mode = media && text ? "media" : link ? "link" : "";
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    };
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  });

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="cursor-dot group pointer-events-none invisible fixed left-0 top-0 z-[95] -ml-11 -mt-11 grid h-22 w-22 place-items-center rounded-full bg-copper opacity-0 data-[mode=link]:bg-copper/35"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-paper opacity-0 transition-opacity duration-300 group-data-[mode=media]:opacity-100">
        {label}
      </span>
    </div>
  );
}
