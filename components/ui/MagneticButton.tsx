"use client";

import { useRef } from "react";
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

type Common = {
  children: React.ReactNode;
  className?: string;
  /** How far (px) the button follows the pointer. */
  strength?: number;
};
type AsLink = Common & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/** Button/link that leans toward the pointer (fine pointers only) with a fill-on-hover style from `.btn`. */
export function MagneticButton(props: AsLink | AsButton) {
  const { children, className = "", strength = 14, ...rest } = props;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !isFinePointer() || prefersReducedMotion()) return;
      const label = el.querySelector<HTMLElement>(".js-mag-label");
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const lx = label ? gsap.quickTo(label, "x", { duration: 0.6, ease: "power3.out" }) : null;
      const ly = label ? gsap.quickTo(label, "y", { duration: 0.6, ease: "power3.out" }) : null;

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
        lx?.(dx * strength * 0.35);
        ly?.(dy * strength * 0.35);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
        lx?.(0);
        ly?.(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  const content = <span className="js-mag-label inline-flex items-center gap-[inherit]">{children}</span>;

  if (rest.href !== undefined) {
    const { href, ...a } = rest as AsLink;
    const external = /^https?:/.test(href);
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={`btn ${className}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...a}
      >
        {content}
      </a>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={`btn ${className}`} {...(rest as AsButton)}>
      {content}
    </button>
  );
}
