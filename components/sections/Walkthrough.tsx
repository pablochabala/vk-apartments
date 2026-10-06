"use client";

import { useRef } from "react";
import { walkthrough } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RevealText } from "@/components/ui/RevealText";
import { ScrubVideo } from "@/components/ui/ScrubVideo";
import { ArchDivider } from "@/components/ui/Arch";

/** "Step inside": the living-room clip follows your cursor (desktop) or your scroll (touch). */
export function Walkthrough() {
  const area = useRef<HTMLElement>(null);

  return (
    <section ref={area} id="walkthrough" aria-labelledby="walkthrough-title" className="relative overflow-hidden bg-slate py-[var(--section-y)] text-paper">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionTitle id="walkthrough-title" eyebrow={walkthrough.eyebrow} serif={walkthrough.titleSerif} title={walkthrough.title} tone="dark" />
          <RevealText className="mt-8 max-w-md text-lg text-paper/75">{walkthrough.text}</RevealText>
          <p className="eyebrow mt-10 flex items-center gap-3 text-copper-light">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-current" />
            <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">{walkthrough.hintPointer}</span>
            <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">{walkthrough.hintTouch}</span>
          </p>
        </div>
        <ScrubVideo
          sources={walkthrough.video.sources}
          poster={walkthrough.video.poster}
          label={walkthrough.alt}
          areaRef={area}
          cursorLabel="Look"
          className="mx-auto w-full max-w-[min(420px,78vw)] lg:col-span-5 lg:col-start-8 lg:max-w-[min(440px,36vw)]"
        />
      </div>
      <ArchDivider count={18} className="container-x mt-[calc(var(--section-y)*0.6)] h-10 w-full text-paper/10 md:h-14" />
    </section>
  );
}
