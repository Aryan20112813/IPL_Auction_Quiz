import React from "react";
import { Clock, Trophy } from "lucide-react";
import { Spinner } from "../ui/Spinner";

export function ClosedQuizNotice({
  reason,
  resultsReady,
}: {
  reason?: string | null;
  resultsReady: boolean;
}) {
  const isExpired = reason === "EXPIRED";

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto my-12 glass-card rounded-2xl border border-cricket-orange/30">
      <div className="w-16 h-16 rounded-2xl bg-navy-800/80 border border-cricket-orange/40 flex items-center justify-center mb-4 text-cricket-gold">
        {resultsReady ? (
          <Trophy className="w-8 h-8 text-cricket-gold" />
        ) : (
          <Clock className="w-8 h-8 text-cricket-orange" />
        )}
      </div>

      <h2 className="text-2xl font-black text-white mb-2">
        {isExpired ? "Time's Up! Quiz Expired" : "Quiz Ended by Host"}
      </h2>

      <p className="text-slate-300 text-sm mb-6 leading-relaxed">
        {resultsReady
          ? "Final scoring and ranking are complete! Loading official results..."
          : "The quiz window is closed. Stragglers have been auto-submitted and the server is calculating final rankings."}
      </p>

      {!resultsReady && (
        <div className="flex items-center gap-3 bg-navy-900/90 border border-navy-700 px-4 py-2.5 rounded-xl">
          <Spinner size="sm" />
          <span className="text-xs font-semibold text-slate-300">
            Finalizing scores & leaderboard...
          </span>
        </div>
      )}
    </div>
  );
}
