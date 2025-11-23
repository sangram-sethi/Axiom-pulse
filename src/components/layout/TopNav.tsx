"use client";

import React from "react";
import { Search, Bell, Settings } from "lucide-react";

export function TopNav() {
  return (
    <header className="flex items-center justify-between border-b border-slate-900/80 px-4 py-3 md:px-6">
      <div className="flex items-center gap-4">
        {/* Logo + brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-axiom-accent">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="text-sm font-semibold text-axiom-textPrimary">
            AXIOM Pro
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-4 text-xs text-axiom-textMuted md:flex">
          <button className="text-axiom-textPrimary">Discover</button>
          <button className="font-medium text-axiom-accent">Pulse</button>
          <button>Trackers</button>
          <button>Perpetuals</button>
          <button>Yield</button>
          <button>Vision</button>
        </nav>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden items-center rounded-full bg-slate-900/90 px-3 py-1.5 text-xs text-axiom-textMuted md:flex">
          <Search className="mr-2 h-3 w-3" />
          <input
            className="w-52 bg-transparent text-xs outline-none placeholder:text-axiom-textMuted"
            placeholder="Search by token or CA..."
          />
        </div>

        {/* Icons */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textMuted">
          <Bell className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textMuted">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
