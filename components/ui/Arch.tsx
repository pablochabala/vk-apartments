/** VK signature motif: the arch — a doorway, a window, the shape of coming home. */

type ArchProps = React.SVGProps<SVGSVGElement> & { strokeWidth?: number };

/** Round-topped arch in a 100 × 130 box (semicircle on two posts). */
export const ARCH_PATH = "M6 128 L6 50 A44 44 0 0 1 94 50 L94 128 Z";
export const ARCH_VIEWBOX = "0 0 100 130";

export function ArchOutline({ strokeWidth = 1.5, ...props }: ArchProps) {
  return (
    <svg viewBox={ARCH_VIEWBOX} fill="none" aria-hidden="true" {...props}>
      <path d={ARCH_PATH} stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ArchFill(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={ARCH_VIEWBOX} aria-hidden="true" {...props}>
      <path d={ARCH_PATH} fill="currentColor" />
    </svg>
  );
}

/** Concentric arches, like doorways seen one through another. Used as large decoration. */
export function ArchNest({ strokeWidth = 1, rings = 4, ...props }: ArchProps & { rings?: number }) {
  return (
    <svg viewBox={ARCH_VIEWBOX} fill="none" aria-hidden="true" {...props}>
      {Array.from({ length: rings }, (_, i) => {
        const r = 44 - i * 9;
        const x0 = 50 - r;
        const x1 = 50 + r;
        return (
          <path
            key={r}
            className="js-arch-ring"
            d={`M${x0} 128 L${x0} 50 A${r} ${r} 0 0 1 ${x1} 50 L${x1} 128`}
            pathLength={1}
            strokeDasharray="1"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

/** "VK" monogram inside an arch. */
export function Logo({ className = "", withWord = true }: { className?: string; withWord?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox={ARCH_VIEWBOX} className="h-11 w-[2.1rem] shrink-0" aria-hidden="true">
        <path d={ARCH_PATH} fill="none" stroke="currentColor" strokeWidth="5" />
        <text
          x="50"
          y="98"
          textAnchor="middle"
          fill="currentColor"
          style={{ font: "600 40px var(--font-archivo), sans-serif", fontStretch: "72%", letterSpacing: "-1px" }}
        >
          VK
        </text>
      </svg>
      {withWord && (
        <span className="display text-[1.35rem] leading-none tracking-wide">
          VK <span className="serif normal-case text-[1.15em] tracking-normal">Apartments</span>
        </span>
      )}
    </span>
  );
}

/** An arcade: a row of arches on a shared baseline, drawn as one path. */
export function arcadePath(count: number, w = 40, post = 22) {
  const r = w / 2;
  const base = r + post;
  let d = `M0 ${base}`;
  for (let i = 0; i < count; i++) {
    const x = i * w;
    d += ` L${x} ${r} A${r} ${r} 0 0 1 ${x + w} ${r} L${x + w} ${base}`;
  }
  d += ` L0 ${base}`;
  return { d, width: count * w, height: base };
}

export function ArchDivider({ count = 14, className = "" }: { count?: number; className?: string }) {
  const { d, width, height } = arcadePath(count);
  return (
    <svg viewBox={`-1 -1 ${width + 2} ${height + 2}`} className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path d={d} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
