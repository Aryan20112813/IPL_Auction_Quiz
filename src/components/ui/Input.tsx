"use client";

import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  uppercase?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      uppercase = false,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-200 select-none flex items-center justify-between"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`h-12 w-full px-4 rounded-xl bg-navy-900/90 border ${
            error ? "border-red-500 focus:ring-red-500" : "border-navy-700 focus:border-cricket-orange focus:ring-cricket-orange"
          } text-slate-100 placeholder:text-slate-500 text-base focus:outline-none focus:ring-2 transition-all duration-150 ${
            uppercase ? "uppercase tracking-widest font-mono font-bold" : ""
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-red-400 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
