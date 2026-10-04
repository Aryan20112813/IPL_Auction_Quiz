"use client";

import React, { useEffect } from "react";
import { QuestionDto } from "@/lib/types";
import { OptionButton } from "./OptionButton";
import { Trash2 } from "lucide-react";

export interface QuestionCardProps {
  question: QuestionDto;
  totalQuestions?: number;
  selectedOption?: "A" | "B" | "C" | "D" | null;
  onSelectOption: (option: "A" | "B" | "C" | "D" | null) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  totalQuestions = 25,
  selectedOption,
  onSelectOption,
  disabled = false,
}: QuestionCardProps) {
  const options: Array<{ label: "A" | "B" | "C" | "D"; text: string; shortcut: string }> = [
    { label: "A", text: question.options.A, shortcut: "A / 1" },
    { label: "B", text: question.options.B, shortcut: "B / 2" },
    { label: "C", text: question.options.C, shortcut: "C / 3" },
    { label: "D", text: question.options.D, shortcut: "D / 4" },
  ];

  // Keyboard shortcut listener (1-4 and A-D)
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key === "1" || key === "A") {
        onSelectOption("A");
      } else if (key === "2" || key === "B") {
        onSelectOption("B");
      } else if (key === "3" || key === "C") {
        onSelectOption("C");
      } else if (key === "4" || key === "D") {
        onSelectOption("D");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, onSelectOption]);

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-8 flex flex-col gap-6 shadow-2xl border border-navy-700/80">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-700/60">
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cricket-orange">
          Question {question.position} of {totalQuestions}
        </span>
        {selectedOption && !disabled && (
          <button
            type="button"
            onClick={() => onSelectOption(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear selection</span>
          </button>
        )}
      </div>

      {/* Question Text */}
      <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
        {question.text}
      </h2>

      {/* Options Radio Group */}
      <div
        role="radiogroup"
        aria-label={`Options for question ${question.position}`}
        className="flex flex-col gap-3"
      >
        {options.map((opt) => (
          <OptionButton
            key={opt.label}
            label={opt.label}
            text={opt.text}
            shortcut={opt.shortcut}
            isSelected={selectedOption === opt.label}
            onSelect={() => onSelectOption(opt.label)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
