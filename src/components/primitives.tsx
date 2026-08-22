import type { ReactNode, SVGProps, ButtonHTMLAttributes } from "react";
import type { ToastMsg } from "../lib/types";

/* ---------------- inline icons ---------------- */

type IP = SVGProps<SVGSVGElement> & { size?: number };
const base = (p: IP) => ({
  width: p.size ?? 18,
  height: p.size ?? 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const IcCheck = (p: IP) => (
  <svg {...base(p)}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);
export const IcArrowR = (p: IP) => (
  <svg {...base(p)}>
    <path d="M4 12h16M13 5l7 7-7 7" />
  </svg>
);
export const IcArrowL = (p: IP) => (
  <svg {...base(p)}>
    <path d="M20 12H4M11 5l-7 7 7 7" />
  </svg>
);
export const IcDownload = (p: IP) => (
  <svg {...base(p)}>
    <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" />
  </svg>
);
export const IcCopy = (p: IP) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" transform="translate(1,1)" />
  </svg>
);
export const IcReset = (p: IP) => (
  <svg {...base(p)}>
    <path d="M3 12a9 9 0 1 0 3-6.7M3 3v6h6" />
  </svg>
);
export const IcSpark = (p: IP) => (
  <svg {...base(p)}>
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
  </svg>
);
export const IcAlert = (p: IP) => (
  <svg {...base(p)}>
    <path d="M12 3l10 18H2L12 3zM12 10v5" />
    <circle cx="12" cy="18" r="0.6" fill="currentColor" />
  </svg>
);
export const IcX = (p: IP) => (
  <svg {...base(p)}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);
export const IcSend = (p: IP) => (
  <svg {...base(p)}>
    <path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" />
  </svg>
);
export const IcUser = (p: IP) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
  </svg>
);
export const IcMail = (p: IP) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);
export const IcPhone = (p: IP) => (
  <svg {...base(p)}>
    <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />
  </svg>
);
export const IcEdit = (p: IP) => (
  <svg {...base(p)}>
    <path d="M4 20h4L20 8a2.8 2.8 0 1 0-4-4L4 16v4zM13.5 6.5l4 4" />
  </svg>
);
export const IcDot = (p: IP) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <circle cx="12" cy="12" r="6" />
  </svg>
);
export const IcWhatsApp = (p: IP) => (
  <svg {...base(p)}>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.6A8.5 8.5 0 1 1 21 11.5z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .5c-.8-.4-1.6-1.2-2-2l.5-1-1-2z" />
  </svg>
);

/* ---------------- hard button ---------------- */

type BtnVariant = "ink" | "gold" | "ghost" | "flame" | "paperline";
export function HardButton({
  variant = "ink",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const styles: Record<BtnVariant, string> = {
    ink: "bg-ink text-paper border-ink shadow-hard hover:shadow-[7px_7px_0_0_rgba(23,26,33,0.9)] hover:-translate-y-0.5",
    gold: "bg-gold text-[#f4f7ff] border-ink shadow-hard hover:shadow-[7px_7px_0_0_rgba(23,26,33,0.9)] hover:-translate-y-0.5",
    flame: "bg-flame text-paper border-ink shadow-hard hover:shadow-[7px_7px_0_0_rgba(23,26,33,0.9)] hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-ink border-ink/30 hover:border-ink hover:bg-card active:translate-y-0.5",
    paperline:
      "bg-transparent text-paper border-paper/35 hover:border-gold hover:text-gold active:translate-y-0.5",
  };
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border-2 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-all duration-150 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------------- toasts ---------------- */

export function ToastHost({
  toasts,
  onDismiss,
}: {
  toasts: ToastMsg[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={`pointer-events-auto flex items-center gap-3 rounded-lg border-2 border-ink px-4 py-3 text-left font-mono text-xs font-bold shadow-hard-sm animate-toast-in ${
            t.tone === "ok"
              ? "bg-leaf text-paper"
              : t.tone === "warn"
                ? "bg-gold text-[#f4f7ff]"
                : "bg-pine text-paper"
          }`}
        >
          <span className="shrink-0">
            {t.tone === "ok" ? <IcCheck size={15} /> : t.tone === "warn" ? <IcAlert size={15} /> : <IcSpark size={15} />}
          </span>
          {t.msg}
        </button>
      ))}
    </div>
  );
}

/* ---------------- modal ---------------- */

export function Modal({
  open,
  title,
  children,
  actions,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  actions: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border-2 border-ink bg-card p-6 shadow-hard animate-pop"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-extrabold leading-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md border-2 border-ink/15 p-1.5 text-ink/60 transition hover:border-flame hover:text-flame"
            aria-label="Fechar"
          >
            <IcX size={14} />
          </button>
        </div>
        <div className="mb-6 text-sm leading-relaxed text-ink/75">{children}</div>
        <div className="flex flex-wrap justify-end gap-3">{actions}</div>
      </div>
    </div>
  );
}

/* ---------------- dial ---------------- */

export function Dial({
  value,
  size = 110,
  label,
  dark = false,
}: {
  value: number;
  size?: number;
  label?: string;
  dark?: boolean;
}) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow opacity-60">
        <circle cx="50" cy="50" r="47" fill="none" stroke={dark ? "rgba(238,241,246,0.35)" : "rgba(23,26,33,0.3)"} strokeWidth="1.4" strokeDasharray="3 6" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke={dark ? "rgba(238,241,246,0.15)" : "rgba(23,26,33,0.12)"} strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={dark ? "#5b8cff" : "#1f5fd6"}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * v) / 100}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="text-center">
        <div className={`font-display text-2xl font-extrabold leading-none ${dark ? "text-gold" : "text-ink"}`}>
          {v}%
        </div>
        {label && (
          <div className={`mt-1 font-mono text-[9px] uppercase tracking-widest ${dark ? "text-paper/60" : "text-ink/50"}`}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- rotating stamp ---------------- */

export function Stamp({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="h-full w-full animate-spin-slower">
        <defs>
          <path id="stampcirc" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.5 5" />
        <text fontSize="10.2" letterSpacing="2.6" fill="currentColor" fontFamily="Space Mono, monospace" fontWeight="700">
          <textPath href="#stampcirc">REBRANDING 360º · BRIEFING INTERATIVO ·</textPath>
        </text>
        <path d="M52 54l6 6 12-13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ---------------- marquee ---------------- */

export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 font-mono text-[11px] font-bold uppercase tracking-[0.22em]">{it}</span>
          <IcSpark size={10} className="text-gold" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-b-2 border-ink bg-ink py-2 text-paper">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
