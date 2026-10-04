"use client";

import React from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { AlertTriangle } from "lucide-react";

export interface EndQuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isEnding?: boolean;
}

export function EndQuizDialog({
  isOpen,
  onClose,
  onConfirm,
  isEnding = false,
}: EndQuizDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="End Quiz Session">
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0 text-red-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-red-300">
              Are you sure you want to end this quiz now?
            </p>
            <p className="text-xs text-red-200/80 mt-1 leading-relaxed">
              Participants who have not submitted will be <strong>auto-submitted immediately</strong> with their saved answers. The final leaderboard will be computed and revealed to all participants.
            </p>
            <p className="text-xs font-semibold text-red-400 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-700/60">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isEnding}
          >
            Keep Quiz Active
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isEnding}
          >
            Confirm & End Quiz
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
