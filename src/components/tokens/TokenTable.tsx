"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTokensQuery } from "@/hooks/useTokensQuery";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { Token } from "@/store/tokensSlice";
import { useTokenSorting } from "@/hooks/useTokenSorting";
import { usePriceSocket } from "@/hooks/usePriceSocket";
import { TokenTableHeader } from "./TokenTableHeader";
import { TokenSkeletonRow } from "./TokenSkeletonRow";
import { TokenRow } from "./TokenRow";
import { TokenTableError } from "./TokenTableError";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function TokenTable() {
  const { isLoading, isError, error } = useTokensQuery();
  const [phase, setPhase] = useState<"new" | "final" | "migrated">("new");
  const [visibleCount, setVisibleCount] = useState(5);

  // Typed automatically by useAppSelector
  const tokensById = useAppSelector((state) => state.tokens.byId);
  const tokens: Token[] = useMemo(
    () => Object.values(tokensById),
    [tokensById]
  );

  const phaseFiltered = useMemo(
    () => tokens.filter((t) => t.phase === phase),
    [tokens, phase]
  );

  useEffect(() => {
    if (!phaseFiltered.length) return;
    setVisibleCount(Math.min(5, phaseFiltered.length));
    const timeout = setTimeout(
      () => setVisibleCount(phaseFiltered.length),
      350
    );
    return () => clearTimeout(timeout);
  }, [phaseFiltered]);

  const { sorted, sortKey, direction, toggleSort } =
    useTokenSorting(phaseFiltered);

  usePriceSocket(tokens);

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
        <div className="divide-y divide-slate-800/70">
          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <TokenSkeletonRow key={idx} />
            ))}

          {!isLoading &&
            sorted
              .slice(0, visibleCount)
              .map((token) => <TokenRow key={token.id} token={token} />)}
        </div>
      </div>
    </ErrorBoundary>
  );
}
