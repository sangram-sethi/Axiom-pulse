"use client";

import React from "react";
import Image from "next/image";
import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
        {/* Left: Axiom logo + brand */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative h-7 w-7 md:h-8 md:w-8">
            <Image
              src="/axiom-logo.ico" // or "/axiom-logo.png"
              alt="Axiom"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-axiom-textPrimary md:text-base">
              AXIOM Pro
            </span>
            <span className="text-[11px] uppercase tracking-wide text-axiom-textMuted">
              Pulse
            </span>
          </div>
        </div>

        {/* Center: Search (hidden on very small screens) */}
        <div className="hidden flex-1 items-center justify-center px-4 md:flex">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs text-axiom-textSecondary shadow-sm shadow-black/30">
            <Search className="h-3.5 w-3.5 shrink-0 text-axiom-textMuted" />
            <input
              className="h-6 flex-1 bg-transparent text-xs text-axiom-textPrimary outline-none placeholder:text-axiom-textMuted"
              placeholder="Search tokens, pairs, wallets…"
            />
            <span className="hidden rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-axiom-textMuted md:inline-flex">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <button className="hidden items-center rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-axiom-textSecondary md:inline-flex hover:bg-slate-800/80">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Live
          </button>

          <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80">
            <Bell className="h-4 w-4" />
          </button>

          <button className="hidden h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80 md:inline-flex">
            <Settings className="h-4 w-4" />
          </button>

          <Button
            variant="soft"
            className="hidden h-8 px-4 text-xs md:inline-flex"
          >
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
}
