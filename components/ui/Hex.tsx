/** VK signature motif: the hexagon, taken from the paved courtyard. */

type HexProps = React.SVGProps<SVGSVGElement> & { strokeWidth?: number };

export const HEX_PATH = "M50 2 L94 27 L94 77 L50 102 L6 77 L6 27 Z";

export function HexOutline({ strokeWidth = 1.5, ...props }: HexProps) {
  return (
    <svg viewBox="0 0 100 104" fill="none" aria-hidden="true" {...props}>
      <path d={HEX_PATH} stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function HexFill(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 104" aria-hidden="true" {...props}>
      <path d={HEX_PATH} fill="currentColor" />
    </svg>
  );
}

/** "VK" monogram inside a hexagon. */
export function Logo({ className = "", withWord = true }: { className?: string; withWord?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 100 104" className="h-10 w-10 shrink-0" aria-hidden="true">
        <path d={HEX_PATH} fill="none" stroke="currentColor" strokeWidth="4" />
        <text
          x="50"
          y="66"
          textAnchor="middle"
          fill="currentColor"
          style={{ font: "600 38px var(--font-archivo), sans-serif", fontStretch: "72%", letterSpacing: "-1px" }}
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

/**
 * A row of interlocking hexagons drawn as one continuous zig-zag "paver" line.
 * Used as a section divider and as the scroll-drawn motif in Architecture.
 */
export function hexRowPath(count: number, size = 60) {
  const w = size * 0.866 * 2; // hex width
  const h = size;
  let top = `M0 ${h * 0.5}`;
  let bottom = `M0 ${h * 1.5}`;
  for (let i = 0; i < count; i++) {
    const x = i * w;
    top += ` L${x + w / 2} 0 L${x + w} ${h * 0.5}`;
    bottom += ` L${x + w / 2} ${h * 2} L${x + w} ${h * 1.5}`;
  }
  let verticals = "";
  for (let i = 0; i <= count; i++) verticals += ` M${i * w} ${h * 0.5} L${i * w} ${h * 1.5}`;
  return { d: `${top} ${bottom}${verticals}`, width: count * w, height: h * 2 };
}

export function HexDivider({ count = 14, className = "" }: { count?: number; className?: string }) {
  const { d, width, height } = hexRowPath(count, 20);
  return (
    <svg viewBox={`-1 -1 ${width + 2} ${height + 2}`} className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path d={d} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
