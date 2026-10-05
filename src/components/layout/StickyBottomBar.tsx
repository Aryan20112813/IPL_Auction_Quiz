import React from "react";

export function StickyBottomBar({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-navy-700/80 px-3 py-2.5 sm:px-6 sm:py-3 shadow-2xl pb-[calc(0.625rem+env(safe-area-inset-bottom))] ${className}`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {children}
      </div>
    </div>
  );
}
