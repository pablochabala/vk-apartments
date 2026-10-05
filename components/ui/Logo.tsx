type Props = { className?: string; tone?: "light" | "dark" };

/** VK Apartments wordmark: hex monogram + extended wordmark. */
export function Logo({ className = "", tone = "dark" }: Props) {
  const ink = tone === "light" ? "text-limestone" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-3 ${ink} ${className}`}>
      <svg viewBox="0 0 48 52" className="h-9 w-auto shrink-0 md:h-10" aria-hidden="true">
        <path d="M24 2 45.5 14.25v23.5L24 50 2.5 37.75v-23.5Z" fill="var(--color-copper)" />
        <path d="M24 7 41 16.75v18.5L24 45 7 35.25v-18.5Z" fill="none" stroke="var(--color-blush)" strokeOpacity=".45" strokeWidth=".8" />
        <text x="24" y="31.5" textAnchor="middle" fill="var(--color-limestone)" fontSize="15" fontWeight="600" style={{ fontStretch: "118%", letterSpacing: ".02em" }} fontFamily="var(--font-archivo)">
          VK
        </text>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap text-[13px] font-semibold md:text-[15px] uppercase tracking-[0.08em]" style={{ fontStretch: "118%" }}>
          VK Apartments
        </span>
        <span className="mt-1 hidden text-[10px] sm:block uppercase tracking-[0.28em] opacity-70">Nkana East · Kitwe</span>
      </span>
    </span>
  );
}
