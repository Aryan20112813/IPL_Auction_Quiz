"use client";

import React from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { AlertTriangle } from "lucide-react";

export interface RemoveParticipantDialogProps {
  isOpen: boolean;
  participantName: string | null;
  onClose: () => void;
  onConfirm: () => void;
  isRemoving?: boolean;
}

export function RemoveParticipantDialog({
  isOpen,
  participantName,
  onClose,
  onConfirm,
  isRemoving = false,
}: RemoveParticipantDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Remove Team "${participantName || ""}"?`}>
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0 text-red-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-red-300">
              Remove Team "{participantName}"?
            </p>
            <p className="text-xs text-red-200/80 mt-1 leading-relaxed">
              This participant will be removed immediately and will not be able to continue participating in this quiz.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-700/60">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isRemoving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isRemoving}
          >
            Remove
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
