/**
 * Karnataka Motifs
 * Lightweight SVG components rooted in Karnataka's temple + folk visual tradition.
 * - HoysalaStar   — 12-point star from Halebidu / Belur temple plan
 * - Gopura        — south-Indian temple gate silhouette (Vijayanagara / Dravida style)
 * - Nandi         — the seated bull, guardian of Shiva (iconic Karnataka temple front)
 * - Kalasha       — brass pot with mango leaves + coconut, marker of every shubh karya
 * - TulsiKatte    — walled tulsi platform found in every Karnataka home courtyard
 * - Deepa         — brass diya
 * - PattadaKumbha — Chalukya pot pattern used as accent
 *
 * All accept `className` for size/colour and adopt `currentColor` for stroke/fill.
 */
export function HoysalaStar({ className = "" }) {
  // 12-point rotational star, a signature of Hoysala temple ground-plans.
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
      {[0, 30, 60, 90, 120, 150].map((r) => (
        <rect key={r} x="35" y="8" width="30" height="84" rx="3"
          transform={`rotate(${r} 50 50)`}
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      ))}
      <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

export function Gopura({ className = "" }) {
  // Simplified Vijayanagara-style temple gopura silhouette (5 tiers + kalasha).
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M50 4 L52 12 L48 12 Z" fill="currentColor" />
      <circle cx="50" cy="14" r="2.4" fill="currentColor" />
      <path d="M42 18 h16 v6 h-16 z" />
      <path d="M38 26 l12 -4 l12 4 v6 h-24 z" />
      <path d="M34 34 l16 -4 l16 4 v10 h-32 z" />
      <path d="M30 46 l20 -4 l20 4 v12 h-40 z" />
      <path d="M24 60 l26 -4 l26 4 v14 h-52 z" />
      <path d="M18 76 l32 -3 l32 3 v18 h-64 z" />
      <path d="M14 96 h72 v20 h-72 z" />
      <rect x="44" y="102" width="12" height="14" fill="currentColor" opacity="0.15" />
      <line x1="10" y1="116" x2="90" y2="116" strokeWidth="2" />
    </svg>
  );
}

export function Nandi({ className = "" }) {
  // Seated Nandi bull silhouette (temple entrance guardian).
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true" fill="currentColor">
      {/* body */}
      <path d="M22 70 Q22 46 44 42 Q56 40 68 42 Q92 44 98 62 Q100 72 92 74 L88 74 L86 78 L80 78 L80 74 L44 74 L44 78 L38 78 L36 74 L28 74 Q22 74 22 70 Z" />
      {/* hump */}
      <path d="M56 40 Q60 30 68 30 Q76 32 72 42 Z" />
      {/* head + horns */}
      <path d="M92 44 Q102 42 108 48 Q112 52 108 56 Q104 60 96 58 Q94 62 90 60 Z" />
      <path d="M108 48 Q112 42 116 44 Q114 50 108 52 Z" />
      <path d="M102 42 Q106 36 110 38 Q108 44 104 46 Z" />
      {/* eye + snout */}
      <circle cx="104" cy="52" r="1.4" fill="#fff" />
      <path d="M108 56 Q112 58 108 60 Z" fill="#fff" opacity="0.35" />
      {/* bell */}
      <path d="M58 58 Q58 66 62 66 Q66 66 66 58" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="62" cy="68" r="2" />
    </svg>
  );
}

export function Kalasha({ className = "" }) {
  // Brass kalasha with mango leaves and coconut on top.
  return (
    <svg viewBox="0 0 60 100" className={className} aria-hidden="true" fill="currentColor">
      {/* coconut */}
      <ellipse cx="30" cy="14" rx="8" ry="10" />
      <path d="M22 12 Q30 6 38 12" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
      {/* mango leaves */}
      <path d="M14 30 Q18 20 30 24 Q42 20 46 30 Q42 34 30 32 Q18 34 14 30 Z" opacity="0.85" />
      {/* pot mouth */}
      <path d="M12 34 h36 v6 h-36 z" />
      {/* pot body */}
      <path d="M14 40 Q6 60 14 80 Q30 90 46 80 Q54 60 46 40 Z" />
      {/* pot band */}
      <rect x="14" y="56" width="32" height="4" fill="#fff" opacity="0.2" />
      {/* base */}
      <path d="M18 82 h24 v6 h-24 z" />
    </svg>
  );
}

export function TulsiKatte({ className = "" }) {
  // Walled tulsi platform — every Karnataka home once had one at the entrance.
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M14 82 h72 v12 h-72 z" fill="currentColor" opacity="0.15" />
      <path d="M20 48 h60 v34 h-60 z" fill="currentColor" opacity="0.08" />
      <line x1="20" y1="60" x2="80" y2="60" />
      <line x1="20" y1="72" x2="80" y2="72" />
      <path d="M46 30 Q40 20 46 12 Q50 8 54 12 Q60 20 54 30 Z" fill="currentColor" opacity="0.6" />
      <path d="M48 30 v18" strokeWidth="2" />
      <path d="M36 44 Q44 40 50 44 Q56 40 64 44" strokeWidth="1.2" />
    </svg>
  );
}

export function Deepa({ className = "" }) {
  // Brass lamp with a flame.
  return (
    <svg viewBox="0 0 60 100" className={className} aria-hidden="true" fill="currentColor">
      {/* flame */}
      <path d="M30 10 Q22 24 30 40 Q38 24 30 10 Z" opacity="0.9" />
      <path d="M30 16 Q26 24 30 34 Q34 24 30 16 Z" fill="#fff" opacity="0.5" />
      {/* wick base */}
      <path d="M22 40 h16 v6 h-16 z" />
      {/* dish */}
      <path d="M12 46 h36 q6 6 -6 12 h-24 q-12 -6 -6 -12 z" />
      {/* stem */}
      <rect x="27" y="58" width="6" height="24" />
      <path d="M18 82 h24 v10 h-24 z" />
    </svg>
  );
}

/**
 * Repeatable band of small Hoysala stars — for section dividers.
 */
export function HoysalaBand({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <div className="h-px flex-1 bg-mysoreGold/40" />
      <HoysalaStar className="w-4 h-4 text-mysoreGold" />
      <HoysalaStar className="w-3 h-3 text-kumkuma opacity-60" />
      <HoysalaStar className="w-4 h-4 text-mysoreGold" />
      <div className="h-px flex-1 bg-mysoreGold/40" />
    </div>
  );
}
