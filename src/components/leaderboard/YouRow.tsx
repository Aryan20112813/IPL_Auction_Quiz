import React from "react";
import { formatTimeTaken } from "@/lib/time";
import { Trophy, Award } from "lucide-react";

export function YouRow({
  rank,
  score,
  maxScore = 25,
  timeTakenMs,
  name,
}: {
  rank: number | null;
  score: number;
  maxScore?: number;
  timeTakenMs: number;
  name?: string;
}) {
  return (
    <div className="w-full rounded-2xl glass-card border-2 border-cricket-gold/60 p-4 sm:p-5 shadow-2xl glow-gold bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cricket-gold to-[#EAB308] text-navy-950 font-black text-lg flex items-center justify-center shadow-md">
            {rank ? `#${rank}` : "—"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cricket-gold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Your Result
            </span>
            <span className="text-base sm:text-lg font-bold text-white">
              {name || "You"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Time taken: {formatTimeTaken(timeTakenMs)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            {score}
            <span className="text-sm font-semibold text-slate-400">/{maxScore}</span>
          </span>
          <span className="text-[11px] font-semibold text-cricket-gold">
            Points
          </span>
        </div>
      </div>
    </div>
  );
}
