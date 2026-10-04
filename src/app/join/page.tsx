"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogIn, KeyRound, Sparkles, AlertCircle } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api-client";
import { JoinQuizResponseDto, RejoinQuizResponseDto } from "@/lib/types";
import { normalizeRoomCode } from "@/lib/validation/room-code";

function JoinFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"join" | "recover">("join");
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read code query param on load (e.g. from QR scan)
  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setRoomCode(normalizeRoomCode(codeParam));
    }
  }, [searchParams]);

  // Join Handler
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cleanCode = normalizeRoomCode(roomCode);
    if (cleanCode.length !== 6) {
      setError("Room code must be exactly 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiFetch<JoinQuizResponseDto>(
        `/api/v1/quizzes/${cleanCode}/join`,
        {
          method: "POST",
          body: JSON.stringify({ displayName: displayName.trim() }),
        }
      );

      // Save participant credentials in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `ipl-quiz:${cleanCode}:participant`,
          JSON.stringify({
            token: response.participantToken,
            recoveryCode: response.recoveryCode,
          })
        );
      }

      router.push(`/play/${cleanCode}`);
    } catch (err: any) {
      if (err.code === "NAME_TAKEN") {
        setError("This name is already registered in this room. If this is you, tap 'Recover Session' below.");
      } else if (err.code === "QUIZ_CLOSED") {
        setError("This quiz has already ended or expired.");
      } else if (err.code === "QUIZ_NOT_FOUND") {
        setError("Room not found. Please double check the 6-character room code.");
      } else {
        setError(err.message || "Failed to join quiz.");
      }
      setIsLoading(false);
    }
  };

  // Rejoin Handler
  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cleanCode = normalizeRoomCode(roomCode);
    const cleanRecovery = recoveryCode.trim().toUpperCase();

    if (cleanCode.length !== 6) {
      setError("Room code must be exactly 6 characters.");
      setIsLoading(false);
      return;
    }

    if (cleanRecovery.length !== 6) {
      setError("Recovery code must be exactly 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiFetch<RejoinQuizResponseDto>(
        `/api/v1/quizzes/${cleanCode}/rejoin`,
        {
          method: "POST",
          body: JSON.stringify({
            displayName: displayName.trim(),
            recoveryCode: cleanRecovery,
          }),
        }
      );

      if (typeof window !== "undefined") {
        localStorage.setItem(
          `ipl-quiz:${cleanCode}:participant`,
          JSON.stringify({
            token: response.participantToken,
            recoveryCode: cleanRecovery,
          })
        );
      }

      router.push(`/play/${cleanCode}`);
    } catch (err: any) {
      setError(err.message || "Failed to recover session. Please verify your display name and recovery code.");
      setIsLoading(false);
    }
  };

  return (
    <Card variant="glass" className="border-cricket-orange/30 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-navy-700/60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cricket-orange to-[#EA580C] text-white flex items-center justify-center shadow-lg shadow-orange-950/50">
            {mode === "join" ? <LogIn className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {mode === "join" ? "Join IPL Quiz" : "Recover Session"}
            </h1>
            <p className="text-xs text-slate-400">
              {mode === "join"
                ? "Enter room code and team or player name"
                : "Resume an active quiz attempt with your recovery code"}
            </p>
          </div>
        </div>
      </div>

      {mode === "join" ? (
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <Input
            label="Room Code"
            placeholder="e.g. K7M2QX"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            uppercase
            maxLength={6}
            required
            autoComplete="off"
            helperText="6-character code shown on host screen or QR code"
          />

          <Input
            label="Your Display / Team Name"
            placeholder="e.g. Mumbai Strikers or Aryan"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            minLength={2}
            maxLength={30}
            required
            autoComplete="off"
            helperText="2 to 30 characters"
          />

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 glow-orange"
          >
            Enter Quiz Room
          </Button>

          <div className="pt-4 border-t border-navy-800 text-center">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode("recover");
              }}
              className="text-xs font-semibold text-cricket-gold hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Lost connection or cleared cache? Recover Session
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRecover} className="flex flex-col gap-4">
          <Input
            label="Room Code"
            placeholder="e.g. K7M2QX"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            uppercase
            maxLength={6}
            required
            autoComplete="off"
          />

          <Input
            label="Registered Display Name"
            placeholder="e.g. Mumbai Strikers"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            autoComplete="off"
          />

          <Input
            label="6-Character Recovery Code"
            placeholder="e.g. R4T9X2"
            value={recoveryCode}
            onChange={(e) => setRecoveryCode(e.target.value)}
            uppercase
            maxLength={6}
            required
            autoComplete="off"
            helperText="The private recovery code issued when you first joined"
          />

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Restore My Session
          </Button>

          <div className="pt-4 border-t border-navy-800 text-center">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode("join");
              }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 hover:underline mx-auto"
            >
              ← Back to New Join
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

export default function JoinPage() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <TopBar />

      <main className="max-w-lg mx-auto w-full px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Suspense fallback={<div className="text-center py-8 text-slate-400">Loading join screen...</div>}>
          <JoinFormContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
