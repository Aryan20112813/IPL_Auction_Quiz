import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this page.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-12 glass-card rounded-2xl border border-red-500/30">
      <div className="w-14 h-14 rounded-2xl bg-red-950/70 border border-red-500/40 flex items-center justify-center mb-4 text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="md">
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
