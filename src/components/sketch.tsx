import type { ReactNode, CSSProperties } from "react";

export function SketchDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={`w-full h-6 ${className}`}
      aria-hidden
    >
      <path
        d="M0,12 C 60,4 120,20 180,12 S 300,4 360,12 480,20 540,12 660,4 720,12 840,20 900,12 1020,4 1080,12 1200,20 1200,12"
        fill="none"
        stroke="#1A2F6B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Asterisk({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <g stroke="#1A2F6B" strokeWidth="1.6" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" />
        <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" />
      </g>
    </svg>
  );
}

export function SketchPlaceholder({
  label,
  className = "",
  style,
  children,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`dashed-frame flex items-center justify-center text-center p-4 ${className}`}
      style={style}
    >
      <div className="flex flex-col items-center gap-2 font-serif italic text-ink/80">
        <span className="font-brush text-2xl opacity-70">✦</span>
        <span className="text-sm md:text-base">{label}</span>
        {children}
      </div>
    </div>
  );
}

export function CoverImage({
  src,
  alt,
  label = "Cover Unavailable",
  className = "",
}: { src?: string; alt: string; label?: string; className?: string }) {
  return (
    <div className={`sketch-border-tight overflow-hidden bg-card relative aspect-[2/3] ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
            const fb = el.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="absolute inset-0 hidden items-center justify-center text-center p-3 font-serif italic text-ink/80"
        style={{ display: src ? "none" : "flex" }}
      >
        ✦ {label}
      </div>
    </div>
  );
}
