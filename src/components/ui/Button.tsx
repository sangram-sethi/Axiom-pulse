"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariant = "primary" | "soft" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, ...props },
    ref
  ) {
    const base =
      "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap " +
      "cursor-pointer select-none outline-none transition-colors duration-150 ease-smooth " +
      "focus-visible:ring-2 focus-visible:ring-axiom-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

    const variants: Record<ButtonVariant, string> = {
      primary: "bg-axiom-accent text-white hover:bg-axiom-accent/90",
      soft:
        "bg-slate-900/80 text-axiom-textPrimary hover:bg-slate-800/80 border border-slate-700/80",
      outline:
        "border border-slate-700 text-axiom-textPrimary hover:bg-slate-900/60",
      ghost: "text-axiom-textSecondary hover:bg-slate-900/70",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "h-7 px-3 text-[11px]",
      md: "h-8 px-4 text-xs",
      lg: "h-10 px-5 text-sm",
    };

    return (
      <button
        ref={ref}
        className={twMerge(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

