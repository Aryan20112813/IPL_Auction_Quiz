"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Copy, Check } from "lucide-react";

export interface QrJoinCardProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
}

export function QrJoinCard({ isOpen, onClose, roomCode }: QrJoinCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/join?code=${roomCode}`
      : `/join?code=${roomCode}`;

  useEffect(() => {
    if (!isOpen || !roomCode) return;

    QRCode.toDataURL(joinUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: "#060F1D",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [isOpen, roomCode, joinUrl]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Scan QR Code to Join">
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-slate-300 text-sm">
          Participants can point their phone camera at the screen to join Room{" "}
          <span className="font-mono font-bold text-cricket-gold">{roomCode}</span> directly.
        </p>

        {qrDataUrl ? (
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-cricket-orange">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`QR Code for room ${roomCode}`}
              className="w-64 h-64 rounded-xl"
            />
          </div>
        ) : (
          <div className="w-64 h-64 rounded-2xl bg-navy-900 animate-pulse flex items-center justify-center text-slate-500">
            Generating QR Code...
          </div>
        )}

        <div className="w-full flex items-center gap-2 bg-navy-950/80 p-2.5 rounded-xl border border-navy-700">
          <input
            readOnly
            value={joinUrl}
            className="bg-transparent text-xs font-mono text-slate-300 flex-1 truncate px-2 outline-none"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyUrl}
            className="h-9 px-3"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
