import React from "react";

export function Footer() {
  return (
    <footer className="w-full border-t border-navy-800/80 py-6 px-4 text-center text-xs text-slate-400 mt-auto">
      <div className="max-w-4xl mx-auto space-y-2">
        <p className="font-semibold text-slate-300">
          Quiz for IPL Auction — Live Trivia Platform
        </p>
        <p className="text-[11px] text-slate-400">
          Not affiliated with, endorsed by, or associated with the BCCI, IPL, or any official cricket franchise.
          Cricket tournament trivia created for fan and educational community events.
        </p>
      </div>
    </footer>
  );
}
