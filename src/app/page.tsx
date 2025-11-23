import React from "react";
import { TokenTable } from "@/components/tokens/TokenTable";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-axiom-bg text-axiom-textPrimary">

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-5 md:px-6">
        {/* Secondary header (Trending / time filter) */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 p-1 text-xs">
            <button className="rounded-full bg-slate-700 px-3 py-1 text-[11px]">
              Trending
            </button>
            <button className="rounded-full px-3 py-1 text-[11px] text-axiom-textMuted">
              Surge
            </button>
            <button className="rounded-full px-3 py-1 text-[11px] text-axiom-textMuted">
              DEX Screener
            </button>
            <button className="rounded-full px-3 py-1 text-[11px] text-axiom-textMuted">
              Pump Live
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-axiom-textMuted">
            <span>1m</span>
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-axiom-textPrimary">
              5m
            </span>
            <span>30m</span>
            <span>1h</span>
          </div>
        </div>

        <TokenTable />
      </div>
    </main>
  );
}
