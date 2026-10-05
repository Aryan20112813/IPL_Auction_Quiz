import React from "react";
import { Users, Hourglass, CheckCircle2, AlertOctagon } from "lucide-react";

export interface DashboardCountsProps {
  counts: {
    joined: number;
    inProgress: number;
    submitted: number;
    autoSubmitted: number;
  };
}

export function DashboardCounts({ counts }: DashboardCountsProps) {
  const items = [
    {
      label: "Total Joined",
      value: counts.joined,
      icon: Users,
      color: "text-blue-400",
      border: "border-blue-500/30",
      bg: "from-blue-950/40 to-navy-900/60",
    },
    {
      label: "Answering",
      value: counts.inProgress,
      icon: Hourglass,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "from-amber-950/40 to-navy-900/60",
    },
    {
      label: "Submitted",
      value: counts.submitted,
      icon: CheckCircle2,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "from-emerald-950/40 to-navy-900/60",
    },
    {
      label: "Auto-Submitted",
      value: counts.autoSubmitted,
      icon: AlertOctagon,
      color: "text-purple-400",
      border: "border-purple-500/30",
      bg: "from-purple-950/40 to-navy-900/60",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.label}
            className={`p-3 sm:p-5 rounded-2xl glass-card bg-gradient-to-br ${it.bg} border ${it.border} flex items-center gap-2.5 sm:gap-3.5 shadow-lg`}
          >
            <div className={`p-2 sm:p-2.5 rounded-xl bg-navy-950/60 border border-navy-700/60 ${it.color} shrink-0`}>
              <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-2xl font-black text-white">{it.value}</span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
                {it.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
