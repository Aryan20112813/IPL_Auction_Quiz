"use client";

import { useState, useEffect, useRef } from "react";
import { computeRemainingSeconds, formatDuration } from "@/lib/time";
import { getClockOffsetMs } from "@/lib/api-client";

export function useServerClock(endsAtIso?: string | null, onExpire?: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    return computeRemainingSeconds(endsAtIso, getClockOffsetMs());
  });

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const expiredFiredRef = useRef(false);

  useEffect(() => {
    if (!endsAtIso) {
      setRemainingSeconds(0);
      return;
    }

    expiredFiredRef.current = false;

    const tick = () => {
      const remaining = computeRemainingSeconds(endsAtIso, getClockOffsetMs());
      setRemainingSeconds(remaining);

      if (remaining <= 0 && !expiredFiredRef.current) {
        expiredFiredRef.current = true;
        if (onExpireRef.current) {
          onExpireRef.current();
        }
      }
    };

    tick();
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [endsAtIso]);

  const isWarning10m = remainingSeconds <= 600 && remainingSeconds > 60;
  const isWarning1m = remainingSeconds <= 60 && remainingSeconds > 0;
  const isExpired = remainingSeconds <= 0;

  return {
    remainingSeconds,
    formatted: formatDuration(remainingSeconds),
    isWarning10m,
    isWarning1m,
    isExpired,
  };
}
