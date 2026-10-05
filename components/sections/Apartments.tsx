"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { apartments } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useUI } from "@/components/providers/AppProviders";
import { Heading } from "@/components/ui/Heading";
import { FloorPlan } from "@/components/ui/FloorPlan";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HexMark } from "@/components/ui/HexMark";
import { Icon } from "@/components/ui/Icon";

export function Apartments() {
  const { setUnit, scrollTo } = useUI();
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = apartments.types[active];

  // Crossfade the panel contents whenever the tab changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-swap]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "expo.out" });
      gsap.fromTo("[data-swap-img]", { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.inOut" });
    },
    { scope: root, dependencies: [active], revertOnUpdate: false },
  );

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = apartments.types.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  const enquire = () => {
    setUnit(t.id);
    scrollTo("#contact");
  };

  return (
    <section ref={root} id="apartments" className="py-24 md:py-40">
      <div className="gutter mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6 text-copper">{apartments.eyebrow}</p>
            <Heading serif={apartments.titleSerif} title={apartments.title} />
          </div>
          <p className="max-w-sm text-lg text-muted">{apartments.note}</p>
        </div>

        <div role="tablist" aria-label="Apartment types" className="mb-10 flex gap-2 overflow-x-auto border-b border-ink/10 [scrollbar-width:none] md:mb-16 [&::-webkit-scrollbar]:hidden">
          {apartments.types.map((type, i) => (
            <button
              key={type.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${type.id}`}
              aria-selected={active === i}
              aria-controls={`panel-${type.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative min-h-14 shrink-0 px-4 pb-4 pt-2 text-left transition-colors md:px-8 ${active === i ? "text-ink" : "text-muted hover:text-ink"}`}
              data-cursor="link"
            >
              <span className="display block text-2xl md:text-4xl">{type.label}</span>
              <span className="mt-1 block text-sm tabular-nums">
                from {apartments.currency}
                {type.price.toLocaleString("en-ZM")} {apartments.priceSuffix}
              </span>
              <span className={`absolute inset-x-0 -bottom-px h-0.5 origin-left bg-copper transition-transform duration-700 ease-[var(--ease-expo)] ${active === i ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            <div data-swap className="chamfer flex aspect-square items-center justify-center bg-limestone-2 p-6" style={{ ["--cut" as string]: "24px" }}>
              <FloorPlan bedrooms={t.bedrooms} className="h-full w-full" />
            </div>
            <div className="chamfer relative aspect-square" style={{ ["--cut" as string]: "24px" }}>
              <div data-swap-img className="absolute inset-0 overflow-hidden">
                <Image src={t.image.src} alt={t.image.alt} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>
            <p data-swap className="text-xs text-muted sm:col-span-2">Floor plan is illustrative. Layouts vary between apartments.</p>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <h3 data-swap className="display text-display-m">
              <span className="serif-accent block text-[0.6em] text-copper">The</span>
              {t.label}
            </h3>
            <p data-swap className="mt-8 flex items-baseline gap-3">
              <span className="text-sm uppercase tracking-[0.15em] text-muted">from</span>
              <span className="display text-6xl tabular-nums md:text-7xl">
                {apartments.currency}
                {t.price.toLocaleString("en-ZM")}
              </span>
              <span className="text-muted">{apartments.priceSuffix}</span>
            </p>

            <dl data-swap className="mt-10 grid grid-cols-3 gap-4 border-y border-ink/10 py-6">
              {[
                { icon: "bed" as const, label: "Bedrooms", value: t.bedrooms },
                { icon: "bath" as const, label: "Bathrooms", value: t.bathrooms },
                t.size ? { icon: "ruler" as const, label: "Size", value: `${t.size} m²` } : { icon: "users" as const, label: "Sleeps", value: t.guests },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted">
                    <Icon name={s.icon} className="h-4 w-4" />
                    {s.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-light tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>

            <ul data-swap className="mt-8 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <HexMark className="h-2.5 w-2.5 text-copper" />
                  {f}
                </li>
              ))}
            </ul>

            <div data-swap className="mt-10 flex flex-wrap gap-3">
              <MagneticButton onClick={enquire} size="lg">
                Enquire about the {t.label}
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
