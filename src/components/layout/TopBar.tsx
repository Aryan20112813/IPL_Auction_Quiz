"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Flame } from "lucide-react";
import { Badge } from "../ui/Badge";

export interface TopBarProps {
  roomCode?: string;
  stateBadge?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function TopBar({ roomCode, stateBadge, rightAction }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-navy-700/80 px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cricket-orange to-[#EA580C] flex items-center justify-center shadow-md shadow-orange-950/50 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              IPL QUIZ
              <Flame className="w-4 h-4 text-cricket-gold fill-cricket-gold animate-bounce" />
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider hidden sm:inline">
              Auction Edition
            </span>
          </div>
        </Link>

        {/* Center / Room Code */}
        {roomCode && (
          <div className="flex items-center gap-2 bg-navy-900/90 border border-navy-700/80 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Room:</span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-cricket-gold tracking-widest">
              {roomCode}
            </span>
          </div>
        )}

        {/* Right Action / Badges */}
        <div className="flex items-center gap-2">
          {stateBadge}
          {rightAction}
        </div>
      </div>
    </header>
  );
}
