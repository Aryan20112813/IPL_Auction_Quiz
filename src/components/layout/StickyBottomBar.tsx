import React from "react";

export function StickyBottomBar({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-navy-700/80 px-4 py-3 sm:px-6 safe-area-bottom shadow-2xl ${className}`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {children}
      </div>
    </div>
  );
}
