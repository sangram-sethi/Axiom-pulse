"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import type { SortKey } from "@/hooks/useTokenSorting";

interface TokenTableHeaderProps {
  activePhase: "new" | "final" | "migrated";
  onPhaseChange: (phase: "new" | "final" | "migrated") => void;
  sortKey: SortKey | null;
  direction: "asc" | "desc" | null;
  onSortChange: (key: SortKey) => void;
}

interface HeaderSortButtonProps {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey | null;
  direction: "asc" | "desc" | null;
  onSortChange: (key: SortKey) => void;
  className?: string;
}

function HeaderSortButton({
  label,
  sortKey,
  activeSortKey,
  direction,
  onSortChange,
  className,
}: HeaderSortButtonProps) {
  const isActive = activeSortKey === sortKey;

  return (
    <button
      type="button"
      onClick={() => onSortChange(sortKey)}
      className={twMerge(
        "inline-flex items-center gap-1 rounded-full px-2 py-1",
        "text-[11px] uppercase tracking-wide",
        "cursor-pointer transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axiom-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        isActive
          ? "bg-slate-800/80 text-axiom-textPrimary"
          : "text-axiom-textMuted hover:text-axiom-textPrimary",
        className
      )}
    >
      <span>{label}</span>
      {isActive && (
        <span aria-hidden="true" className="text-[10px]">
          {direction === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );
}

const PHASES: { id: "new" | "final" | "migrated"; label: string }[] = [
  { id: "new", label: "New pairs" },
  { id: "final", label: "Final stretch" },
  { id: "migrated", label: "Migrated" },
];

export function TokenTableHeader({
  activePhase,
  onPhaseChange,
  sortKey,
  direction,
  onSortChange,
}: TokenTableHeaderProps) {
  return (
    <div className="border-b border-slate-800/80 px-4 pt-3 pb-2 md:px-6">
      {/* Phase tabs + sort summary */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-full bg-slate-900/80 p-0.5 text-xs">
          {PHASES.map((phase) => {
            const isActive = activePhase === phase.id;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onPhaseChange(phase.id)}
                className={twMerge(
                  "px-3 py-1 rounded-full cursor-pointer transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axiom-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  isActive
                    ? "bg-axiom-accent/90 text-slate-950"
                    : "text-axiom-textSecondary hover:bg-slate-800/80"
                )}
              >
                {phase.label}
              </button>
            );
          })}
        </div>

        <div className="hidden text-[11px] text-axiom-textMuted md:block">
          {sortKey && (
            <>
              Sorted by{" "}
              <span className="font-mono text-axiom-textPrimary">
                {sortKey}
              </span>
              {direction && (
                <span className="text-axiom-textMuted">
                  {" "}
                  ({direction === "asc" ? "asc" : "desc"})
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Column headers */}
      <div
        className={twMerge(
          "grid items-center gap-2 text-[11px] uppercase tracking-wide text-axiom-textMuted",
          "grid-cols-[minmax(0,2.5fr)_repeat(4,minmax(0,1.1fr))_minmax(0,2fr)_112px]"
        )}
      >
        {/* Pair */}
        <div className="flex items-center">
          Pair
        </div>

        {/* Market Cap */}
        <div className="flex items-center">
          <HeaderSortButton
            label="MCap"
            sortKey={"marketCap" as SortKey}
            activeSortKey={sortKey}
            direction={direction}
            onSortChange={onSortChange}
          />
        </div>

        {/* Liquidity */}
        <div className="hidden items-center md:flex">
          <HeaderSortButton
            label="Liq"
            sortKey={"liquidity" as SortKey}
            activeSortKey={sortKey}
            direction={direction}
            onSortChange={onSortChange}
          />
        </div>

        {/* Volume */}
        <div className="hidden items-center lg:flex">
          <HeaderSortButton
            label="Volume"
            sortKey={"volume24h" as SortKey}
            activeSortKey={sortKey}
            direction={direction}
            onSortChange={onSortChange}
          />
        </div>

        {/* TXNs */}
        <div className="hidden items-center lg:flex">
          <HeaderSortButton
            label="TXNs"
            sortKey={"txns" as SortKey}
            activeSortKey={sortKey}
            direction={direction}
            onSortChange={onSortChange}
          />
        </div>

        {/* Token info (not sortable) */}
        <div className="hidden items-center lg:flex">
          Token info
        </div>

        {/* Action */}
        <div className="flex items-center justify-end">
          Action
        </div>
      </div>
    </div>
  );
}
