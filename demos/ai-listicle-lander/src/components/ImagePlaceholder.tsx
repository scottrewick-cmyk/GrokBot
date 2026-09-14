import type { Category, ListicleReason } from "../types";

interface Props {
  category: Category;
  reason: ListicleReason;
}

export function ImagePlaceholder({ category, reason }: Props) {
  return (
    <figure className={`ph ph-${category}`}>
      <div className="ph-frame" aria-hidden="true">
        {category === "water" ? <WaterArt index={reason.number} /> : null}
        {category === "wellness" ? <KneeArt index={reason.number} /> : null}
        {category === "generic" ? <GenericArt index={reason.number} /> : null}
        <span className="ph-label">{reason.imageLabel}</span>
      </div>
      <figcaption>{reason.imageCaption}</figcaption>
    </figure>
  );
}

function WaterArt({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 320 200" className="ph-art">
      <defs>
        <linearGradient id={`w${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b7e3e1" />
          <stop offset="1" stopColor="#0f6e73" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="#d7eceb" />
      <circle cx="86" cy="78" r="36" fill={`url(#w${index})`} opacity="0.85" />
      <rect x="160" y="28" width="120" height="144" rx="12" fill="#0f6e73" opacity="0.18" />
      <path d="M70 150c20 18 54 18 74 0" stroke="#0f6e73" strokeWidth="6" fill="none" />
      <path d="M200 48h48M200 78h64M200 108h40" stroke="#0f6e73" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function KneeArt({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 320 200" className="ph-art">
      <rect width="320" height="200" fill="#f3ddd6" />
      <path
        d={`M${70 + (index % 3) * 6} 30c20 40 20 90 8 140`}
        stroke="#9a3b2f"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
      <rect x="150" y="54" width="130" height="92" rx="18" fill="#9a3b2f" opacity="0.2" />
      <circle cx="118" cy="104" r="28" fill="#9a3b2f" opacity="0.45" />
      <path d="M168 84h90M168 108h70M168 132h50" stroke="#9a3b2f" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function GenericArt({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 320 200" className="ph-art">
      <rect width="320" height="200" fill="#efe4cc" />
      <rect x="36" y="40" width="110" height="120" rx="8" fill="#8a6a1f" opacity="0.2" />
      <circle cx="210" cy="96" r={28 + (index % 4) * 4} fill="#8a6a1f" opacity="0.25" />
      <path d="M176 140h88" stroke="#8a6a1f" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
