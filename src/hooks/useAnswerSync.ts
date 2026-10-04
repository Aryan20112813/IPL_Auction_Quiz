"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CONFIG } from "@/lib/config";
import { apiFetch } from "@/lib/api-client";
import { SaveAnswersResponseDto } from "@/lib/types";

export type SaveStatus = "saved" | "saving" | "offline" | "error";

interface PendingItem {
  position: number;
  option: "A" | "B" | "C" | "D" | null;
  timestamp: number;
}

export function useAnswerSync(
  roomCode: string,
  participantToken: string | null,
  initialAnswers: Record<number, "A" | "B" | "C" | "D"> = {}
) {
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>(initialAnswers);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [pendingQueue, setPendingQueue] = useState<PendingItem[]>([]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backoffRetryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backoffDelayRef = useRef<number>(1000);
  const isSyncingRef = useRef<boolean>(false);
  const upperCode = roomCode?.toUpperCase();

  // Load pending queue from localStorage on mount
  useEffect(() => {
    if (!upperCode || typeof window === "undefined") return;
    const storedQueue = localStorage.getItem(`ipl-quiz:${upperCode}:pending`);
    if (storedQueue) {
      try {
        const parsed: PendingItem[] = JSON.parse(storedQueue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPendingQueue(parsed);
        }
      } catch {
        // Ignore parse error
      }
    }
  }, [upperCode]);

  // Persist pending queue to localStorage
  const updatePendingQueue = useCallback(
    (newQueue: PendingItem[]) => {
      setPendingQueue(newQueue);
      if (typeof window !== "undefined" && upperCode) {
        if (newQueue.length === 0) {
          localStorage.removeItem(`ipl-quiz:${upperCode}:pending`);
        } else {
          localStorage.setItem(`ipl-quiz:${upperCode}:pending`, JSON.stringify(newQueue));
        }
      }
    },
    [upperCode]
  );

  // Sync function that pushes pending queue to server
  const syncQueue = useCallback(async () => {
    if (!participantToken || !upperCode || isSyncingRef.current) return;

    // Check if offline
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setSaveStatus("offline");
      return;
    }

    // Get current items to save
    let itemsToSave: PendingItem[] = [];
    setPendingQueue((currentQueue) => {
      itemsToSave = [...currentQueue];
      return currentQueue;
    });

    if (itemsToSave.length === 0) {
      setSaveStatus("saved");
      return;
    }

    isSyncingRef.current = true;
    setSaveStatus("saving");

    // Deduplicate by position (last write wins)
    const posMap = new Map<number, "A" | "B" | "C" | "D" | null>();
    for (const item of itemsToSave) {
      posMap.set(item.position, item.option);
    }

    const payload = Array.from(posMap.entries()).map(([pos, opt]) => ({
      position: pos,
      option: opt,
    }));

    try {
      await apiFetch<SaveAnswersResponseDto>(`/api/v1/quizzes/${upperCode}/answers`, {
        method: "PUT",
        body: JSON.stringify({ answers: payload }),
        token: participantToken,
      });

      // Successful sync: remove saved items from queue
      setPendingQueue((currentQueue) => {
        const remaining = currentQueue.filter((qItem) => {
          const matchingPayload = payload.find((p) => p.position === qItem.position);
          return !matchingPayload || qItem.timestamp > (itemsToSave.find((i) => i.position === qItem.position)?.timestamp || 0);
        });
        if (typeof window !== "undefined" && upperCode) {
          if (remaining.length === 0) {
            localStorage.removeItem(`ipl-quiz:${upperCode}:pending`);
          } else {
            localStorage.setItem(`ipl-quiz:${upperCode}:pending`, JSON.stringify(remaining));
          }
        }
        return remaining;
      });

      setSaveStatus("saved");
      backoffDelayRef.current = 1000;
    } catch (err: any) {
      console.warn("Failed to sync answers, will retry:", err);
      setSaveStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "error");

      // Schedule exponential backoff retry (1s -> 2s -> 4s -> max 30s)
      if (backoffRetryTimerRef.current) clearTimeout(backoffRetryTimerRef.current);
      backoffRetryTimerRef.current = setTimeout(() => {
        backoffDelayRef.current = Math.min(30000, backoffDelayRef.current * 2);
        syncQueue();
      }, backoffDelayRef.current);
    } finally {
      isSyncingRef.current = false;
    }
  }, [participantToken, upperCode]);

  // Set answer handler
  const setAnswer = useCallback(
    (position: number, option: "A" | "B" | "C" | "D" | null) => {
      // 1. Optimistic UI update
      setAnswers((prev) => {
        const next = { ...prev };
        if (option === null) {
          delete next[position];
        } else {
          next[position] = option;
        }
        return next;
      });

      // 2. Add to pending queue
      const newItem: PendingItem = {
        position,
        option,
        timestamp: Date.now(),
      };

      setPendingQueue((prevQueue) => {
        // Replace previous pending for the same position or append
        const filtered = prevQueue.filter((item) => item.position !== position);
        const updated = [...filtered, newItem];
        if (typeof window !== "undefined" && upperCode) {
          localStorage.setItem(`ipl-quiz:${upperCode}:pending`, JSON.stringify(updated));
        }
        return updated;
      });

      setSaveStatus("saving");

      // 3. Debounce save
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        syncQueue();
      }, CONFIG.AUTOSAVE_DEBOUNCE_MS);
    },
    [upperCode, syncQueue]
  );

  // Sync on online event
  useEffect(() => {
    const handleOnline = () => {
      setSaveStatus("saving");
      syncQueue();
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (backoffRetryTimerRef.current) clearTimeout(backoffRetryTimerRef.current);
    };
  }, [syncQueue]);

  return {
    answers,
    setAnswer,
    saveStatus,
    pendingCount: pendingQueue.length,
    flushPending: syncQueue,
  };
}
