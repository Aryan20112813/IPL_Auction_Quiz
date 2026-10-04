"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Clock, HelpCircle, Trophy } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api-client";
import { CreateQuizResponseDto } from "@/lib/types";

export default function HostCreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch<CreateQuizResponseDto>("/api/v1/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim() || undefined,
        }),
      });

      // Save host token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`ipl-quiz:host:${response.code}`, response.hostToken);
      }

      // Navigate to host lobby
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
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-navy-700/60">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cricket-orange to-[#EA580C] text-white flex items-center justify-center shadow-lg shadow-orange-950/50">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Create New Quiz</h1>
              <p className="text-xs text-slate-400">Set up an instant room for your event</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <Input
              label="Quiz Title (Optional)"
              placeholder="e.g., Auction Round 1 — Mega Trivia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              helperText="Give your quiz a friendly name (maximum 60 characters)"
            />

            {/* Quiz Rules Summary */}
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
                <Clock className="w-4 h-4 text-cricket-orange shrink-0" />
                <span>2 hours timer starts only when you tap &quot;Start Quiz&quot; in the lobby</span>
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
              className="w-full mt-2"
            >
              Generate Quiz Room
            </Button>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
