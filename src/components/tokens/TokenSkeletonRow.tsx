"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export function TokenSkeletonRow() {
  const cell = "h-3 rounded-full bg-slate-700/40 w-24";

  return (
    <div className="grid grid-cols-[minmax(0,2.5fr)_repeat(4,minmax(0,1.1fr))_minmax(0,2fr)_112px] gap-4 border-b border-slate-800/70 px-4 py-4 text-sm md:px-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-700/40" />
        <div className="flex flex-col gap-2">
          <div className={twMerge(cell, "w-32 animate-pulse")} />
          <div className={twMerge(cell, "w-16 animate-pulse")} />
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className={twMerge(
            "flex items-center",
            idx < 2 ? "" : "hidden lg:flex"
          )}
        >
          <div className={twMerge(cell, "animate-pulse")} />
        </div>
      ))}
      <div className="hidden items-center lg:flex">
        <div className={twMerge(cell, "w-40 animate-pulse")} />
      </div>
      <div className="flex items-center justify-end">
        <div className="h-8 w-16 rounded-full bg-slate-700/50 animate-pulse" />
      </div>
    </div>
  );
}
