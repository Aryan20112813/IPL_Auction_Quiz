"use client";

import { useState, useEffect, useCallback } from "react";

export function useSession(roomCode: string) {
  const [hostToken, setHostTokenState] = useState<string | null>(null);
  const [participantToken, setParticipantTokenState] = useState<string | null>(null);
  const [recoveryCode, setRecoveryCodeState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const upperCode = roomCode?.toUpperCase();

  useEffect(() => {
    if (!upperCode || typeof window === "undefined") return;

    // Check URL hash for host token e.g. #t=xxx
    const hash = window.location.hash;
    if (hash.startsWith("#t=")) {
      const tokenFromHash = hash.substring(3).trim();
      if (tokenFromHash) {
        localStorage.setItem(`ipl-quiz:host:${upperCode}`, tokenFromHash);
        setHostTokenState(tokenFromHash);
        // Clean fragment from URL without page reload
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    } else {
      const storedHost = localStorage.getItem(`ipl-quiz:host:${upperCode}`);
      if (storedHost) setHostTokenState(storedHost);
    }

    const storedParticipant = localStorage.getItem(`ipl-quiz:${upperCode}:participant`);
    if (storedParticipant) {
      try {
        const parsed = JSON.parse(storedParticipant);
        setParticipantTokenState(parsed.token);
        setRecoveryCodeState(parsed.recoveryCode || null);
      } catch {
        setParticipantTokenState(storedParticipant);
      }
    }

    setIsLoaded(true);
  }, [upperCode]);

  const saveHostToken = useCallback(
    (token: string) => {
      if (!upperCode) return;
      localStorage.setItem(`ipl-quiz:host:${upperCode}`, token);
      setHostTokenState(token);
    },
    [upperCode]
  );

  const saveParticipantSession = useCallback(
    (token: string, recCode?: string) => {
      if (!upperCode) return;
      localStorage.setItem(
        `ipl-quiz:${upperCode}:participant`,
        JSON.stringify({ token, recoveryCode: recCode })
      );
      setParticipantTokenState(token);
      if (recCode) setRecoveryCodeState(recCode);
    },
    [upperCode]
  );

  const clearSession = useCallback(() => {
    if (!upperCode) return;
    localStorage.removeItem(`ipl-quiz:host:${upperCode}`);
    localStorage.removeItem(`ipl-quiz:${upperCode}:participant`);
    setHostTokenState(null);
    setParticipantTokenState(null);
    setRecoveryCodeState(null);
  }, [upperCode]);

  return {
    hostToken,
    participantToken,
    recoveryCode,
    isLoaded,
    saveHostToken,
    saveParticipantSession,
    clearSession,
  };
}
