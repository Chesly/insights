/**
 * Consistent placeholder visual used everywhere a real photo isn't
 * available yet (hero, services, gallery). Renders an abstract
 * road/steering-wheel motif treated with a gold/bronze duotone filter so
 * every placeholder reads as one deliberate visual system rather than
 * a mismatched grab-bag — this is the "filter" applied consistently
 * across the site's imagery until real photography replaces it.
 *
 * Once real photos are ready (see LCDKHAYA-SETUP.md for AI image
 * prompts), swap the <img>/<Image> in and keep the same duotone overlay
 * className on it for visual continuity, or drop the overlay entirely.
 */
export default function PlaceholderImage({
  variant = "road",
  label,
  showCaption = true,
  className = ""
}: {
  variant?: "road" | "wheel" | "car" | "sign";
  label?: string;
  showCaption?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#8B6E46] via-[#B8860B] to-[#D4AF37] ${className}`}
      role="img"
      aria-label={label || "Placeholder image"}
    >
      <div className="absolute inset-0 bg-[#1A1A1A]/20 mix-blend-multiply" aria-hidden="true" />
      <Motif variant={variant} className="relative h-1/2 w-1/2 text-white/85" />
      {label && showCaption && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1A1A1A]/40 px-3 py-1 text-xs font-medium text-white/90">
          {label}
        </span>
      )}
    </div>
  );
}

function Motif({ variant, className }: { variant: string; className?: string }) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.5, viewBox: "0 0 24 24" };
  switch (variant) {
    case "wheel":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 3v6.5M12 14.5V21M4.2 7.5l5.6 3.2M14.2 13.3l5.6 3.2M19.8 7.5l-5.6 3.2M9.8 13.3l-5.6 3.2" />
        </svg>
      );
    case "car":
      return (
        <svg {...common}>
          <path d="M3 13l1.6-4.8A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.2L21 13" />
          <rect x="2" y="13" width="20" height="6" rx="1.5" />
          <circle cx="7" cy="19" r="1.6" />
          <circle cx="17" cy="19" r="1.6" />
        </svg>
      );
    case "sign":
      return (
        <svg {...common}>
          <path d="M12 2l9 5.2v9.6L12 22l-9-5.2V7.2L12 2z" />
          <path d="M12 8v5M12 16v.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 20l4-13h8l4 13" />
          <path d="M2 20h20M12 4v3M9 20l1-3M15 20l-1-3" />
        </svg>
      );
  }
}
