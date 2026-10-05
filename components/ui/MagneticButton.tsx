"use client";

import { useRef } from "react";
import { gsap, useGSAP, isTouch, prefersReducedMotion } from "@/lib/gsap";

type Variant = "copper" | "outline" | "light" | "outline-light";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: Variant;
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
  size?: "md" | "lg";
  disabled?: boolean;
};

const base: Record<Variant, string> = {
  copper: "bg-copper text-limestone border-copper",
  outline: "bg-transparent text-ink border-ink/30",
  light: "bg-limestone text-malachite border-limestone",
  "outline-light": "bg-transparent text-limestone border-limestone/40",
};
const fill: Record<Variant, string> = {
  copper: "bg-malachite",
  outline: "bg-malachite",
  light: "bg-copper",
  "outline-light": "bg-copper",
};
const hoverText: Record<Variant, string> = {
  copper: "group-hover:text-limestone",
  outline: "group-hover:text-limestone",
  light: "group-hover:text-limestone",
  "outline-light": "group-hover:text-limestone",
};

/**
 * Pill button with a magnetic pull toward the pointer and a fill that wipes in
 * from the side the cursor entered. Renders <a> when `href` is given.
 */
export function MagneticButton({ children, href, onClick, variant = "copper", className = "", external, type = "button", ariaLabel, size = "md", disabled }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || isTouch()) return;
      const still = prefersReducedMotion();
      const inner = el.querySelector("[data-inner]");
      const blob = el.querySelector<HTMLElement>("[data-fill]");
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      const ixTo = gsap.quickTo(inner, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      const iyTo = gsap.quickTo(inner, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });

      const move = (e: PointerEvent) => {
        if (still) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.3);
        yTo(dy * 0.4);
        ixTo(dx * 0.12);
        iyTo(dy * 0.15);
      };
      const enter = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        if (blob) {
          gsap.set(blob, { left: e.clientX - r.left, top: e.clientY - r.top });
          gsap.to(blob, { scale: 1, duration: still ? 0 : 0.5, ease: "power3.out" });
        }
      };
      const leave = (e: PointerEvent) => {
        xTo(0);
        yTo(0);
        ixTo(0);
        iyTo(0);
        const r = el.getBoundingClientRect();
        if (blob) {
          gsap.set(blob, { left: e.clientX - r.left, top: e.clientY - r.top });
          gsap.to(blob, { scale: 0, duration: still ? 0 : 0.4, ease: "power3.out" });
        }
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  const cls = `group relative inline-flex items-center justify-center overflow-hidden rounded-full border font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
    size === "lg" ? "min-h-14 px-8 text-sm" : "min-h-12 px-6 text-xs"
  } ${base[variant]} ${disabled ? "pointer-events-none opacity-50" : "cursor-pointer"} ${className}`;

  const content = (
    <>
      <span
        data-fill
        aria-hidden="true"
        className={`pointer-events-none absolute aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full ${fill[variant]}`}
        style={{ transform: "scale(0)" }}
      />
      <span data-inner className={`relative z-10 inline-flex items-center gap-2 transition-colors duration-300 ${hoverText[variant]}`}>
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={root as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        className={cls}
        aria-label={ariaLabel}
        data-cursor="link"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <button ref={root as React.RefObject<HTMLButtonElement>} type={type} onClick={onClick} className={cls} aria-label={ariaLabel} data-cursor="link" disabled={disabled}>
      {content}
    </button>
  );
}
