"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content";
import { MagneticButton } from "./MagneticButton";
import { Icon } from "./Icon";

/**
 * Google Map of the exact VK Apartments location (coordinates resolved from the share link).
 * The iframe only loads when it nears the viewport, shows in grayscale and colours in on hover/focus.
 */
export function MapEmbed({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const { lat, lng, shortLink } = site.map;
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <div ref={ref} className="chamfer group relative aspect-[4/3] w-full overflow-hidden bg-malachite-2" style={{ ["--cut" as string]: "40px" }}>
        {load ? (
          <iframe
            title="Map showing VK Apartments in Nkana East, Kitwe"
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale-[0.9] contrast-[1.05] transition-[filter] duration-700 group-hover:grayscale-0 group-focus-within:grayscale-0"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sand">
            <Icon name="pin" className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <MagneticButton href={shortLink} external variant="light">
          <Icon name="pin" className="h-4 w-4" /> Open in Google Maps
        </MagneticButton>
      </div>
    </div>
  );
}
