import React from "react";
import { LeaderboardRowDto } from "@/lib/types";
import { formatTimeTaken } from "@/lib/time";
import { Trophy } from "lucide-react";

export function LeaderboardCardList({
  rows,
  maxScore = 25,
}: {
  rows: LeaderboardRowDto[];
  maxScore?: number;
}) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {rows.map((row, idx) => {
        const isFirst = row.rank === 1;
        const isPodium = row.rank && row.rank <= 3;

        return (
          <div
            key={`${row.name}-${idx}`}
            className={`p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 border transition-all ${
              row.isYou
                ? "bg-navy-800/90 border-cricket-gold shadow-md"
                : isFirst
                ? "bg-gradient-to-r from-amber-950/40 to-navy-900 border-amber-500/40"
                : "bg-navy-900/80 border-navy-700/70"
            }`}
          >
            {/* Rank + Name */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border ${
                  isFirst
                    ? "bg-yellow-500 text-navy-950 border-yellow-300 shadow-md"
                    : isPodium
                    ? "bg-navy-800 text-cricket-gold border-cricket-gold/40"
                    : "bg-navy-950 text-slate-300 border-navy-700"
                }`}
              >
                {row.rank ? `#${row.rank}` : "—"}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm">{row.name}</span>
                  {row.isYou && (
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-cricket-gold/20 text-cricket-gold border border-cricket-gold/40">
                      You
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {formatTimeTaken(row.timeTakenMs)}
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-end">
              <span className="font-mono text-lg font-black text-white">
                {row.score}
                <span className="text-xs text-slate-400 font-normal">/{maxScore}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                pts
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
