"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Trophy,
  Grid,
  KeyRound,
  AlertCircle,
  HelpCircle,
  UserX,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { StickyBottomBar } from "@/components/layout/StickyBottomBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionNavigator } from "@/components/quiz/QuestionNavigator";
import { TimerDisplay } from "@/components/quiz/TimerDisplay";
import { SaveIndicator } from "@/components/quiz/SaveIndicator";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { SubmitDialog } from "@/components/quiz/SubmitDialog";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardCardList } from "@/components/leaderboard/LeaderboardCardList";
import { YouRow } from "@/components/leaderboard/YouRow";
import { Pagination } from "@/components/leaderboard/Pagination";
import { ClosedQuizNotice } from "@/components/feedback/ClosedQuizNotice";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useSession } from "@/hooks/useSession";
import { useQuizStatus } from "@/hooks/useQuizStatus";
import { useAnswerSync } from "@/hooks/useAnswerSync";
import { apiFetch } from "@/lib/api-client";
import {
  ParticipantMeDto,
  QuestionsResponseDto,
  SubmitResponseDto,
  LeaderboardResponseDto,
  QuestionDto,
} from "@/lib/types";

export default function PlayQuizPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params?.code as string) || "").toUpperCase();

  const { participantToken, recoveryCode, isLoaded: sessionLoaded } = useSession(roomCode);
  const { status: quizStatus, refresh: refreshQuizStatus } = useQuizStatus(roomCode);

  const [meData, setMeData] = useState<ParticipantMeDto | null>(null);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [endsAt, setEndsAt] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isNavigatorModalOpen, setIsNavigatorModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Leaderboard data when quiz closes
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponseDto | null>(null);
  const [lbLimit] = useState(50);
  const [lbOffset, setLbOffset] = useState(0);

  const confettiTriggeredRef = useRef(false);

  // 1. Fetch Participant Profile / State
  const fetchMe = useCallback(async () => {
    if (!participantToken || !roomCode) return null;
    try {
      const data = await apiFetch<ParticipantMeDto>(
        `/api/v1/quizzes/${roomCode}/me`,
        { token: participantToken }
      );
      setMeData(data);
      if (data.endsAt) setEndsAt(data.endsAt);
      return data;
    } catch (err: any) {
      if (err.message?.includes("removed") || err.code === "FORBIDDEN") {
        setMeData((prev) => prev ? { ...prev, status: "REMOVED" } : null);
      }
      return null;
    }
  }, [participantToken, roomCode]);

  // 2. Fetch Questions (only when ACTIVE and IN_PROGRESS)
  const fetchQuestions = useCallback(async () => {
    if (!participantToken || !roomCode) return;
    try {
      const data = await apiFetch<QuestionsResponseDto>(
        `/api/v1/quizzes/${roomCode}/questions`,
        { token: participantToken }
      );
      setQuestions(data.questions);
      setEndsAt(data.endsAt);
      return data;
    } catch (err: any) {
      if (err.message?.includes("removed") || err.code === "FORBIDDEN") {
        setMeData((prev) => prev ? { ...prev, status: "REMOVED" } : null);
      }
      return null;
    }
  }, [participantToken, roomCode]);

  // 3. Fetch Leaderboard (when closed and results ready)
  const fetchLeaderboard = useCallback(async () => {
    if (!participantToken || !roomCode) return;
    try {
      const data = await apiFetch<LeaderboardResponseDto>(
        `/api/v1/quizzes/${roomCode}/leaderboard?limit=${lbLimit}&offset=${lbOffset}`,
        { token: participantToken }
      );
      setLeaderboardData(data);

      // Trigger confetti if participant is on podium
      if (!confettiTriggeredRef.current && data.rows.some((r) => r.isYou && r.rank && r.rank <= 3)) {
        confettiTriggeredRef.current = true;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.warn("fetchLeaderboard error:", err);
    }
  }, [participantToken, roomCode, lbLimit, lbOffset]);

  // Initialize
  useEffect(() => {
    if (!sessionLoaded) return;

    if (!participantToken) {
      setLoading(false);
      return;
    }

    const init = async () => {
      setLoading(true);
      const me = await fetchMe();
      if (me && me.state === "ACTIVE" && me.status === "IN_PROGRESS") {
        await fetchQuestions();
      }
      setLoading(false);
    };

    init();
  }, [sessionLoaded, participantToken, fetchMe, fetchQuestions]);

  // Periodic polling when waiting for results or in lobby
  useEffect(() => {
    if (!participantToken || !roomCode) return;

    const interval = setInterval(async () => {
      const me = await fetchMe();
      if (me) {
        if (me.state === "ACTIVE" && me.status === "IN_PROGRESS" && questions.length === 0) {
          await fetchQuestions();
        }
        if (me.resultsReady) {
          await fetchLeaderboard();
        }
      }
    }, meData?.status === "SUBMITTED" ? 15000 : 4000);

    return () => clearInterval(interval);
  }, [participantToken, roomCode, meData?.status, questions.length, fetchMe, fetchQuestions, fetchLeaderboard]);

  // Hook for Answer Auto-saving
  const { answers, setAnswer, saveStatus, flushPending } = useAnswerSync(
    roomCode,
    participantToken,
    {}
  );

  // Submit Handler
  const handleSubmit = async () => {
    if (!participantToken) return;
    setIsSubmitting(true);
    try {
      // Flush any pending unsaved answers before final submit
      await flushPending();

      await apiFetch<SubmitResponseDto>(`/api/v1/quizzes/${roomCode}/submit`, {
        method: "POST",
        token: participantToken,
      });

      setIsSubmitDialogOpen(false);
      await fetchMe();
      await refreshQuizStatus();
    } catch (err: any) {
      setError(err.message || "Failed to submit answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Not Joined State
  if (sessionLoaded && !participantToken) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopBar roomCode={roomCode} />
        <main className="max-w-md mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <Card variant="glass" className="p-8">
            <HelpCircle className="w-12 h-12 text-cricket-orange mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">You Have Not Joined Yet</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Please enter your name to register for Room{" "}
              <span className="font-mono font-bold text-cricket-gold">{roomCode}</span>.
            </p>
            <Link href={`/join?code=${roomCode}`}>
              <Button variant="primary" size="lg" className="w-full glow-orange">
                Join Room {roomCode}
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading || !meData) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopBar roomCode={roomCode} />
        <div className="flex flex-col items-center justify-center p-16">
          <Spinner size="lg" />
          <p className="text-slate-400 text-sm mt-4 font-medium">Entering quiz room...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // REMOVED STATE (Kicked by Host)
  if (meData.status === "REMOVED") {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopBar roomCode={roomCode} />
        <main className="max-w-md mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <Card variant="glass" className="p-8 border-red-500/40 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shadow-xl">
              <UserX className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Removed from Quiz</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              You have been removed from this quiz by the host and can no longer participate in this session.
            </p>
            <Link href="/" className="w-full mt-2">
              <Button variant="secondary" size="md" className="w-full">
                Return to Home
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }


  const isWaiting = meData.state === "WAITING";
  const isActive = meData.state === "ACTIVE";
  const isClosed = meData.state === "ENDED" || meData.state === "EXPIRED";
  const isInProgress = meData.status === "IN_PROGRESS";
  const isSubmitted = meData.status === "SUBMITTED" || meData.status === "AUTO_SUBMITTED";

  const currentQuestion = questions.find((q) => q.position === currentPosition) || questions[0];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Top Bar */}
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
              ? "Lobby (Waiting for Host)"
              : isActive
              ? "Quiz Active"
              : isClosed
              ? "Quiz Closed"
              : meData.state}
          </Badge>
        }
        rightAction={
          isActive && isInProgress ? (
            <div className="flex items-center gap-3">
              <SaveIndicator status={saveStatus} />
              <TimerDisplay endsAtIso={endsAt} onExpire={fetchMe} />
            </div>
          ) : undefined
        }
      />

      <main className="max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. LOBBY SCREEN (WAITING) */}
        {isWaiting && (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto py-8 gap-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-xl">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Welcome, {meData.displayName}!
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                You are registered in Room{" "}
                <span className="font-mono font-bold text-cricket-gold">{roomCode}</span>.
                The quiz will start as soon as the host hits Start.
              </p>
            </div>

            {/* Recovery Code Display Card */}
            {recoveryCode && (
              <div className="w-full p-5 rounded-2xl glass-card border border-navy-700/80 flex flex-col items-center gap-2 text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-cricket-gold" />
                  Your Session Recovery Code
                </span>
                <span className="font-mono text-3xl font-black text-cricket-gold tracking-widest my-1">
                  {recoveryCode}
                </span>
                <p className="text-[11px] text-slate-400 max-w-xs leading-normal">
                  Write this code down! If your phone refreshes or disconnects, you can use it to rejoin immediately.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-navy-900/90 px-4 py-2 rounded-full border border-navy-700">
              <Spinner size="sm" />
              <span>Checking for host start signal...</span>
            </div>
          </div>
        )}

        {/* 2. ACTIVE QUIZ SCREEN (IN PROGRESS) */}
        {isActive && isInProgress && currentQuestion && (
          <div className="flex flex-col gap-6 pb-20 sm:pb-24">
            {/* Mobile Progress & Navigator Trigger */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <ProgressBar current={answeredCount} total={25} />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsNavigatorModalOpen(true)}
                className="lg:hidden shrink-0 h-10 px-3"
              >
                <Grid className="w-4 h-4 mr-1 text-cricket-gold" />
                <span>1–25</span>
              </Button>
            </div>

            {/* Layout: Question Card + Desktop Navigator Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <QuestionCard
                  question={currentQuestion}
                  totalQuestions={25}
                  selectedOption={answers[currentQuestion.position] || null}
                  onSelectOption={(opt) => setAnswer(currentQuestion.position, opt)}
                />
              </div>

              {/* Desktop Side Panel Navigator */}
              <div className="hidden lg:block lg:col-span-1">
                <QuestionNavigator
                  totalQuestions={25}
                  currentPosition={currentPosition}
                  answers={answers}
                  onSelectPosition={(pos) => setCurrentPosition(pos)}
                />
              </div>
            </div>

            {/* Sticky Bottom Navigation Bar */}
            <StickyBottomBar>
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={currentPosition <= 1}
                onClick={() => setCurrentPosition((prev) => Math.max(1, prev - 1))}
                className="min-w-[100px]"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>

              <span className="font-mono text-sm font-bold text-slate-300">
                {currentPosition} / 25
              </span>

              {currentPosition < 25 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentPosition((prev) => Math.min(25, prev + 1))}
                  className="min-w-[100px]"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="gold"
                  size="md"
                  onClick={() => setIsSubmitDialogOpen(true)}
                  className="min-w-[120px]"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit
                </Button>
              )}
            </StickyBottomBar>

            {/* Mobile Navigator Dialog */}
            <Dialog
              isOpen={isNavigatorModalOpen}
              onClose={() => setIsNavigatorModalOpen(false)}
              title="Jump to Question"
            >
              <QuestionNavigator
                totalQuestions={25}
                currentPosition={currentPosition}
                answers={answers}
                onSelectPosition={(pos) => {
                  setCurrentPosition(pos);
                  setIsNavigatorModalOpen(false);
                }}
              />
            </Dialog>

            {/* Submit Confirmation Dialog */}
            <SubmitDialog
              isOpen={isSubmitDialogOpen}
              onClose={() => setIsSubmitDialogOpen(false)}
              onConfirm={handleSubmit}
              answeredCount={answeredCount}
              totalQuestions={25}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* 3. SUBMITTED SCREEN (WAITING FOR QUIZ TO END) */}
        {isActive && isSubmitted && (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto py-12 gap-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Answers Submitted!
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Great job, <span className="font-bold text-white">{meData.displayName}</span>! Your answers have been recorded.
              </p>
            </div>

            <div className="w-full p-5 rounded-2xl glass-card border border-navy-700/80 flex flex-col gap-3 text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Submission Receipt</span>
              <span className="text-2xl font-black text-cricket-gold">
                {meData.answeredCount} of 25 Questions Answered
              </span>
              <p className="text-xs text-slate-300">
                Official scores and rankings will be revealed on this screen as soon as the host closes the quiz or the 2-hour window finishes.
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-navy-900/90 px-4 py-2 rounded-full border border-navy-700">
              <Spinner size="sm" />
              <span>Waiting for final quiz results...</span>
            </div>
          </div>
        )}

        {/* 4. CLOSED STATE (FINAL LEADERBOARD OR CALCULATING) */}
        {isClosed && (
          <div className="flex flex-col gap-6">
            {!meData.resultsReady ? (
              <ClosedQuizNotice
                reason={quizStatus?.state === "EXPIRED" ? "EXPIRED" : "HOST"}
                resultsReady={false}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {/* Highlight Pinned "You" Row */}
                {meData.result && (
                  <YouRow
                    rank={meData.result.rank}
                    score={meData.result.score}
                    maxScore={meData.result.maxScore}
                    timeTakenMs={meData.result.timeTakenMs}
                    name={meData.displayName}
                  />
                )}

                {/* Final Official Leaderboard Card */}
                <div className="w-full glass-card rounded-2xl border border-navy-700/80 overflow-hidden shadow-2xl p-4 sm:p-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-navy-700/60">
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                      <Trophy className="w-6 h-6 text-cricket-gold" />
                      Official Final Leaderboard
                    </h2>
                    <Badge variant="gold">Final Ranking</Badge>
                  </div>

                  {leaderboardData && (
                    <div className="flex flex-col gap-4">
                      {/* Desktop Table */}
                      <div className="hidden sm:block">
                        <LeaderboardTable rows={leaderboardData.rows} />
                      </div>

                      {/* Mobile Cards */}
                      <div className="sm:hidden">
                        <LeaderboardCardList rows={leaderboardData.rows} />
                      </div>

                      <Pagination
                        limit={lbLimit}
                        offset={lbOffset}
                        total={leaderboardData.page.total}
                        onPageChange={(newOffset) => {
                          setLbOffset(newOffset);
                          fetchLeaderboard();
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
