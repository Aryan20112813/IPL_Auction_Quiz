"use client";

import React from "react";
import { Check, CloudOff, AlertCircle, Loader2 } from "lucide-react";
import { SaveStatus } from "@/hooks/useAnswerSync";

export function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "saving") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-cricket-orange">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
        <CloudOff className="w-3.5 h-3.5" />
        <span>Saved locally</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Sync pending</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
      <Check className="w-3.5 h-3.5" />
      <span>Saved</span>
    </div>
  );
}
