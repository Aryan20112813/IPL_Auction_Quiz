"use client";

import React from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface SubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions?: number;
  isSubmitting?: boolean;
}

export function SubmitDialog({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalQuestions = 25,
  isSubmitting = false,
}: SubmitDialogProps) {
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Submit Quiz">
      <div className="flex flex-col gap-4">
        {unansweredCount > 0 ? (
          <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-amber-300">
                You have {unansweredCount} unanswered {unansweredCount === 1 ? "question" : "questions"}!
              </p>
              <p className="text-xs text-amber-200/80 mt-1">
                You answered {answeredCount} out of {totalQuestions} questions. Once submitted, you cannot change your answers.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-emerald-300">
                All 25 questions answered!
              </p>
              <p className="text-xs text-emerald-200/80 mt-1">
                Are you ready to finalize your submission?
              </p>
            </div>
          </div>
        )}

        <p className="text-slate-300 text-sm">
          Once you submit, your attempt will be locked. Results will be revealed on the leaderboard when the host ends the quiz.
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-700/60">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Review Answers
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onConfirm}
            isLoading={isSubmitting}
          >
            Confirm & Submit
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
