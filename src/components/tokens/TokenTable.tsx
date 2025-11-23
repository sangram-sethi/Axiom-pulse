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
import { useAppSelector } from "@/hooks/useAppSelector";

type Phase = "new" | "final" | "migrated" | "watchlist";

export function TokenTable() {
  const { data, isLoading, isError, error, refetch } = useTokensQuery();
  const [phase, setPhase] = useState<Phase>("new");
  const { query } = useSearch();

  const liveUpdatesEnabled = useAppSelector(
    (state) => state.ui.preferences.liveUpdatesEnabled
  );
  const watchlistIds = useAppSelector((state) => state.ui.watchlist);

  // Last updated timestamp (in ms) and a ticking "now"
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  // Memoize tokens from API / mock
  const tokens = useMemo<Token[]>(() => {
    return (data ?? []) as Token[];
  }, [data]);

  // Live price updates via WebSocket mock (respect user preference)
  usePriceSocket(liveUpdatesEnabled ? tokens : []);

  // Subscribe to Redux store as an "external system" and update lastUpdated in the callback
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const runtime = state.tokens.runtime;

      if (!runtime || Object.keys(runtime).length === 0) return;

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

  // Phase + watchlist filter
  const phaseFiltered = useMemo(() => {
    if (phase === "watchlist") {
      if (!watchlistIds.length) return [];
      const set = new Set(watchlistIds);
      return searchFiltered.filter((t) => set.has(t.id));
    }
    return searchFiltered.filter((t) => t.phase === phase);
  }, [searchFiltered, phase, watchlistIds]);

  // Sorting
  const { sorted, sortKey, direction, toggleSort } =
    useTokenSorting(phaseFiltered);

  const trimmedQuery = query.trim();
  const hasWatchlist = watchlistIds.length > 0;

  const secondsAgo =
    lastUpdated != null
      ? Math.max(0, Math.round((now - lastUpdated) / 1000))
      : null;

  return (
    <ErrorBoundary>
      <div className="w-full overflow-x-auto">
        {/* Main card container (glass-style) */}
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
                {phase === "watchlist" ? (
                  <>
                    {!hasWatchlist && !trimmedQuery && (
                      <>
                        <p className="mb-1 text-axiom-textPrimary">
                          Your watchlist is empty.
                        </p>
                        <p className="text-[11px] text-axiom-textMuted">
                          Use the watchlist button in the table rows to save
                          tokens here.
                        </p>
                      </>
                    )}

                    {hasWatchlist && trimmedQuery && (
                      <>
                        <p className="mb-1 text-axiom-textPrimary">
                          No watchlisted tokens match “{trimmedQuery}”.
                        </p>
                        <p className="text-[11px] text-axiom-textMuted">
                          Try clearing your search or switching back to all
                          tokens.
                        </p>
                      </>
                    )}

                    {hasWatchlist && !trimmedQuery && (
                      <>
                        <p className="mb-1 text-axiom-textPrimary">
                          Your watchlisted tokens are not available in this
                          view.
                        </p>
                        <p className="text-[11px] text-axiom-textMuted">
                          They may be filtered out by the current settings.
                        </p>
                      </>
                    )}
                  </>
                ) : trimmedQuery ? (
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
                      No tokens available in this view.
                    </p>
                    <p className="text-[11px] text-axiom-textMuted">
                      Try switching tabs or updating your watchlist.
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
