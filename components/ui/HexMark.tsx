type Props = { className?: string; decorative?: boolean; filled?: boolean; strokeWidth?: number };

/** Hexagon — signature motif taken from the VK courtyard pavers. */
export function HexMark({ className = "", decorative = true, filled = true, strokeWidth = 1.5 }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden={decorative} focusable="false">
      <path
        d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}
