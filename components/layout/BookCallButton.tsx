"use client";

import { site } from "@/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSite } from "@/components/providers/SiteProvider";

/** Mobile: calls the phone number. Desktop: scrolls to the enquiry form and focuses it. */
export function BookCallButton({ className = "btn-copper", label = "Book a call" }: { className?: string; label?: string }) {
  const { scrollTo, setMenuOpen } = useSite();
  return (
    <MagneticButton
      href={site.phone.tel}
      className={className}
      onClick={(e) => {
        if (!window.matchMedia("(min-width: 1024px)").matches) return;
        e.preventDefault();
        setMenuOpen(false);
        scrollTo("#contact");
        window.setTimeout(() => document.getElementById("enquiry-name")?.focus({ preventScroll: true }), 1700);
      }}
    >
      {label}
    </MagneticButton>
  );
}
