"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  /** In order of preference; the browser plays the first it supports. */
  sources: { src: string; type: string }[];
  poster: string;
  /** Accessible description of what the clip shows. */
  label: string;
  /** Element whose width maps to the clip on desktop (defaults to the frame itself). */
  areaRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  /** Shown in the custom cursor while hovering the area. */
  cursorLabel?: string;
};

/**
 * A video that plays with your hand, not on its own.
 * - Fine pointer: the cursor's x position across `areaRef` picks the frame (eased), and the frame leans toward the cursor.
 * - Touch: scrolling the frame through the viewport scrubs the clip.
 * - Keyboard / all devices: a range slider under the frame scrubs it too.
 * - Reduced motion: a still poster plus the slider.
 * The file must be encoded with a keyframe on every frame (-g 1) for smooth seeking.
 */
export function ScrubVideo({ sources, poster, label, areaRef, className = "", cursorLabel }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const target = useRef(0); // 0..1, where we want to be
  const shown = useRef(0); // 0..1, where the video is (eased)
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState(false);
  const [progress, setProgress] = useState(0);

  // Only download the clip when it is about to be seen (it is ~700 KB).
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Once data is in, prime decoding (iOS only paints seeked frames after a play()).
  useEffect(() => {
    const v = video.current;
    if (!near || !v) return;
    const onReady = () => {
      v.play()
        .then(() => v.pause())
        .catch(() => {})
        .finally(() => setReady(true));
    };
    v.addEventListener("loadeddata", onReady, { once: true });
    // <source> children added after mount need an explicit load().
    v.load();
    return () => v.removeEventListener("loadeddata", onReady);
  }, [near]);

  useGSAP(
    () => {
      const v = video.current;
      const el = frame.current;
      if (!v || !el || !ready) return;
      const reduced = prefersReducedMotion();

      let lastStep = -1;
      // One ticker eases `shown` toward `target` and seeks only when the frame would change.
      const tick = () => {
        const d = target.current - shown.current;
        if (Math.abs(d) < 0.0005) return;
        shown.current += d * (reduced ? 1 : 0.12);
        const dur = v.duration || 0;
        if (dur) {
          const t = Math.min(dur - 0.04, Math.max(0, shown.current * dur));
          if (Math.abs(v.currentTime - t) > 1 / 60) v.currentTime = t;
        }
        const step = Math.round(shown.current * 1000);
        if (step !== lastStep) {
          lastStep = step;
          setProgress(step / 1000);
        }
      };
      gsap.ticker.add(tick);
      const cleanups: (() => void)[] = [() => gsap.ticker.remove(tick)];

      if (!reduced && isFinePointer()) {
        const area = areaRef?.current ?? el;
        const leanX = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
        const leanY = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });
        const leanR = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = area.getBoundingClientRect();
          const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
          const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
          target.current = px;
          leanX((px - 0.5) * 28);
          leanY((py - 0.5) * 18);
          leanR((px - 0.5) * 2);
        };
        const leave = () => {
          leanX(0);
          leanY(0);
          leanR(0);
        };
        area.addEventListener("pointermove", move);
        area.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          area.removeEventListener("pointermove", move);
          area.removeEventListener("pointerleave", leave);
        });
      } else if (!reduced) {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 25%",
          onUpdate: (self) => (target.current = self.progress),
        });
        cleanups.push(() => st.kill());
      }

      return () => cleanups.forEach((fn) => fn());
    },
    { dependencies: [ready], scope: frame },
  );

  return (
    <div className={className}>
      <div
        ref={frame}
        className="relative aspect-[9/16] overflow-hidden rounded-t-[999px] bg-slate-soft will-change-transform"
        data-cursor={cursorLabel}
      >
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted
          playsInline
          preload={near ? "auto" : "none"}
          aria-label={label}
          disablePictureInPicture
        >
          {near && sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
        </video>
        <div className="pointer-events-none absolute inset-0 rounded-t-[999px] ring-1 ring-inset ring-paper/15" />
      </div>
      <label className="mt-6 flex items-center gap-4 text-paper/70">
        <span className="eyebrow shrink-0 text-[0.65rem] tabular-nums">{String(Math.round(progress * 100)).padStart(2, "0")}</span>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => (target.current = Number(e.currentTarget.value) / 1000)}
          disabled={!ready}
          aria-label="Walk-through position"
          className="scrub-range w-full cursor-pointer"
        />
      </label>
    </div>
  );
}
