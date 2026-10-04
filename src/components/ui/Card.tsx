import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "glow" | "gold";
}

export function Card({
  children,
  variant = "glass",
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    glass: "glass-card border border-navy-700/80 text-slate-100",
    solid: "bg-navy-900 border border-navy-800 text-slate-100 shadow-xl",
    glow: "glass-card border border-cricket-orange/40 glow-orange text-slate-100",
    gold: "glass-card border border-cricket-gold/40 glow-gold text-slate-100",
  };

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
