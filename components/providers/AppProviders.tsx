"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type UIState = {
  lenis: Lenis | null;
  /** Intro loader has finished — hero can play its entrance. */
  ready: boolean;
  setReady: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  bookingOpen: boolean;
  openBooking: (unitId?: string) => void;
  closeBooking: () => void;
  /** Unit preselected in the enquiry form (from "Enquire" buttons). */
  unit: string;
  setUnit: (id: string) => void;
  scrollTo: (target: string | HTMLElement | number) => void;
};

const UICtx = createContext<UIState | null>(null);

export function useUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error("useUI must be used inside <AppProviders>");
  return ctx;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [unit, setUnit] = useState("");

  // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: 0 } });
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      setLenis(null);
    };
  }, []);

  // Lock scrolling while an overlay is open.
  useEffect(() => {
    const locked = menuOpen || bookingOpen || !ready;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, [menuOpen, bookingOpen, ready, lenis]);

  const scrollTo = useCallback(
    (target: string | HTMLElement | number) => {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
        return;
      }
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (typeof el === "number") window.scrollTo({ top: el });
      else el?.scrollIntoView();
    },
    [lenis],
  );

  const openBooking = useCallback((unitId?: string) => {
    if (unitId) setUnit(unitId);
    setBookingOpen(true);
  }, []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);

  const value = useMemo(
    () => ({ lenis, ready, setReady, menuOpen, setMenuOpen, bookingOpen, openBooking, closeBooking, unit, setUnit, scrollTo }),
    [lenis, ready, menuOpen, bookingOpen, openBooking, closeBooking, unit, scrollTo],
  );

  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}
