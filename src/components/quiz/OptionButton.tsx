"use client";

import React from "react";
import { Check } from "lucide-react";

export interface OptionButtonProps {
  label: "A" | "B" | "C" | "D";
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  shortcut?: string;
  disabled?: boolean;
}

export function OptionButton({
  label,
  text,
  isSelected,
  onSelect,
  shortcut,
  disabled = false,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={disabled}
      onClick={onSelect}
      className={`group relative w-full min-h-[52px] sm:min-h-[56px] p-3 sm:p-4 rounded-2xl flex items-center gap-2.5 sm:gap-4 text-left transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cricket-orange ${
        isSelected
          ? "bg-gradient-to-r from-navy-800 to-navy-900 border-2 border-cricket-orange shadow-lg shadow-orange-950/40 glow-orange"
          : "bg-navy-900/80 hover:bg-navy-800/80 border border-navy-700 text-slate-200"
      }`}
    >
      {/* Option Letter Bubble */}
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-all ${
          isSelected
            ? "bg-cricket-orange text-white font-extrabold shadow-md scale-105"
            : "bg-navy-800 text-slate-300 border border-navy-600 group-hover:border-slate-400 group-hover:text-white"
        }`}
      >
        {label}
      </div>

      {/* Option Text */}
      <span
        className={`flex-1 text-sm sm:text-lg font-medium leading-snug break-words min-w-0 ${
          isSelected ? "text-white font-semibold" : "text-slate-200"
        }`}
      >
        {text}
      </span>

      {/* Selection Checkmark & Keyboard Shortcut */}
      <div className="flex items-center gap-2 shrink-0">
        {shortcut && (
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-navy-800 text-slate-400 border border-navy-700">
            {shortcut}
          </span>
        )}
        {isSelected && (
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
          </div>
        )}
      </div>
    </button>
  );
}
