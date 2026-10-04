import React from "react";
import { LeaderboardRowDto } from "@/lib/types";
import { formatTimeTaken } from "@/lib/time";
import { Trophy, Medal } from "lucide-react";

export function LeaderboardTable({
  rows,
  maxScore = 25,
}: {
  rows: LeaderboardRowDto[];
  maxScore?: number;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-navy-700/60 bg-navy-950/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
            <th className="py-3 px-4 w-20">Rank</th>
            <th className="py-3 px-4">Participant</th>
            <th className="py-3 px-4 text-center">Score</th>
            <th className="py-3 px-4 text-right">Time Taken</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-800/60">
          {rows.map((row, idx) => {
            const isPodium = row.rank && row.rank <= 3;
            const rankBadgeColor =
              row.rank === 1
                ? "text-yellow-400"
                : row.rank === 2
                ? "text-slate-300"
                : row.rank === 3
                ? "text-amber-500"
                : "text-slate-400";

            return (
              <tr
                key={`${row.name}-${idx}`}
                className={`transition-colors ${
                  row.isYou
                    ? "bg-navy-800/80 font-semibold border-l-4 border-cricket-gold"
                    : "hover:bg-navy-850/50"
                }`}
              >
                <td className="py-3.5 px-4 font-mono font-black text-base flex items-center gap-1.5">
                  {isPodium ? (
                    <Trophy className={`w-4 h-4 ${rankBadgeColor}`} />
                  ) : (
                    <span className="w-4" />
                  )}
                  <span className={rankBadgeColor}>
                    {row.rank ? `#${row.rank}` : "—"}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-100">
                  <div className="flex items-center gap-2">
                    <span>{row.name}</span>
                    {row.isYou && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-cricket-gold/20 text-cricket-gold border border-cricket-gold/40">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-extrabold text-white text-base">
                  {row.score}{" "}
                  <span className="text-xs font-normal text-slate-400">/{maxScore}</span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400">
                  {formatTimeTaken(row.timeTakenMs)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
