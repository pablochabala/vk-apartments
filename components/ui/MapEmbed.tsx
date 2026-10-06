"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content";
import { mapsEmbedUrl } from "@/lib/whatsapp";
import { ArchOutline } from "./Arch";

/** Lazy Google Map: the iframe is only created when the frame nears the viewport. Grayscale until hover. */
export function MapEmbed({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`map-frame relative overflow-hidden rounded-t-[999px] rounded-b-[28px] bg-slate-soft ${className}`}>
      {visible ? (
        <iframe
          title={`Map showing ${site.name}, ${site.address.full}`}
          src={mapsEmbedUrl()}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-sand/50">
          <ArchOutline className="h-16 w-12 animate-pulse" />
        </div>
      )}
    </div>
  );
}
