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
import { useSearch } from "@/context/SearchContext";

export function TokenTable() {
  const { data, isLoading, isError, error } = useTokensQuery();
  const [phase, setPhase] = useState<"new" | "final" | "migrated">("new");
  const { query } = useSearch();

  // Memoize tokens from API / mock
  const tokens = useMemo<Token[]>(() => {
    return (data ?? []) as Token[];
  }, [data]);

  // Live price updates via WebSocket mock
  usePriceSocket(tokens);

  // Search filter
  const searchFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.symbol.toLowerCase().includes(q)
    );
  }, [tokens, query]);

  // Phase filter (New / Final Stretch / Migrated)
  const phaseFiltered = useMemo(
    () => searchFiltered.filter((t) => t.phase === phase),
    [searchFiltered, phase]
  );

  // Sorting
  const { sorted, sortKey, direction, toggleSort } =
    useTokenSorting(phaseFiltered);

  if (isError) {
    return <TokenTableError message={error?.message} />;
  }

  return (
    <ErrorBoundary>
      <div className="w-full overflow-x-auto">
        {/* Main card container */}
        <div
          className="min-w-[880px] rounded-2xl border border-slate-800/80
                     bg-gradient-to-b from-slate-950/90 to-slate-900/90
                     shadow-[0_18px_45px_rgba(0,0,0,0.75)]
                     backdrop-blur-md"
        >
          <TokenTableHeader
            activePhase={phase}
            onPhaseChange={(v) => setPhase(v)}
            sortKey={sortKey}
            direction={direction}
            onSortChange={toggleSort}
          />

          <div>
            {isLoading &&
              Array.from({ length: 4 }).map((_, idx) => (
                <TokenSkeletonRow key={idx} />
              ))}

            {!isLoading &&
              sorted.map((token) => <TokenRow key={token.id} token={token} />)}

            {!isLoading && !sorted.length && (
              <div className="px-6 py-6 text-sm text-axiom-textMuted">
                No tokens match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
