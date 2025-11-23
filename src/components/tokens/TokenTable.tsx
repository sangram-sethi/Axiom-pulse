"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { store } from "@/store";

export function TokenTable() {
  const { data, isLoading, isError, error, refetch } = useTokensQuery();
  const [phase, setPhase] = useState<"new" | "final" | "migrated">("new");
  const { query } = useSearch();

  // Last updated timestamp (in ms) and a ticking "now"
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  // Memoize tokens from API / mock
  const tokens = useMemo<Token[]>(() => {
    return (data ?? []) as Token[];
  }, [data]);

  // Live price updates via WebSocket mock
  usePriceSocket(tokens);

  // Subscribe to Redux store as an "external system" and update lastUpdated in the callback
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const runtime = state.tokens.runtime;

      if (!runtime || Object.keys(runtime).length === 0) return;

      // This is inside the subscription callback, which React's rules allow
      setLastUpdated(Date.now());
    });

    return unsubscribe;
  }, []);

  // Tick "now" every second so "Xs ago" updates smoothly
  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

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

  const trimmedQuery = query.trim();
  const secondsAgo =
    lastUpdated != null
      ? Math.max(0, Math.round((now - lastUpdated) / 1000))
      : null;

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

          {/* Helper text + last updated */}
          <div className="flex items-center justify-between px-4 pb-2 text-[11px] text-axiom-textMuted md:px-6">
            <span className="hidden md:inline">
              Click headers to sort · Live prices simulated
            </span>
            {secondsAgo !== null && (
              <span className="ml-auto inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {secondsAgo < 2 ? (
                  <span className="inline-flex items-center gap-1">
                    Updated{" "}
                    <span className="font-mono text-axiom-textPrimary">
                      just now
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    Updated{" "}
                    <span className="font-mono text-axiom-textPrimary">
                      {secondsAgo}s
                    </span>{" "}
                    ago
                  </span>
                )}
              </span>
            )}
          </div>

          <div>
            {/* Error state with Retry */}
            {isError && (
              <TokenTableError
                message={error?.message}
                onRetry={() => refetch()}
              />
            )}

            {/* Loading state */}
            {isLoading &&
              !isError &&
              Array.from({ length: 4 }).map((_, idx) => (
                <TokenSkeletonRow key={idx} />
              ))}

            {/* Empty state: no rows after filtering */}
            {!isLoading && !isError && sorted.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-axiom-textSecondary md:px-6">
                {trimmedQuery ? (
                  <>
                    <p className="mb-1 text-axiom-textPrimary">
                      No tokens match “{trimmedQuery}”.
                    </p>
                    <p className="text-[11px] text-axiom-textMuted">
                      Try adjusting the phase filter or clearing your search.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-1 text-axiom-textPrimary">
                      No tokens available in this phase.
                    </p>
                    <p className="text-[11px] text-axiom-textMuted">
                      Try switching to another tab or refreshing the data.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Normal rows */}
            {!isLoading &&
              !isError &&
              sorted.length > 0 &&
              sorted.map((token) => <TokenRow key={token.id} token={token} />)}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
