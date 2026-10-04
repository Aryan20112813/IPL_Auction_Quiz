"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { HostDashboardDto } from "@/lib/types";
import { CONFIG } from "@/lib/config";
import { apiFetch } from "@/lib/api-client";

export function useHostDashboard(roomCode: string, hostToken: string | null) {
  const [data, setData] = useState<HostDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<"rank" | "name">("rank");
  const isMountedRef = useRef(true);

  const fetchDashboard = useCallback(async () => {
    if (!roomCode || !hostToken) return;

    try {
      const result = await apiFetch<HostDashboardDto>(
        `/api/v1/quizzes/${roomCode.toUpperCase()}/host/dashboard?limit=${limit}&offset=${offset}&sort=${sort}`,
        { token: hostToken }
      );
      if (isMountedRef.current) {
        setData(result);
        setError(null);
        setLoading(false);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);
      }
    }
  }, [roomCode, hostToken, limit, offset, sort]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchDashboard();

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        fetchDashboard();
      }
    }, CONFIG.POLL_HOST_MS);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    limit,
    offset,
    sort,
    setLimit,
    setOffset,
    setSort,
    refresh: fetchDashboard,
  };
}
