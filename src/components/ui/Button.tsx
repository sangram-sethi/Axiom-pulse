"use client";

import * as React from "react";
import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "ghost" | "soft";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 ease-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-axiom-accent focus-visible:ring-offset-2 focus-visible:ring-offset-axiom-bg disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-axiom-accent to-axiom-accentSoft text-white px-5 py-1.5 shadow-md hover:brightness-110",
  ghost:
    "bg-transparent text-axiom-textSecondary hover:bg-slate-800/60 px-3 py-1",
  soft:
    "bg-slate-800/80 text-axiom-textPrimary px-4 py-1.5 hover:bg-slate-700/80",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={twMerge(base, clsx(variantClasses[variant], className))}
    />
  );
};
