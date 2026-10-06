"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { apartments } from "@/content";
import { useSite } from "@/components/providers/SiteProvider";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArchFill } from "@/components/ui/Arch";
import { whatsappLink } from "@/lib/whatsapp";

const fmt = (n: number) => `${apartments.currency}${n.toLocaleString("en-ZM")}`;

export function Apartments() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { setEnquiryUnit, scrollTo } = useSite();
  const unit = apartments.types[active];

  // Panel change: image wipes in, details rise.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".js-apt-img", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" });
      gsap.fromTo(".js-apt-img img", { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" });
      gsap.fromTo(".js-apt-detail", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.15 });
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
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const enquire = () => {
    setEnquiryUnit(unit.id);
    scrollTo("#contact");
    window.setTimeout(() => document.getElementById("enquiry-name")?.focus({ preventScroll: true }), 1700);
  };

  return (
    <section ref={root} id="apartments" aria-labelledby="apartments-title" className="relative bg-slate py-[var(--section-y)] text-paper">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionTitle id="apartments-title" tone="dark" eyebrow={apartments.eyebrow} serif={apartments.titleSerif} title={apartments.title} />
          <p className="max-w-sm text-paper/70">{apartments.note}</p>
        </div>

        <div role="tablist" aria-label="Apartment types" className="mt-14 flex gap-2 overflow-x-auto border-b border-paper/15 no-scrollbar md:mt-20">
          {apartments.types.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`panel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative flex-1 shrink-0 px-2 pb-4 pt-2 text-left transition-colors duration-500 sm:flex-none md:px-6 ${
                i === active ? "text-paper" : "text-paper/45 hover:text-paper/80"
              }`}
            >
              <span className="display block text-[clamp(1.35rem,4vw,3.4rem)]">{t.label}</span>
              <span className="block text-[0.7rem] text-paper/60 sm:text-sm">
                from {fmt(t.price)} {apartments.priceSuffix}
              </span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-[3px] origin-left bg-copper-light transition-transform duration-700 ease-[var(--ease-expo)] ${
                  i === active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div id={`panel-${unit.id}`} role="tabpanel" aria-labelledby={`tab-${unit.id}`} tabIndex={0} className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-8">
          <div className="js-apt-img relative aspect-[4/5] overflow-hidden rounded-t-[999px] sm:aspect-[5/4] sm:rounded-t-none sm:rounded-tl-[clamp(60px,10vw,180px)] lg:col-span-7" data-cursor={unit.label}>
            <Image key={unit.image.src} src={unit.image.src} alt={unit.image.alt} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="js-apt-detail eyebrow text-copper-light">Price from</p>
              <p className="js-apt-detail display mt-2 text-[clamp(4rem,8vw,7rem)]">
                {fmt(unit.price)}
                <span className="serif ml-3 align-middle text-[0.3em] text-sand">{apartments.priceSuffix}</span>
              </p>

              <dl className="js-apt-detail mt-8 grid grid-cols-3 border-y border-paper/15">
                {[
                  ["Bedrooms", unit.bedrooms],
                  ["Bathrooms", unit.bathrooms],
                  ["Guests", unit.guests],
                  ...(unit.size ? [["Size", `${unit.size} m²`] as const] : []),
                ].map(([k, v]) => (
                  <div key={k} className="py-5 pr-2">
                    <dt className="text-xs uppercase tracking-[0.18em] text-paper/55">{k}</dt>
                    <dd className="display mt-1 text-3xl">{v}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-8 space-y-3">
                {unit.features.map((f) => (
                  <li key={f} className="js-apt-detail flex items-center gap-3 text-paper/85">
                    <ArchFill className="h-3 w-2.5 shrink-0 text-copper-light" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="js-apt-detail flex flex-wrap gap-3">
              <MagneticButton className="btn-light" onClick={enquire}>
                Enquire about {unit.label}
              </MagneticButton>
              <MagneticButton
                href={whatsappLink(`Hello VK Apartments, I'd like to book the ${unit.label} apartment. Dates: `)}
                className="btn-outline text-paper"
              >
                WhatsApp
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
