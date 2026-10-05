import React from "react";
import { HostDashboardRowDto } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { formatTimeTaken } from "@/lib/time";
import { Trophy, Clock } from "lucide-react";

export interface RankingTableProps {
  rows: HostDashboardRowDto[];
  isFinal: boolean;
  totalQuestions?: number;
  onRemove?: (participant: { id: string; name: string }) => void;
}

export function RankingTable({
  rows,
  isFinal,
  totalQuestions = 25,
  onRemove,
}: RankingTableProps) {
  return (
    <div className="w-full glass-card rounded-2xl border border-navy-700/80 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-navy-700/60 bg-navy-900/60">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cricket-gold" />
            Ranking & Leaderboard
          </h3>
          <Badge variant={isFinal ? "gold" : "submitted"}>
            {isFinal ? "Final Official" : "Provisional Live"}
          </Badge>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          {rows.length} participants listed
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No participant activity recorded yet.
        </div>
      ) : (
        <>
          {/* Desktop / Tablet Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-navy-700/60 bg-navy-950/40 text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Answered</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-right">Time Taken</th>
                  {onRemove && <th className="py-3 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {rows.map((row) => (
                  <tr
                    key={row.participantId}
                    className="hover:bg-navy-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-extrabold text-cricket-gold">
                      {row.rank ? `#${row.rank}` : "—"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4">
                      {row.status === "SUBMITTED" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          Submitted
                        </span>
                      ) : row.status === "AUTO_SUBMITTED" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-950/60 text-purple-400 border border-purple-500/30">
                          Auto-Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-500/30">
                          Answering...
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      {row.answered} / {totalQuestions}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-base text-white">
                      {row.score !== null ? row.score : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400">
                      {row.timeTakenMs !== null ? formatTimeTaken(row.timeTakenMs) : "—"}
                    </td>
                    {onRemove && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onRemove({ id: row.participantId, name: row.name })}
                          className="px-2 py-0.5 rounded text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-950/60 transition"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-navy-800/80">
            {rows.map((row) => (
              <div key={row.participantId} className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center font-mono font-extrabold text-cricket-gold text-xs shrink-0">
                      {row.rank ? `#${row.rank}` : "—"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-100 text-sm truncate">{row.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {row.answered}/{totalQuestions} answered {row.timeTakenMs ? `· ${formatTimeTaken(row.timeTakenMs)}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-base font-black text-white">
                      {row.score !== null ? `${row.score} pts` : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div>
                    {row.status === "SUBMITTED" ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        Submitted
                      </span>
                    ) : row.status === "AUTO_SUBMITTED" ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-950/60 text-purple-400 border border-purple-500/30">
                        Auto-Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-400 border border-amber-500/30">
                        Answering...
                      </span>
                    )}
                  </div>

                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove({ id: row.participantId, name: row.name })}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold text-red-400 border border-red-500/30 hover:bg-red-950/60 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
