"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";
import type { SortDirection, SortKey } from "@/hooks/useTokenSorting";

interface HeaderProps {
  activePhase: string;
  onPhaseChange: (value: string) => void;
  sortKey: SortKey;
  direction: SortDirection;
  onSortChange: (key: SortKey) => void;
}

function SortButton({
  label,
  sortKey,
  activeKey,
  direction,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onClick: () => void;
}) {
  const isActive = sortKey === activeKey;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-axiom-textMuted",
        "hover:text-axiom-textPrimary transition-colors"
      )}
    >
      {label}
      {isActive &&
        (direction === "desc" ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronUp className="h-3 w-3" />
        ))}
    </button>
  );
}

export function TokenTableHeader({
  activePhase,
  onPhaseChange,
  sortKey,
  direction,
  onSortChange,
}: HeaderProps) {
  return (
    <div className="border-b border-slate-800/80 px-4 pt-3 md:px-6">
      <Tabs.Root value={activePhase} onValueChange={onPhaseChange}>
        <div className="mb-2 flex items-center justify-between gap-4">
          {/* Tabs for columns */}
          <Tabs.List className="inline-flex rounded-full bg-slate-900/80 p-1 text-xs">
            <Tabs.Trigger
              value="new"
              className="inline-flex min-w-[90px] items-center justify-center rounded-full px-3 py-1.5 text-[11px] text-axiom-textMuted data-[state=active]:bg-slate-700 data-[state=active]:text-axiom-textPrimary"
            >
              New Pairs
            </Tabs.Trigger>
            <Tabs.Trigger
              value="final"
              className="inline-flex min-w-[110px] items-center justify-center rounded-full px-3 py-1.5 text-[11px] text-axiom-textMuted data-[state=active]:bg-slate-700 data-[state=active]:text-axiom-textPrimary"
            >
              Final Stretch
            </Tabs.Trigger>
            <Tabs.Trigger
              value="migrated"
              className="inline-flex min-w-[100px] items-center justify-center rounded-full px-3 py-1.5 text-[11px] text-axiom-textMuted data-[state=active]:bg-slate-700 data-[state=active]:text-axiom-textPrimary"
            >
              Migrated
            </Tabs.Trigger>
          </Tabs.List>

          <div className="hidden items-center gap-3 text-[11px] text-axiom-textMuted md:flex">
            <span className="rounded-full bg-slate-900/80 px-3 py-1">
              5m view
            </span>
            <span>Filter ▾</span>
          </div>
        </div>

        {/* Column names row */}
        <div className="grid grid-cols-[minmax(0,2.5fr)_repeat(4,minmax(0,1.1fr))_minmax(0,2fr)_112px] gap-4 pb-2 text-[11px] uppercase tracking-wide text-axiom-textMuted">
          <div>Pair Info</div>
          <div>
            <SortButton
              label="Market Cap"
              sortKey="marketCap"
              activeKey={sortKey}
              direction={direction}
              onClick={() => onSortChange("marketCap")}
            />
          </div>
          <div className="hidden md:block">
            <SortButton
              label="Liquidity"
              sortKey="liquidity"
              activeKey={sortKey}
              direction={direction}
              onClick={() => onSortChange("liquidity")}
            />
          </div>
          <div className="hidden lg:block">
            <SortButton
              label="Volume"
              sortKey="volume24h"
              activeKey={sortKey}
              direction={direction}
              onClick={() => onSortChange("volume24h")}
            />
          </div>
          <div className="hidden lg:block">
            <SortButton
              label="Txns"
              sortKey="txns"
              activeKey={sortKey}
              direction={direction}
              onClick={() => onSortChange("txns")}
            />
          </div>
          <div className="hidden lg:block text-[11px] uppercase tracking-wide text-axiom-textMuted">
  Token Info
</div>

          <div className="text-right">Action</div>
        </div>
      </Tabs.Root>
    </div>
  );
}
