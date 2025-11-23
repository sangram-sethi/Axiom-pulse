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

  // Memoize tokens so we don't create a new array every render
  const tokens = useMemo<Token[]>(() => {
    return (data ?? []) as Token[];
  }, [data]);

  // Live price updates
  usePriceSocket(tokens);

  // Filter by tab (phase)
  const phaseFiltered = useMemo(
    () => tokens.filter((t) => t.phase === phase),
    [tokens, phase]
  );

  // Sorting
  const { sorted, sortKey, direction, toggleSort } =
    useTokenSorting(phaseFiltered);

  if (isError) {
    return <TokenTableError message={error?.message} />;
  }

  return (
    <ErrorBoundary>
      {/* Horizontal scroll on tiny screens */}
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
            {/* Skeleton while loading */}
            {isLoading &&
              Array.from({ length: 4 }).map((_, idx) => (
                <TokenSkeletonRow key={idx} />
              ))}

            {/* Real rows */}
            {!isLoading &&
              sorted.map((token) => <TokenRow key={token.id} token={token} />)}

            {/* Empty-state fallback */}
            {!isLoading && !sorted.length && (
              <div className="px-6 py-6 text-sm text-axiom-textMuted">
                No tokens available for this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}


