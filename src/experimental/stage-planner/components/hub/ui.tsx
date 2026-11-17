import type { ReactNode, ButtonHTMLAttributes } from "react";
import { stageLegendEntries, type StageEl, type BadgeColor } from "../../lib/hub";

export const BADGE_CLASS: Record<BadgeColor, string> = {
  mode: "border-mode bg-mode/15 text-mode",
  mode2: "border-mode-2 bg-mode-2/15 text-mode-2",
  ok: "border-ok bg-ok/15 text-ok",
  warn: "border-warn bg-warn/15 text-warn",
  danger: "border-destructive bg-destructive/15 text-destructive",
  neutral: "border-muted-foreground/60 bg-secondary text-foreground",
};

/** Abbreviation legend; plain (print) variant inherits text color. */
export function StageLegend({ compact, plain, stage = [] }: { compact?: boolean; plain?: boolean; stage?: StageEl[] }) {
  return (
    <dl className={`grid gap-1 ${compact ? "text-[10px]" : "grid-cols-2 text-xs"}`}>
      {stageLegendEntries(stage).map(([k, v]) => (
        <div key={`${k}:${v}`} className="flex items-center gap-2">
          <dt className={`w-9 shrink-0 rounded border px-1 text-center font-mono font-bold ${plain ? "border-current" : "border-mode text-mode"}`}>{k}</dt>
          <dd className={plain ? "" : "text-muted-foreground"}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Panel({ title, icon, right, children, className = "" }: { title: string; icon?: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`flex min-h-0 flex-col rounded-xl border border-border bg-card ${className}`}>
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
          <span className="text-mode">{icon}</span>
          {title}
        </h2>
        <div className="flex items-center gap-2">{right}</div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
    </section>
  );
}

export function Btn({ children, onClick, tone = "ghost", title, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "ghost" | "mode" | "danger" }) {
  const tones = {
    ghost: "border-border bg-secondary text-secondary-foreground hover:border-mode hover:text-mode",
    mode: "border-mode bg-mode text-mode-foreground hover:brightness-110",
    danger: "border-border bg-secondary text-muted-foreground hover:border-destructive hover:text-destructive",
  };
  return (
    <button
      {...props}
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
