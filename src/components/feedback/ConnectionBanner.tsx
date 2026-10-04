"use client";

import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function ConnectionBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="sticky top-0 z-50 w-full bg-amber-600 text-white px-4 py-2 text-sm font-semibold shadow-md flex items-center justify-between animate-pulse"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>
          Connection lost – your answers are saved safely on this device. Reconnecting automatically...
        </span>
      </div>
    </div>
  );
}
