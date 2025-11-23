"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import type { SortDirection, SortKey } from "@/hooks/useTokenSorting";

type Phase = "new" | "final" | "migrated" | "watchlist";

interface TokenTableHeaderProps {
  activePhase: Phase;
  onPhaseChange: (phase: Phase) => void;
  sortKey: SortKey;
  direction: SortDirection;
  onSortChange: (key: SortKey) => void;
}

const phases: { id: Phase; label: string }[] = [
  { id: "new", label: "New pairs" },
  { id: "final", label: "Final stretch" },
  { id: "migrated", label: "Migrated" },
  { id: "watchlist", label: "Watchlist" },
];

export function TokenTableHeader({
  activePhase,
  onPhaseChange,
  sortKey,
  direction,
  onSortChange,
}: TokenTableHeaderProps) {
  const isMCapActive = sortKey === "marketCap";

  return (
    <div className="border-b border-white/10 px-4 pt-3 pb-2 md:px-6">
      {/* Phase tabs + sort summary */}
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* Phase pills */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 p-0.5">
          {phases.map((p) => {
            const active = p.id === activePhase;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPhaseChange(p.id)}
                className={twMerge(
                  "rounded-full px-3 py-1 text-[11px] transition-colors cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axiom-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  active
                    ? "bg-axiom-accent/90 text-slate-950 shadow-sm shadow-axiom-accent/40"
                    : "text-axiom-textSecondary hover:bg-slate-800/80"
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Sort summary (desktop only) */}
        <div className="hidden text-[11px] text-axiom-textMuted md:block">
          Sorted by{" "}
          <span className="font-mono text-axiom-textPrimary">{sortKey}</span>{" "}
          ({direction === "asc" ? "asc" : "desc"})
        </div>
      </div>

      {/* Column headers row */}
      <div
        className={twMerge(
          "grid items-center gap-2 text-[11px] uppercase tracking-wide text-axiom-textMuted",
          "grid-cols-[minmax(0,2.5fr)_repeat(4,minmax(0,1.1fr))_minmax(0,2fr)_112px]"
        )}
      >
        <div className="text-left">Pair</div>

        {/* MCap with sort (focus-visible ring) */}
        <button
          type="button"
          onClick={() => onSortChange("marketCap")}
          className={twMerge(
            "flex items-center gap-1 text-left rounded-full px-2 py-1",
            "cursor-pointer hover:text-axiom-textPrimary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axiom-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          )}
        >
          <span>MCap</span>
          <span className="text-[10px]">
            {!isMCapActive ? "↕" : direction === "asc" ? "↑" : "↓"}
          </span>
        </button>

        <div className="hidden text-left md:block">Liquidity</div>
        <div className="hidden text-left lg:block">Volume</div>
        <div className="hidden text-left lg:block">Txns</div>
        <div className="hidden text-left lg:block">Token info</div>
        <div className="text-right">Action</div>
      </div>
    </div>
  );
}
