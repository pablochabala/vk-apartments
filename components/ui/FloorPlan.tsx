/**
 * Illustrative floor plan, drawn from the bedroom count.
 * REPLACE with real plans: drop an image in /public/media and render it instead.
 */
export function FloorPlan({ bedrooms, className = "" }: { bedrooms: number; className?: string }) {
  const W = 400;
  const H = 300;
  const bedW = 400 / Math.max(bedrooms, 1);
  const stroke = "var(--color-ink)";
  return (
    <svg viewBox={`-10 -10 ${W + 20} ${H + 40}`} className={className} role="img" aria-label={`Illustrative ${bedrooms}-bedroom floor plan`}>
      <g fill="none" stroke={stroke} strokeWidth="1.2">
        <rect x="0" y="0" width={W} height={H} strokeWidth="3" />
        {/* bedrooms along the top */}
        {Array.from({ length: bedrooms }, (_, i) => (
          <g key={i}>
            <rect x={i * bedW} y="0" width={bedW} height="120" />
            <rect x={i * bedW + 20} y="20" width={Math.min(70, bedW - 40)} height="56" rx="3" strokeOpacity=".45" />
            <path d={`M${i * bedW + bedW - 40} 120 a26 26 0 0 0 26 -26`} strokeOpacity=".5" />
            <text x={i * bedW + bedW / 2} y="106" textAnchor="middle" fontSize="11" fill={stroke} stroke="none" style={{ letterSpacing: ".12em" }}>
              BED {i + 1}
            </text>
          </g>
        ))}
        {/* bathroom */}
        <rect x="0" y="120" width="90" height="80" />
        <text x="45" y="166" textAnchor="middle" fontSize="11" fill={stroke} stroke="none" style={{ letterSpacing: ".12em" }}>
          BATH
        </text>
        {/* kitchen */}
        <rect x="0" y="200" width="140" height="100" />
        <path d="M8 208h124v20H8z" strokeOpacity=".45" />
        <text x="70" y="262" textAnchor="middle" fontSize="11" fill={stroke} stroke="none" style={{ letterSpacing: ".12em" }}>
          KITCHEN
        </text>
        {/* living + dining */}
        <rect x="190" y="200" width="150" height="70" rx="4" strokeOpacity=".45" />
        <text x="270" y="170" textAnchor="middle" fontSize="11" fill={stroke} stroke="none" style={{ letterSpacing: ".12em" }}>
          LIVING / DINING
        </text>
        {/* patio */}
        <rect x="290" y={H} width="110" height="26" strokeDasharray="4 4" strokeOpacity=".6" />
        <text x="345" y={H + 17} textAnchor="middle" fontSize="9" fill={stroke} stroke="none" style={{ letterSpacing: ".12em" }}>
          PATIO
        </text>
      </g>
      <path d="M205 300 h40" stroke="var(--color-limestone)" strokeWidth="4" />
      <path d="M205 300 a40 40 0 0 1 40 -40" fill="none" stroke="var(--color-copper)" strokeWidth="1.2" />
    </svg>
  );
}
