"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useUI } from "@/components/providers/AppProviders";
import { EnquiryForm } from "@/components/ui/EnquiryForm";
import { Icon } from "@/components/ui/Icon";

/** Desktop "Book a call" panel: slides in from the right with the enquiry form. */
export function BookingModal() {
  const { bookingOpen, closeBooking } = useUI();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const d = prefersReducedMotion() ? 0.01 : 1;
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo("[data-scrim]", { opacity: 0 }, { opacity: 1, duration: 0.5 * d, ease: "power2.out" })
        .fromTo("[data-panel]", { xPercent: 100 }, { xPercent: 0, duration: 0.9 * d, ease: "expo.out" }, 0)
        .fromTo("[data-panel-inner] > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 * d, stagger: 0.06, ease: "power3.out" }, 0.25 * d);
    },
    { scope: root },
  );

  useEffect(() => {
    if (bookingOpen) {
      returnFocus.current = document.activeElement as HTMLElement;
      tl.current?.timeScale(1).play();
      requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("[data-close]")?.focus());
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeBooking();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    tl.current?.timeScale(1.7).reverse();
    returnFocus.current?.focus?.();
  }, [bookingOpen, closeBooking]);

  return (
    <div ref={root} className="fixed inset-0 z-[150]" style={{ visibility: "hidden" }} inert={!bookingOpen} role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <div data-scrim className="absolute inset-0 bg-malachite/60 backdrop-blur-sm" onClick={closeBooking} />
      <div data-panel className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto bg-limestone" data-lenis-prevent>
        <div data-panel-inner className="flex flex-1 flex-col gap-8 p-8 md:p-12">
          <div className="flex items-start justify-between gap-6">
            <h2 id="booking-title" className="display text-display-m">
              <span className="serif-accent block text-[0.6em] text-copper">Book a</span>
              call
            </h2>
            <button
              data-close
              type="button"
              onClick={closeBooking}
              aria-label="Close booking form"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-limestone"
              data-cursor="link"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <p className="text-muted">
            Prefer to talk now? Call{" "}
            <a href={site.phone.tel} className="font-medium text-ink underline underline-offset-4">
              {site.phone.display}
            </a>
            . Or leave your details and we&apos;ll confirm availability on WhatsApp.
          </p>
          <EnquiryForm compact />
        </div>
      </div>
    </div>
  );
}
