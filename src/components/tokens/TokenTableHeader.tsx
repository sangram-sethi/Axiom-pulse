"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import type { SortKey } from "@/hooks/useTokenSorting";

interface TokenTableHeaderProps {
  activePhase: "new" | "final" | "migrated";
  onPhaseChange: (phase: "new" | "final" | "migrated") => void;
  sortKey: SortKey;
  direction: "asc" | "desc";
  onSortChange: (key: SortKey) => void;
}

interface SortButtonProps {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: "asc" | "desc";
  onClick: () => void;
}

function SortButton({
  label,
  sortKey,
  activeKey,
  direction,
  onClick,
}: SortButtonProps) {
  const isActive = sortKey === activeKey;

  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-axiom-textMuted cursor-pointer",
        "transition-colors duration-150 ease-smooth",
        isActive && "text-axiom-textPrimary"
      )}
    >
      <span>{label}</span>
      <span className="text-[9px]">
        {isActive ? (direction === "asc" ? "↑" : "↓") : ""}
      </span>
    </button>
  );
}

export function TokenTableHeader({
  activePhase,
  onPhaseChange,
  sortKey,
  direction,
  onSortChange,
}: TokenTableHeaderProps) {
  return (
    <div className="border-b border-slate-800/70 px-4 pt-2.5 pb-2 md:px-6 md:pt-3 md:pb-2.5">
      {/* Top row: colored phase pills */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-slate-950/80 p-1">
          {/* New Pairs */}
          <button
            type="button"
            onClick={() => onPhaseChange("new")}
            className={twMerge(
              "inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium cursor-pointer",
              "transition-colors duration-150 ease-smooth",
              activePhase === "new"
                ? "bg-emerald-500/25 text-emerald-200 border border-emerald-500/50 shadow-[0_0_0_1px_rgba(16,185,129,0.4)]"
                : "bg-transparent text-axiom-textMuted hover:bg-emerald-500/10 hover:text-emerald-200"
            )}
          >
            New Pairs
          </button>

          {/* Final Stretch */}
          <button
            type="button"
            onClick={() => onPhaseChange("final")}
            className={twMerge(
              "inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium cursor-pointer",
              "transition-colors duration-150 ease-smooth",
              activePhase === "final"
                ? "bg-amber-500/25 text-amber-200 border border-amber-500/50 shadow-[0_0_0_1px_rgba(245,158,11,0.4)]"
                : "bg-transparent text-axiom-textMuted hover:bg-amber-500/10 hover:text-amber-200"
            )}
          >
            Final Stretch
          </button>

          {/* Migrated */}
          <button
            type="button"
            onClick={() => onPhaseChange("migrated")}
            className={twMerge(
              "inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium cursor-pointer",
              "transition-colors duration-150 ease-smooth",
              activePhase === "migrated"
                ? "bg-indigo-500/25 text-indigo-200 border border-indigo-500/50 shadow-[0_0_0_1px_rgba(99,102,241,0.4)]"
                : "bg-transparent text-axiom-textMuted hover:bg-indigo-500/10 hover:text-indigo-200"
            )}
          >
            Migrated
          </button>
        </div>

        {/* Right: subtle helper text */}
        <div className="hidden text-[11px] text-axiom-textMuted md:block">
          Click headers to sort • Live prices simulated
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[minmax(0,2.5fr)_repeat(4,minmax(0,1.1fr))_minmax(0,2fr)_112px] items-center gap-3 text-[11px] uppercase tracking-wide text-axiom-textMuted">
        <div>Pair</div>

        <div className="flex justify-start">
          <SortButton
            label="MCap"
            sortKey="marketCap"
            activeKey={sortKey}
            direction={direction}
            onClick={() => onSortChange("marketCap")}
          />
        </div>

        <div className="hidden justify-start md:flex">
          <SortButton
            label="Liquidity"
            sortKey="liquidity"
            activeKey={sortKey}
            direction={direction}
            onClick={() => onSortChange("liquidity")}
          />
        </div>

        <div className="hidden justify-start lg:flex">
          <SortButton
            label="Volume 24h"
            sortKey="volume24h"
            activeKey={sortKey}
            direction={direction}
            onClick={() => onSortChange("volume24h")}
          />
        </div>

        <div className="hidden justify-start lg:flex">
          <SortButton
            label="TXNs"
            sortKey="txns"
            activeKey={sortKey}
            direction={direction}
            onClick={() => onSortChange("txns")}
          />
        </div>

        {/* Token Info: static label, per-row popover handles details */}
        <div className="hidden justify-start lg:flex text-[11px] uppercase tracking-wide text-axiom-textMuted">
          Token Info
        </div>

        <div className="flex justify-end text-[11px] uppercase tracking-wide text-axiom-textMuted">
          Actions
        </div>
      </div>
    </div>
  );
}

