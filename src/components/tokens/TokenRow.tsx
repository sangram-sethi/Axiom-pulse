"use client";

import React, { memo } from "react";
import Image from "next/image";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import type { Token } from "@/store/tokensSlice";
import { formatAge, formatCompactCurrency } from "@/lib/format";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "@/components/ui/Button";
import {
  Info,
  LineChart,
  ExternalLink,
  HelpCircle,
  Star,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { toggleWatchlist } from "@/store/uiSlice";

interface TokenRowProps {
  token: Token;
}

export const TokenRow = memo(function TokenRow({ token }: TokenRowProps) {
  // runtime data from Redux (live price direction etc.)
  const runtime = useAppSelector(
    (state) => state.tokens.runtime[token.id]
  );

  const density = useAppSelector(
    (state) => state.ui.preferences.density
  );

  const isWatched = useAppSelector((state) =>
    state.ui.watchlist.includes(token.id)
  );

  const dispatch = useAppDispatch();

  const totalTxns = token.txns.buys + token.txns.sells;
  const price = runtime?.lastPriceUsd ?? token.priceUsd;
  const direction = runtime?.direction ?? "flat";

  const priceColor =
    direction === "up"
      ? "text-axiom-positive"
      : direction === "down"
      ? "text-axiom-negative"
      : "text-axiom-textPrimary";

  const rowPadding =
    density === "compact"
      ? "px-4 py-2 md:px-6"
      : "px-4 py-3 md:px-6";

  const handleToggleWatchlist = () => {
    dispatch(toggleWatchlist(token.id));
  };

  return (
    <div
      className={twMerge(
        "group relative grid items-center border-t border-slate-800/80 text-sm",
        rowPadding,
        "grid-cols-[minmax(0,2.5fr)_repeat(4,minmax(0,1.1fr))_minmax(0,2fr)_112px]",
        "hover:bg-slate-900/40 transition-colors duration-150 ease-smooth"
      )}
    >
      {/* Left accent bar on hover */}
      <div className="pointer-events-none absolute inset-y-1 left-0 w-[3px] rounded-full bg-axiom-accent/0 transition-colors duration-200 group-hover:bg-axiom-accent/80" />

      {/* Pair Info + Watchlist */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Watchlist star */}
        <button
          type="button"
          onClick={handleToggleWatchlist}
          className={twMerge(
            "inline-flex h-6 w-6 items-center justify-center rounded-full border border-transparent text-axiom-textMuted hover:text-axiom-accent hover:border-axiom-accent/40 cursor-pointer transition-colors duration-150",
            isWatched &&
              "text-axiom-accent border-axiom-accent/60 bg-axiom-accent/10"
          )}
          aria-pressed={isWatched}
          aria-label={
            isWatched
              ? `Remove ${token.symbol} from watchlist`
              : `Add ${token.symbol} to watchlist`
          }
        >
          <Star
            className={twMerge(
              "h-3.5 w-3.5",
              isWatched && "fill-current"
            )}
          />
        </button>

        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-800">
          {token.avatarUrl ? (
            <Image
              src={token.avatarUrl}
              alt={token.symbol}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs text-axiom-textMuted">
              {token.symbol.slice(0, 3)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">
              {token.name}{" "}
              <span className="text-axiom-textMuted">{token.symbol}</span>
            </span>

            {/* Small "i" icon – click-based popover for age */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800/80 text-[10px] text-axiom-textMuted cursor-pointer hover:bg-slate-700/80"
                  aria-label={`View age info for ${token.symbol}`}
                >
                  i
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="top"
                  sideOffset={8}
                  className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-axiom-textSecondary shadow-lg shadow-black/60"
                >
                  <div className="mb-1 text-[10px] uppercase tracking-wide text-axiom-textMuted">
                    Pair age
                  </div>
                  <div className="font-mono tabular-nums text-xs text-axiom-textPrimary">
                    {formatAge(token.ageMinutes)}
                  </div>
                  <Popover.Arrow className="fill-slate-950" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-axiom-textMuted">
            <span>{formatAge(token.ageMinutes)}</span>
            <span className="inline-flex items-center gap-1">
              <LineChart className="h-3 w-3" />
              Trend
            </span>
            <span className="inline-flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Explorer
            </span>
          </div>
        </div>
      </div>

      {/* Market Cap */}
      <div className="flex flex-col">
        <span className="text-[13px] font-mono tabular-nums">
          {formatCompactCurrency(token.marketCap)}
        </span>
        <span
          className={clsx(
            "text-[11px] font-mono tabular-nums",
            token.priceChangePct >= 0
              ? "text-axiom-positive"
              : "text-axiom-negative"
          )}
        >
          {token.priceChangePct >= 0 ? "+" : ""}
          {token.priceChangePct.toFixed(2)}%
        </span>
      </div>

      {/* Liquidity */}
      <div className="hidden flex-col md:flex">
        <span className="text-[13px] font-mono tabular-nums">
          {formatCompactCurrency(token.liquidity)}
        </span>
      </div>

      {/* Volume */}
      <div className="hidden flex-col lg:flex">
        <span className="text-[13px] font-mono tabular-nums">
          {formatCompactCurrency(token.volume24h)}
        </span>
      </div>

      {/* Txns */}
      <div className="hidden flex-col lg:flex">
        <span className="text-[13px] font-mono tabular-nums">{totalTxns}</span>
        <span className="text-[11px] font-mono tabular-nums text-axiom-positive">
          {token.txns.buys}{" "}
          <span className="text-axiom-textMuted">/ {token.txns.sells}</span>
        </span>
      </div>

      {/* Token info – popover */}
      <div className="hidden items-center justify-start lg:flex">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-slate-800/80 px-3 py-1 text-[11px] text-axiom-textSecondary hover:bg-slate-700/70 cursor-pointer"
              aria-label={`View token info for ${token.symbol}`}
            >
              <Info className="mr-1 h-3 w-3" />
              Score {token.score}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              sideOffset={8}
              className="w-64 rounded-xl border border-slate-800 bg-axiom-surface p-3 text-xs text-axiom-textSecondary shadow-xl shadow-black/60"
            >
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-axiom-textMuted">
                <span>Token info</span>
                <HelpCircle className="h-3 w-3" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Score</span>
                  <span className="font-medium text-axiom-textPrimary">
                    {token.score}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Market cap</span>
                  <span className="font-mono tabular-nums">
                    {formatCompactCurrency(token.marketCap)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>24h volume</span>
                  <span className="font-mono tabular-nums">
                    {formatCompactCurrency(token.volume24h)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TXNs</span>
                  <span className="font-mono tabular-nums">
                    {totalTxns}
                  </span>
                </div>
              </div>
              <Popover.Arrow className="fill-axiom-surface" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Action – dialog */}
      <div className="flex items-center justify-end">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button className="h-8 min-w-[70px] text-xs">
              Buy
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-[360px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800 bg-axiom-surface p-4 shadow-2xl shadow-black/60">
              <Dialog.Title className="mb-2 text-sm font-semibold">
                Quick Buy – {token.symbol}
              </Dialog.Title>
              <Dialog.Description className="mb-4 text-xs text-axiom-textSecondary">
                This is a static demo buy panel. In the real app you would hook
                this up to your trading flow.
              </Dialog.Description>

              <div className="mb-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Price</span>
                  <span
                    className={twMerge(
                      "font-mono tabular-nums transition-colors duration-300",
                      priceColor
                    )}
                  >
                    ${price.toFixed(6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Market cap</span>
                  <span className="font-mono tabular-nums">
                    {formatCompactCurrency(token.marketCap)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>24h Volume</span>
                  <span className="font-mono tabular-nums">
                    {formatCompactCurrency(token.volume24h)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="h-9 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs outline-none placeholder:text-axiom-textMuted"
                  placeholder="Amount in SOL"
                />
                <Button className="h-9 px-4 text-xs">
                  Place Order
                </Button>
              </div>

              <Dialog.Close asChild>
                <button className="absolute right-3 top-3 text-xs text-axiom-textMuted hover:text-axiom-textPrimary cursor-pointer">
                  Close
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
});