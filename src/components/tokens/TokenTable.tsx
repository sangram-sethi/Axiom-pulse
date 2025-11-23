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

  // Memoize tokens from API
  const tokens = useMemo<Token[]>(() => {
    return (data ?? []) as Token[];
  }, [data]);

  // Live price updates
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

  // Phase filter
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
        <div className="min-w-[880px] rounded-2xl border border-axiom-border bg-axiom-surface shadow-axiom-card">
          <TokenTableHeader
            activePhase={phase}
            onPhaseChange={(v) => setPhase(v as typeof phase)}
            sortKey={sortKey}
            direction={direction}
            onSortChange={toggleSort}
          />

          <div className="divide-y divide-slate-800/70">
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



