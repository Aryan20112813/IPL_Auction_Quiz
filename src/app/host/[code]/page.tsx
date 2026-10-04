"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { RoomCodeCard } from "@/components/host/RoomCodeCard";
import { QrJoinCard } from "@/components/host/QrJoinCard";
import { ParticipantList } from "@/components/host/ParticipantList";
import { DashboardCounts } from "@/components/host/DashboardCounts";
import { RankingTable } from "@/components/host/RankingTable";
import { EndQuizDialog } from "@/components/host/EndQuizDialog";
import { RemoveParticipantDialog } from "@/components/host/RemoveParticipantDialog";
import { TimerDisplay } from "@/components/quiz/TimerDisplay";
import { Pagination } from "@/components/leaderboard/Pagination";
import { useSession } from "@/hooks/useSession";
import { useQuizStatus } from "@/hooks/useQuizStatus";
import { useHostDashboard } from "@/hooks/useHostDashboard";
import { apiFetch } from "@/lib/api-client";
import { Play, StopCircle, RefreshCw, Trophy } from "lucide-react";

export default function HostQuizPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params?.code as string) || "").toUpperCase();

  const { hostToken, isLoaded: sessionLoaded } = useSession(roomCode);
  const { status, loading: statusLoading, refresh: refreshStatus } = useQuizStatus(roomCode);
  const {
    data: dashboardData,
    loading: dashboardLoading,
    limit,
    offset,
    sort,
    setOffset,
    setSort,
    refresh: refreshDashboard,
  } = useHostDashboard(roomCode, hostToken);

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState<{ id: string; name: string } | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!sessionLoaded || statusLoading) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopBar roomCode={roomCode} />
        <div className="flex flex-col items-center justify-center p-12">
          <Spinner size="lg" />
          <p className="text-slate-400 text-sm mt-4">Loading quiz room...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopBar />
        <ErrorState
          title="Quiz Not Found"
          message={`Room ${roomCode} does not exist or has expired.`}
          onRetry={() => router.push("/")}
        />
        <Footer />
      </div>
    );
  }

  // Host Start Quiz
  const handleStartQuiz = async () => {
    if (!hostToken) return;
    setIsStarting(true);
    setActionError(null);
    try {
      await apiFetch(`/api/v1/quizzes/${roomCode}/start`, {
        method: "POST",
        token: hostToken,
      });
      await refreshStatus();
      await refreshDashboard();
    } catch (err: any) {
      setActionError(err.message || "Failed to start quiz.");
    } finally {
      setIsStarting(false);
    }
  };

  // Host End Quiz
  const handleEndQuiz = async () => {
    if (!hostToken) return;
    setIsEnding(true);
    setActionError(null);
    try {
      await apiFetch(`/api/v1/quizzes/${roomCode}/end`, {
        method: "POST",
        token: hostToken,
      });
      setIsEndDialogOpen(false);
      await refreshStatus();
      await refreshDashboard();
    } catch (err: any) {
      setActionError(err.message || "Failed to end quiz.");
    } finally {
      setIsEnding(false);
    }
  };

  // Host Remove Participant
  const handleRemoveParticipant = async () => {
    if (!hostToken || !participantToRemove) return;
    setIsRemoving(true);
    setActionError(null);
    try {
      await apiFetch(`/api/v1/quizzes/${roomCode}/host/participants/${participantToRemove.id}`, {
        method: "DELETE",
        token: hostToken,
      });
      setParticipantToRemove(null);
      await refreshStatus();
      await refreshDashboard();
    } catch (err: any) {
      setActionError(err.message || "Failed to remove participant.");
    } finally {
      setIsRemoving(false);
    }
  };

  const isWaiting = status.state === "WAITING";
  const isActive = status.state === "ACTIVE";
  const isClosed = status.state === "ENDED" || status.state === "EXPIRED";

  return (
    <div className="flex-1 flex flex-col justify-between">
      <TopBar
        roomCode={roomCode}
        stateBadge={
          <Badge
            variant={
              isWaiting
                ? "waiting"
                : isActive
                ? "active"
                : isClosed
                ? "gold"
                : "neutral"
            }
          >
            {isWaiting
              ? "Lobby (Waiting)"
              : isActive
              ? "Quiz Active"
              : isClosed
              ? "Quiz Closed"
              : status.state}
          </Badge>
        }
        rightAction={
          isActive ? (
            <TimerDisplay endsAtIso={status.endsAt} onExpire={refreshStatus} />
          ) : undefined
        }
      />

      <main className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-10 flex flex-col gap-6">
        {/* Title & Host Notice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {status.title || `IPL Quiz Room — ${roomCode}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Host Control Panel · 25 Questions · 2 Hours Duration
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                refreshStatus();
                refreshDashboard();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>

            {isActive && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => setIsEndDialogOpen(true)}
              >
                <StopCircle className="w-4 h-4 mr-1.5" />
                End Quiz
              </Button>
            )}
          </div>
        </div>

        {actionError && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-sm">
            {actionError}
          </div>
        )}

        {/* SCREEN 3: LOBBY STATE (WAITING) */}
        {isWaiting && (
          <div className="flex flex-col gap-6">
            <RoomCodeCard
              roomCode={roomCode}
              hostToken={hostToken}
              onOpenQr={() => setIsQrOpen(true)}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-navy-700">
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">Ready to begin?</span>
                <span className="text-xs text-slate-400">
                  Once started, the 2-hour countdown begins and participants will see question 1.
                </span>
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleStartQuiz}
                isLoading={isStarting}
                className="w-full sm:w-auto px-8 glow-orange"
              >
                <Play className="w-5 h-5 mr-2 fill-white" />
                Start Quiz Now
              </Button>
            </div>

            <ParticipantList
              participants={(dashboardData?.rows || []).map((r) => ({
                id: r.participantId,
                displayName: r.name,
              }))}
              count={status.participantCount}
              onRemove={(p) => setParticipantToRemove({ id: p.id, name: p.displayName })}
            />
          </div>
        )}

        {/* SCREEN 7 & 8: ACTIVE LIVE DASHBOARD OR FINAL LEADERBOARD */}
        {(isActive || isClosed) && (
          <div className="flex flex-col gap-6">
            {/* Counts Overview */}
            {dashboardData && (
              <DashboardCounts counts={dashboardData.counts} />
            )}

            {/* Ranking Table */}
            {dashboardData && (
              <div className="flex flex-col gap-3">
                <RankingTable
                  rows={dashboardData.rows}
                  isFinal={dashboardData.isFinal}
                  onRemove={!dashboardData.isFinal ? (p) => setParticipantToRemove(p) : undefined}
                />
                <Pagination
                  limit={limit}
                  offset={offset}
                  total={dashboardData.page.total}
                  onPageChange={setOffset}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* QR Code Dialog */}
      <QrJoinCard
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        roomCode={roomCode}
      />

      {/* End Quiz Confirmation Dialog */}
      <EndQuizDialog
        isOpen={isEndDialogOpen}
        onClose={() => setIsEndDialogOpen(false)}
        onConfirm={handleEndQuiz}
        isEnding={isEnding}
      />

      {/* Remove Participant Confirmation Dialog */}
      <RemoveParticipantDialog
        isOpen={!!participantToRemove}
        participantName={participantToRemove?.name || null}
        onClose={() => setParticipantToRemove(null)}
        onConfirm={handleRemoveParticipant}
        isRemoving={isRemoving}
      />

      <Footer />
    </div>
  );
}

