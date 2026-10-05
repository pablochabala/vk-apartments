"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useUI } from "@/components/providers/AppProviders";

const KEY = "vk-intro-seen";

/**
 * Intro: the hex logo draws itself while a counter tracks page readiness,
 * then a malachite curtain lifts into the hero. Shown once per session.
 */
export function Loader() {
  const { setReady } = useUI();
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}

    if (prefersReducedMotion() || seen) {
      setDone(true);
      setReady(true);
      return;
    }

    const el = root.current!;
    const counter = el.querySelector("[data-count]")!;
    const hex = el.querySelectorAll("[data-hex]");
    const progress = { v: 0 };

    // Progress follows real readiness (fonts + window load) but never takes longer than ~1.8s.
    const loaded = Promise.race([
      Promise.all([document.fonts?.ready, new Promise((r) => (document.readyState === "complete" ? r(0) : window.addEventListener("load", r, { once: true })))]),
      new Promise((r) => setTimeout(r, 1800)),
    ]);

    gsap.set(hex, { strokeDasharray: 1, strokeDashoffset: 1 });
    const tl = gsap.timeline();
    tl.to(hex, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.12 }, 0).to(
      progress,
      { v: 82, duration: 1, ease: "power2.out", onUpdate: () => (counter.textContent = String(Math.round(progress.v)).padStart(3, "0")) },
      0,
    );

    let cancelled = false;
    loaded.then(() => {
      if (cancelled) return;
      tl.to(progress, { v: 100, duration: 0.35, ease: "power1.out", onUpdate: () => (counter.textContent = String(Math.round(progress.v)).padStart(3, "0")) })
        .to(el.querySelector("[data-content]"), { yPercent: -40, autoAlpha: 0, duration: 0.6, ease: "power3.in" })
        .add(() => setReady(true), "-=0.15")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.25")
        .add(() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          setDone(true);
        });
    });
    return () => {
      cancelled = true;
      tl.kill();
    };
  }, [setReady]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="loader fixed inset-0 z-[200] flex items-center justify-center bg-malachite text-limestone"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="status"
      aria-label="Loading VK Apartments"
    >
      <div data-content className="flex flex-col items-center gap-8">
        <svg viewBox="0 0 120 130" className="h-28 w-auto" aria-hidden="true">
          <path data-hex pathLength={1} d="M60 4 114 35v60L60 126 6 95V35Z" fill="none" stroke="var(--color-copper-lt)" strokeWidth="1.5" />
          <path data-hex pathLength={1} d="M60 18 101 42v46L60 112 19 88V42Z" fill="none" stroke="var(--color-blush)" strokeOpacity=".5" strokeWidth="1" />
          <text x="60" y="76" textAnchor="middle" fill="currentColor" fontSize="30" fontWeight="300" style={{ fontStretch: "118%" }} fontFamily="var(--font-archivo)">
            VK
          </text>
        </svg>
        <div className="flex items-baseline gap-4">
          <span className="serif-accent text-2xl text-blush">Nkana East</span>
          <span data-count className="font-mono text-xs tracking-[0.2em] text-sand tabular-nums">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
