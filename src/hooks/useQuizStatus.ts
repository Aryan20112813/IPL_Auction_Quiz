"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QuizStatusDto } from "@/lib/types";
import { CONFIG } from "@/lib/config";
import { apiFetch } from "@/lib/api-client";

export function useQuizStatus(roomCode: string, initialStatus?: QuizStatusDto | null) {
  const [status, setStatus] = useState<QuizStatusDto | null>(initialStatus || null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(!initialStatus);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const fetchStatus = useCallback(async () => {
    if (!roomCode) return;
    try {
      const data = await apiFetch<QuizStatusDto>(`/api/v1/quizzes/${roomCode.toUpperCase()}`);
      if (isMountedRef.current) {
        setStatus(data);
        setError(null);
        setLoading(false);
      }
      return data;
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);
      }
      return null;
    }
  }, [roomCode]);

  useEffect(() => {
    isMountedRef.current = true;

    const planNextPoll = (currentStatus: QuizStatusDto | null) => {
      if (!isMountedRef.current) return;

      let baseInterval: number;
      if (!currentStatus || currentStatus.state === "WAITING") {
        // 8s ± 2s jitter
        const jitter = (Math.random() * 2 - 1) * CONFIG.POLL_LOBBY_JITTER_MS;
        baseInterval = Math.max(2000, CONFIG.POLL_LOBBY_MS + jitter);
      } else if (currentStatus.state === "ACTIVE") {
        baseInterval = CONFIG.POLL_ACTIVE_MS;
      } else {
        // Closed state
        if (currentStatus.resultsReady) {
          // Finished polling, results are ready
          return;
        }
        baseInterval = CONFIG.POLL_CLOSED_MS;
      }

      // Page visibility slowdown
      if (typeof document !== "undefined" && document.hidden) {
        baseInterval *= CONFIG.HIDDEN_TAB_MULTIPLIER;
      }

      timeoutRef.current = setTimeout(async () => {
        const nextData = await fetchStatus();
        planNextPoll(nextData || currentStatus);
      }, baseInterval);
    };

    fetchStatus().then((initial) => {
      planNextPoll(initial || status);
    });

    const handleVisibility = () => {
      if (!document.hidden) {
        // Tab became visible again: immediate refresh
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        fetchStatus().then((data) => {
          planNextPoll(data || status);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [roomCode, fetchStatus]);

  return {
    status,
    loading,
    error,
    refresh: fetchStatus,
  };
}
