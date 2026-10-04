"use client";

import React, { useState } from "react";
import { Copy, Check, QrCode, Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "../ui/Button";

export interface RoomCodeCardProps {
  roomCode: string;
  hostToken?: string | null;
  onOpenQr?: () => void;
}

export function RoomCodeCard({ roomCode, hostToken, onOpenQr }: RoomCodeCardProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHostLink, setCopiedHostLink] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  const copyHostLink = async () => {
    if (!hostToken || typeof window === "undefined") return;
    const url = `${window.location.origin}/host/${roomCode}#t=${hostToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedHostLink(true);
      setTimeout(() => setCopiedHostLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-6 border border-cricket-orange/40 shadow-2xl relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cricket-orange/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center gap-1">
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-400">
          Room Code to Join
        </span>
        <div
          onClick={copyCode}
          className="cursor-pointer group flex items-center gap-3 bg-navy-950/70 border border-navy-700/80 hover:border-cricket-orange/60 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-inner transition-all my-2"
        >
          <span className="font-mono text-4xl sm:text-6xl font-black text-cricket-gold tracking-widest selection:bg-none">
            {roomCode}
          </span>
          <div className="p-2 rounded-xl bg-navy-800 text-slate-300 group-hover:text-cricket-orange transition">
            {copiedCode ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </div>
        </div>
        <p className="text-xs text-slate-400">
          {copiedCode ? "Copied code to clipboard!" : "Tap code to copy"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copyCode}
          className="flex-1 min-w-[140px]"
        >
          {copiedCode ? (
            <>
              <Check className="w-4 h-4 mr-2 text-emerald-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </>
          )}
        </Button>

        {onOpenQr && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenQr}
            className="flex-1 min-w-[140px]"
          >
            <QrCode className="w-4 h-4 mr-2 text-cricket-orange" />
            Show QR Code
          </Button>
        )}
      </div>

      {/* Host Recovery Notice */}
      {hostToken && (
        <div className="w-full max-w-lg mt-2 pt-4 border-t border-navy-800/80 flex flex-col items-center gap-2 text-left">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-cricket-gold" />
              Host Recovery Link
            </span>
            <button
              onClick={copyHostLink}
              className="text-xs font-semibold text-cricket-gold hover:underline flex items-center gap-1"
            >
              {copiedHostLink ? "Link Copied!" : "Copy Link"}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Bookmark or save this private link to resume control of this quiz from another device or if you clear your browser cookies.
          </p>
        </div>
      )}
    </div>
  );
}
