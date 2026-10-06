"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type SiteContextValue = {
  /** True once the intro loader has finished — hero animations wait for it. */
  introDone: boolean;
  setIntroDone: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  /** Unit id pre-selected in the enquiry form (set by "Enquire" buttons). */
  enquiryUnit: string;
  setEnquiryUnit: (id: string) => void;
  scrollTo: (target: string | HTMLElement | number, opts?: { offset?: number; immediate?: boolean }) => void;
  stopScroll: () => void;
  startScroll: () => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiryUnit, setEnquiryUnit] = useState("");

  // Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Pin spacers change the page height; keep Lenis' cached scroll limit in sync.
    const resize = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", resize);

    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", resize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Re-measure triggers once fonts and images have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  const scrollTo = useCallback<SiteContextValue["scrollTo"]>((target, opts = {}) => {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (el === null) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: 1.6 });
    } else if (typeof el === "number") {
      window.scrollTo({ top: el });
    } else {
      el.scrollIntoView({ block: "start" });
    }
  }, []);

  const stopScroll = useCallback(() => {
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";
  }, []);
  const startScroll = useCallback(() => {
    lenisRef.current?.start();
    document.documentElement.style.overflow = "";
  }, []);

  const value = useMemo(
    () => ({ introDone, setIntroDone, menuOpen, setMenuOpen, enquiryUnit, setEnquiryUnit, scrollTo, stopScroll, startScroll }),
    [introDone, menuOpen, enquiryUnit, scrollTo, stopScroll, startScroll],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
