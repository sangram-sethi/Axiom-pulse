"use client";

import React, { useMemo, useState } from "react";
import type { Token } from "@/store/tokensSlice";
import { useTokensQuery } from "@/hooks/useTokensQuery";
import { useTokenSorting } from "@/hooks/useTokenSorting";
import { usePriceSocket } from "@/hooks/usePriceSocket";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TokenTableHeader } from "./TokenTableHeader";
import { TokenTableError } from "./TokenTableError";
import { TokenSkeletonRow } from "./TokenSkeletonRow";
import { TokenRow } from "./TokenRow";

export function TokenTable() {
  const { data, isLoading, isError, error } = useTokensQuery();
  const [phase, setPhase] = useState<"new" | "final" | "migrated">("new");

  const tokens: Token[] = data ?? [];

  // Start WebSocket mock for live price updates
  usePriceSocket(tokens);

  const phaseFiltered = useMemo(
    () => tokens.filter((t) => t.phase === phase),
    [tokens, phase]
  );

  const { sorted, sortKey, direction, toggleSort } =
    useTokenSorting(phaseFiltered);

  if (isError) {
    return <TokenTableError message={error?.message} />;
  }

  return (
    <ErrorBoundary>
      <div className="overflow-hidden rounded-2xl border border-axiom-border bg-axiom-surface shadow-axiom-card">
        <TokenTableHeader
          activePhase={phase}
          onPhaseChange={(v) => setPhase(v as typeof phase)}
          sortKey={sortKey}
          direction={direction}
          onSortChange={toggleSort}
        />

        {/* Debug line – keep for now, remove later if you want */}
        <div className="border-b border-slate-800/70 px-6 py-2 text-xs text-axiom-textMuted">
          Debug: total tokens = {tokens.length}, current phase = {phase},
          filtered = {phaseFiltered.length}, loading ={" "}
          {isLoading ? "yes" : "no"}
        </div>

        <div className="divide-y divide-slate-800/70">
          {/* Skeleton while loading */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <TokenSkeletonRow key={idx} />
            ))}

          {/* Real Axiom-style rows */}
          {!isLoading &&
            sorted.map((token) => <TokenRow key={token.id} token={token} />)}

          {/* Empty-state fallback (shouldn’t fire with our static data) */}
          {!isLoading && !sorted.length && (
            <div className="px-6 py-6 text-sm text-axiom-textMuted">
              No tokens available for this category.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

