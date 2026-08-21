import React from "react";

/**
 * ಕರ್ನಾಟಕ ಬಾವುಟ · Karnataka Flag
 *
 * Bicolor: yellow (top half) over red (bottom half) — the unofficial state
 * flag widely recognised across Karnataka since the 1960s.
 * Optional Ganda-berunda (double-headed eagle) — Karnataka's official emblem.
 *
 * Fixed issues in this rework:
 *   • Proper 3:2 aspect ratio, preserved (no more horizontal squishing)
 *   • Bigger default sizes so the flag is actually readable
 *   • Sharp red-hex #E63946 + royal yellow #FFCC00 (state palette)
 *   • Subtle brown border + drop-shadow for visibility on any backdrop
 *   • Ganda-berunda drawn as a heraldic silhouette (not a scribble)
 *
 * Usage:
 *   <KarnatakaFlag />                             // 24×16 bicolor pill
 *   <KarnatakaFlag size="sm" />                   // 18×12
 *   <KarnatakaFlag size="lg" withGandaBerunda />  // 48×32 with emblem
 */

const SIZE_MAP = {
  xs: { w: 15, h: 10 },   // 3:2
  sm: { w: 21, h: 14 },
  md: { w: 27, h: 18 },   // default
  lg: { w: 42, h: 28 },
  xl: { w: 60, h: 40 },
};

export function KarnatakaFlag({ size = "md", withGandaBerunda = false, className = "" }) {
  const { w, h } = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <span
      className={`inline-block align-middle ${className}`}
      role="img"
      aria-label="Karnataka flag · ಕರ್ನಾಟಕ ಬಾವುಟ"
      style={{ lineHeight: 0 }}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 60 40"
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: "block",
          borderRadius: 2,
          boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
        }}
      >
        {/* Yellow half */}
        <rect x="0" y="0" width="60" height="20" fill="#FFCC00" />
        {/* Red half */}
        <rect x="0" y="20" width="60" height="20" fill="#E63946" />

        {withGandaBerunda && <GandaBerunda />}

        {/* Subtle border so it reads on white backgrounds too */}
        <rect
          x="0.5" y="0.5"
          width="59" height="39"
          fill="none"
          stroke="rgba(60,25,10,0.35)"
          strokeWidth="1"
        />
      </svg>
    </span>
  );
}

/**
 * Ganda-berunda — Karnataka's official double-headed eagle emblem.
 * Simplified heraldic silhouette (dark ochre) centered on the flag.
 */
function GandaBerunda() {
  return (
    <g transform="translate(30 20)" fill="#5B2A0C">
      {/* Central body */}
      <ellipse cx="0" cy="1" rx="1.6" ry="4" />
      {/* Two heads facing outward */}
      <circle cx="-2.8" cy="-4" r="1.6" />
      <circle cx="2.8" cy="-4" r="1.6" />
      {/* Beaks */}
      <path d="M-4.3 -4 L-5.4 -4.4 L-4.3 -3.4 Z" />
      <path d="M4.3 -4 L5.4 -4.4 L4.3 -3.4 Z" />
      {/* Neck lines connecting heads to body */}
      <path d="M-1.5 -1 L-2.8 -3.5 L-2.2 -3.5 L-0.4 -1 Z" />
      <path d="M1.5 -1 L2.8 -3.5 L2.2 -3.5 L0.4 -1 Z" />
      {/* Wings spread horizontally */}
      <path d="M-1.6 0 Q-6 -1 -8 3 Q-5.5 2 -2 2 Z" />
      <path d="M1.6 0 Q6 -1 8 3 Q5.5 2 2 2 Z" />
      {/* Feather details */}
      <path d="M-6.5 1.5 L-4.5 2 L-4.5 3 Z" fill="#5B2A0C" opacity="0.7" />
      <path d="M6.5 1.5 L4.5 2 L4.5 3 Z" fill="#5B2A0C" opacity="0.7" />
      {/* Tail feathers */}
      <path d="M-1.5 4 L0 6.5 L1.5 4 L1 5 L0 5.5 L-1 5 Z" />
      {/* Legs */}
      <rect x="-1.3" y="3.5" width="0.6" height="1.5" />
      <rect x="0.7" y="3.5" width="0.6" height="1.5" />
      {/* Crown dot on each head */}
      <circle cx="-2.8" cy="-5.4" r="0.4" fill="#FFCC00" stroke="#5B2A0C" strokeWidth="0.3" />
      <circle cx="2.8" cy="-5.4" r="0.4" fill="#FFCC00" stroke="#5B2A0C" strokeWidth="0.3" />
    </g>
  );
}

/**
 * "Made in Karnataka" pill for footer / header.
 * "ಕನ್ನಡ ನಾಡು · Made in Bengaluru, Karnataka"
 */
export function MadeInKarnatakaBadge({ tone = "light" }) {
  const isDark = tone === "dark";
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold border " +
        (isDark
          ? "bg-cotton/10 border-cotton/20 text-cotton"
          : "bg-white border-mysoreGold/40 text-hoysala")
      }
      data-testid="made-in-karnataka-badge"
    >
      <KarnatakaFlag size="sm" />
      <span className="font-kannada" lang="kn">ಬೆಂಗಳೂರಿನಿಂದ</span>
      <span className={isDark ? "text-cotton/60" : "text-muted2"}>·</span>
      <span>Made in Bengaluru, Karnataka</span>
    </span>
  );
}

export default KarnatakaFlag;
