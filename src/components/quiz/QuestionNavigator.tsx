"use client";

import React from "react";
import { Check } from "lucide-react";

export interface QuestionNavigatorProps {
  totalQuestions?: number;
  currentPosition: number;
  answers: Record<number, "A" | "B" | "C" | "D">;
  onSelectPosition: (position: number) => void;
}

export function QuestionNavigator({
  totalQuestions = 25,
  currentPosition,
  answers,
  onSelectPosition,
}: QuestionNavigatorProps) {
  const positions = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div className="w-full glass-card rounded-2xl p-4 sm:p-5 border border-navy-700/80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Question Navigator
        </h3>
        <span className="text-xs font-bold text-cricket-gold">
          {Object.keys(answers).length} / {totalQuestions} Answered
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {positions.map((pos) => {
          const isAnswered = !!answers[pos];
          const isCurrent = pos === currentPosition;

          let btnClass = "bg-navy-900/80 border-navy-700 text-slate-400 hover:border-slate-500";

          if (isCurrent) {
            btnClass =
              "bg-gradient-to-br from-cricket-orange to-[#EA580C] text-white font-extrabold border-orange-400 ring-2 ring-cricket-orange shadow-lg shadow-orange-950/40";
          } else if (isAnswered) {
            btnClass =
              "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold hover:bg-emerald-900/60";
          }

          return (
            <button
              key={pos}
              type="button"
              onClick={() => onSelectPosition(pos)}
              aria-label={`Jump to question ${pos}${isAnswered ? " (Answered)" : ""}${isCurrent ? " (Current)" : ""}`}
              className={`relative h-11 sm:h-12 rounded-xl flex items-center justify-center text-sm font-semibold border transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cricket-orange ${btnClass}`}
            >
              <span>{pos}</span>
              {isAnswered && !isCurrent && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
