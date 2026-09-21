/**
 * Consistent placeholder visual for every image slot that doesn't have a
 * real photo yet — tours, destinations, services. Renders a travel-themed
 * motif in a teal/gold duotone so placeholders read as one deliberate
 * system rather than a mismatched grab-bag, matching the same pattern
 * used for the LCD Khaya site (see components/lcdkhaya/PlaceholderImage).
 *
 * Swap in the real photo (Chesly is sending these progressively via
 * ImageKit) and drop this component — no layout changes needed, since
 * callers pass the same className/aspect-ratio wrapper either way.
 */
export default function PlaceholderImage({
  variant = "compass",
  label,
  showCaption = true,
  tone = "bright",
  className = "",
}: {
  variant?: "compass" | "plane" | "mountain" | "suitcase";
  label?: string;
  showCaption?: boolean;
  // "bright" for cards/grids. "deep" for full-bleed hero photography.
  tone?: "bright" | "deep";
  className?: string;
}) {
  const gradient =
    tone === "deep"
      ? "bg-gradient-to-br from-[#0A2626] via-[#0F3D3E] to-[#1B5C5D]"
      : "bg-gradient-to-br from-[#0F3D3E] via-[#1B5C5D] to-[#D9A62E]";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${gradient} ${className}`}
      role="img"
      aria-label={label || "Placeholder image"}
    >
      <div
        className={`absolute inset-0 mix-blend-multiply ${tone === "deep" ? "bg-black/40" : "bg-black/15"}`}
        aria-hidden="true"
      />
      <Motif variant={variant} className="relative h-1/2 w-1/2 text-white/85" />
      {label && showCaption && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/90">
          {label}
        </span>
      )}
    </div>
  );
}

function Motif({ variant, className }: { variant: string; className?: string }) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.5, viewBox: "0 0 24 24" };
  switch (variant) {
    case "plane":
      return (
        <svg {...common}>
          <path d="M2 16l7-2 3-7 2 .5-1.5 6.5 6 1.5.5 2-6.5-1L11 21l-1.5-.5.5-6L2 16z" />
        </svg>
      );
    case "mountain":
      return (
        <svg {...common}>
          <path d="M3 19l6-10 4 6 2-3 6 7H3z" />
          <circle cx="17" cy="6" r="2" />
        </svg>
      );
    case "suitcase":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="12" rx="1.5" />
          <path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" />
          <path d="M3 13h18" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-2 5-5 2 2-5 5-2z" />
        </svg>
      );
  }
}
