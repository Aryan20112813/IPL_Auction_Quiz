"use client";

import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: minimum 44px height for WCAG touch target
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cricket-orange";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-cricket-orange to-[#EA580C] hover:from-[#E06F12] hover:to-[#C2410C] text-white shadow-lg shadow-orange-950/40 border border-orange-400/30",
      secondary:
        "bg-navy-800/90 hover:bg-navy-700 text-slate-100 border border-navy-600 shadow-md",
      outline:
        "bg-transparent hover:bg-navy-800/60 text-slate-200 border-2 border-navy-600 hover:border-cricket-orange",
      danger:
        "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950/40 border border-red-500/30",
      gold:
        "bg-gradient-to-r from-cricket-gold to-[#EAB308] hover:from-[#EAB308] hover:to-[#CA8A04] text-navy-950 font-bold shadow-lg shadow-yellow-950/30 border border-yellow-200/40",
    };

    const sizeStyles = {
      sm: "h-11 px-4 text-sm", // >= 44px touch target
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg font-bold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin text-current" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
