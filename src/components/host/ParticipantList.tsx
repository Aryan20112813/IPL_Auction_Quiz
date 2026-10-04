import React from "react";
import { Users, User } from "lucide-react";

export function ParticipantList({
  participants,
  count,
}: {
  participants: Array<{ id: string; displayName: string }>;
  count: number;
}) {
  return (
    <div className="w-full glass-card rounded-2xl p-5 border border-navy-700/80">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-navy-700/60">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Users className="w-4 h-4 text-cricket-orange" />
          Joined Participants ({count})
        </h3>
        <span className="text-xs text-slate-400 font-medium">Updates live</span>
      </div>

      {count === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">
          No participants have joined yet. Share the Room Code to get started!
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
          {participants.map((p) => (
            <div
              key={p.id}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-navy-900/90 border border-navy-700/80 text-sm font-semibold text-slate-200 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{p.displayName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
