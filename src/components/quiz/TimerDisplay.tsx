"use client";

import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { useServerClock } from "@/hooks/useServerClock";

export interface TimerDisplayProps {
  endsAtIso?: string | null;
  onExpire?: () => void;
  className?: string;
}

export function TimerDisplay({ endsAtIso, onExpire, className = "" }: TimerDisplayProps) {
  const { formatted, isWarning10m, isWarning1m, isExpired } = useServerClock(
    endsAtIso,
    onExpire
  );

  let stateStyles = "bg-navy-900/90 border-navy-700 text-slate-100";
  if (isExpired) {
    stateStyles = "bg-red-950/80 border-red-500 text-red-400 font-bold";
  } else if (isWarning1m) {
    stateStyles = "bg-red-950/80 border-red-500 text-red-400 animate-pulse font-extrabold shadow-red-950/50";
  } else if (isWarning10m) {
    stateStyles = "bg-amber-950/80 border-amber-500 text-amber-300 font-bold";
  }

  return (
    <div
      aria-live="polite"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-inner transition-colors duration-300 select-none ${stateStyles} ${className}`}
    >
      {isWarning1m || isWarning10m ? (
        <AlertTriangle className="w-4 h-4 shrink-0 text-current animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 shrink-0 text-cricket-gold" />
      )}
      <span className="font-mono text-sm sm:text-base font-bold tracking-wider">
        {formatted}
      </span>
    </div>
  );
}
