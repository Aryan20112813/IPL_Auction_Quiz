import React from "react";

export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-t-cricket-orange border-r-cricket-gold border-b-transparent border-l-transparent ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
