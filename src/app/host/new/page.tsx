"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Clock,
  HelpCircle,
  Trophy,
  Timer,
  ChevronRight,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api-client";
import { CreateQuizResponseDto } from "@/lib/types";

// ─── Duration presets ────────────────────────────────────────────────────────
const DURATION_PRESETS = [
  { label: "15 min", seconds: 900 },
  { label: "30 min", seconds: 1800 },
  { label: "45 min", seconds: 2700 },
  { label: "1 hr", seconds: 3600 },
  { label: "1.5 hr", seconds: 5400 },
  { label: "2 hr", seconds: 7200 },
  { label: "3 hr", seconds: 10800 },
];

const DEFAULT_DURATION = 7200; // 2 hours

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} minute${m !== 1 ? "s" : ""}`;
  if (m === 0) return `${h} hour${h !== 1 ? "s" : ""}`;
  return `${h} hr ${m} min`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function HostCreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_DURATION);
  const [isCustom, setIsCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPreset = DURATION_PRESETS.some((p) => p.seconds === durationSeconds);

  const handlePresetClick = (seconds: number) => {
    setDurationSeconds(seconds);
    setIsCustom(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mins = parseInt(e.target.value, 10);
    setCustomMinutes(mins);
    setDurationSeconds(mins * 60);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch<CreateQuizResponseDto>("/api/v1/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim() || undefined,
          durationSeconds,
        }),
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(`ipl-quiz:host:${response.code}`, response.hostToken);
      }

      router.push(`/host/${response.code}`);
    } catch (err: any) {
      setError(err.message || "Failed to create quiz. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <TopBar />

      <main className="max-w-xl mx-auto w-full px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card variant="glass" className="border-cricket-orange/30 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-navy-700/60">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cricket-orange to-[#EA580C] text-white flex items-center justify-center shadow-lg shadow-orange-950/50">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Create New Quiz</h1>
              <p className="text-xs text-slate-400">Set up an instant room for your event</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col gap-6">
            {/* Title */}
            <Input
              label="Quiz Title (Optional)"
              placeholder="e.g., Auction Round 1 — Mega Trivia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              helperText="Give your quiz a friendly name (maximum 60 characters)"
            />

            {/* ── Duration Picker ── */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Timer className="w-3.5 h-3.5 text-cricket-orange" />
                Quiz Duration
              </label>

              {/* Preset chips */}
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => {
                  const active = durationSeconds === preset.seconds && !isCustom;
                  return (
                    <button
                      key={preset.seconds}
                      type="button"
                      onClick={() => handlePresetClick(preset.seconds)}
                      className={`
                        px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150
                        ${
                          active
                            ? "bg-cricket-orange text-white border-cricket-orange shadow-md shadow-orange-900/40 scale-105"
                            : "bg-navy-950/60 text-slate-300 border-navy-700/80 hover:border-cricket-orange/50 hover:text-white"
                        }
                      `}
                    >
                      {preset.label}
                    </button>
                  );
                })}

                {/* Custom toggle */}
                <button
                  type="button"
                  onClick={() => setIsCustom((v) => !v)}
                  className={`
                    px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150
                    ${
                      isCustom
                        ? "bg-cricket-gold/20 text-cricket-gold border-cricket-gold/60"
                        : "bg-navy-950/60 text-slate-400 border-navy-700/80 hover:border-cricket-gold/40 hover:text-slate-200"
                    }
                  `}
                >
                  Custom
                </button>
              </div>

              {/* Custom slider (shown only when "Custom" is selected) */}
              {isCustom && (
                <div className="p-4 rounded-xl bg-navy-950/60 border border-cricket-gold/30 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>5 min</span>
                    <span className="font-bold text-cricket-gold text-sm">
                      {formatDuration(durationSeconds)}
                    </span>
                    <span>24 hr</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={1440}
                    step={5}
                    value={customMinutes}
                    onChange={handleSliderChange}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-cricket-orange"
                    aria-label="Custom quiz duration"
                  />
                  <p className="text-[11px] text-slate-500 text-center">
                    Drag to set any duration between 5 minutes and 24 hours
                  </p>
                </div>
              )}

              {/* Live duration badge */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cricket-orange shrink-0" />
                <span>
                  Timer of{" "}
                  <span className="font-semibold text-white">{formatDuration(durationSeconds)}</span>
                  {" "}starts only when you tap{" "}
                  <span className="font-semibold text-cricket-orange">"Start Quiz"</span>
                  {" "}in the lobby
                </span>
              </div>
            </div>

            {/* ── Auto-config summary ── */}
            <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-700/80 flex flex-col gap-2.5 text-xs text-slate-300">
              <span className="font-bold text-cricket-gold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cricket-gold" />
                Automatic Setup
              </span>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cricket-orange shrink-0" />
                <span>25 questions randomly selected from master 100-bank</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-cricket-orange shrink-0" />
                <span>
                  Duration:{" "}
                  <span className="font-semibold text-white">{formatDuration(durationSeconds)}</span>
                  {" "}· Up to{" "}
                  <span className="font-semibold text-white">500 participants</span>
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-1"
            >
              Generate Quiz Room
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
