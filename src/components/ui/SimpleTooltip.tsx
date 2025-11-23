"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface SimpleTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

/**
 * Lightweight tooltip that shows content on hover/focus.
 * No provider or external context needed.
 */
export function SimpleTooltip({
  children,
  content,
  className,
}: SimpleTooltipProps) {
  return (
    <span
      className={twMerge("relative inline-flex group", className)}
    >
      {children}
      <span
        role="tooltip"
        className={twMerge(
          "pointer-events-none absolute left-1/2 top-0 z-20 hidden -translate-x-1/2 -translate-y-full",
          "rounded-md bg-slate-900 px-2 py-1 text-xs text-axiom-textSecondary shadow-lg shadow-black/60",
          "group-hover:block group-focus-within:block"
        )}
      >
        {content}
      </span>
    </span>
  );
}
