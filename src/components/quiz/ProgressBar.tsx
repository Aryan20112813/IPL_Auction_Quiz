import React from "react";

export function ProgressBar({
  current,
  total = 25,
}: {
  current: number;
  total?: number;
}) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
        <span>Progress</span>
        <span>
          {current} of {total} Answered ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-navy-900 border border-navy-700/80 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cricket-orange to-cricket-gold transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
