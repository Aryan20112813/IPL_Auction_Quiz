import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "waiting" | "active" | "ended" | "submitted" | "gold" | "neutral";
}

export function Badge({
  children,
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    waiting: "bg-blue-900/60 text-blue-300 border-blue-500/40",
    active: "bg-emerald-950/80 text-emerald-400 border-emerald-500/50 animate-pulse-subtle",
    ended: "bg-slate-800/80 text-slate-300 border-slate-600/50",
    submitted: "bg-amber-950/70 text-amber-300 border-amber-500/40",
    gold: "bg-yellow-950/80 text-yellow-300 border-yellow-500/50 font-bold",
    neutral: "bg-navy-800/80 text-slate-300 border-navy-600/50",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {variant === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      )}
      {children}
    </span>
  );
}
