import Link from "next/link";

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 text-ink no-underline ${className ?? ""}`}
    >
      <KinoraGlyph />
      <span
        className="text-[1.3rem] font-extrabold tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Kinora
      </span>
    </Link>
  );
}

export function KinoraGlyph({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id="kg-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#818CF8" />
          <stop offset="1" stopColor="#F43F5E" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" stroke="url(#kg-grad)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="64 12" />
      <path
        d="M11 9v14M11 16l8-7M13 14.5l6.5 8.5"
        stroke="url(#kg-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="9" r="2" fill="#38BDF8" />
    </svg>
  );
}
