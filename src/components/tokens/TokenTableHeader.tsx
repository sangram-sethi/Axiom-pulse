"use client";

import React from "react";
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
    <div className="border-b border-slate-800/80 px-4 pt-3 pb-2 md:px-6">
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* Phase pills */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 p-1">
          {phases.map((p) => {
            const active = p.id === activePhase;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPhaseChange(p.id)}
                className={
                  active
                    ? "rounded-full bg-axiom-accent/90 px-3 py-1 text-[11px] font-medium text-slate-950 shadow-sm shadow-axiom-accent/40"
                    : "rounded-full px-3 py-1 text-[11px] text-axiom-textSecondary hover:bg-slate-800/80"
                }
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Column headers row */}
      <div
        className="grid items-center text-[11px] uppercase tracking-wide text-axiom-textMuted"
        style={{
          gridTemplateColumns:
            "minmax(0,2.5fr) repeat(4,minmax(0,1.1fr)) minmax(0,2fr) 112px",
        }}
      >
        <div className="text-left">Pair</div>

        {/* MCap with sort */}
        <button
          type="button"
          onClick={() => onSortChange("marketCap")}
          className="flex items-center gap-1 text-left"
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
