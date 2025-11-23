"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/hooks/useAppSelector";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface TokenRowProps {
  token: Token;
}

interface BuyDialogProps {
  token: Token;
  price: number;
  priceColor: string;
}

function BuyDialog({ token, price, priceColor }: BuyDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          data-row-ignore-click="true"
          className="h-8 min-w-[70px] text-xs"
        >
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
            This is a static demo buy panel. In the real app you would hook this
            up to your trading flow.
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
            <Button className="h-9 px-4 text-xs">Place Order</Button>
          </div>

          <Dialog.Close asChild>
            <button className="absolute right-3 top-3 text-xs text-axiom-textMuted hover:text-axiom-textPrimary cursor-pointer">
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const TokenRow = memo(function TokenRow({ token }: TokenRowProps) {
  const runtime = useAppSelector(
    (state) => state.tokens.runtime[token.id]
  );

  const totalTxns = token.txns.buys + token.txns.sells;
  const price = runtime?.lastPriceUsd ?? token.priceUsd;
  const direction = runtime?.direction ?? "flat";

  const priceColor =
    direction === "up"
      ? "text-axiom-positive"
      : direction === "down"
      ? "text-axiom-negative"
      : "text-axiom-textPrimary";

  const [detailsOpen, setDetailsOpen] = useState(false); // desktop row details dialog
  const [mobileExpanded, setMobileExpanded] = useState(false); // mobile "More" panel

  const handleRowClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, [data-row-ignore-click='true']")) {
      return;
    }
    setDetailsOpen(true);
  };

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, [data-row-ignore-click='true']")) {
      return;
    }
    event.preventDefault();
    setDetailsOpen(true);
  };

  return (
    <>
      {/* Mobile layout: summary + "More" details */}
      <div className="flex flex-col border-t border-white/5 bg-slate-900/30 px-4 py-3 text-sm md:hidden">
        {/* Top summary row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-slate-800">
              {token.avatarUrl ? (
                <Image
                  src={token.avatarUrl}
                  alt={token.symbol}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[11px] text-axiom-textMuted">
                  {token.symbol.slice(0, 3)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {token.name}{" "}
                  <span className="text-axiom-textMuted">{token.symbol}</span>
                </span>
                {/* Age info popover on mobile too */}
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
              <div className="text-[11px] text-axiom-textMuted">
                {formatAge(token.ageMinutes)}
              </div>
            </div>
          </div>

          {/* Right summary metrics */}
          <div className="flex flex-col items-end gap-1 text-xs">
            <span className="font-mono tabular-nums">
              {formatCompactCurrency(token.marketCap)}
            </span>
            <span
              className={clsx(
                "font-mono tabular-nums text-[11px]",
                token.priceChangePct >= 0
                  ? "text-axiom-positive"
                  : "text-axiom-negative"
              )}
            >
              {token.priceChangePct >= 0 ? "+" : ""}
              {token.priceChangePct.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* "More details" toggle */}
        <button
          type="button"
          className="mt-2 inline-flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2 text-[11px] text-axiom-textSecondary hover:bg-slate-900 cursor-pointer"
          onClick={() => setMobileExpanded((v) => !v)}
        >
          <span className="inline-flex items-center gap-1">
            <LineChart className="h-3 w-3" />
            More details
          </span>
          {mobileExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Expanded panel */}
        {mobileExpanded && (
          <div className="mt-2 space-y-3 rounded-xl bg-slate-900/80 px-3 py-2 text-xs text-axiom-textSecondary">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                  Liquidity
                </div>
                <div className="font-mono tabular-nums text-axiom-textPrimary">
                  {formatCompactCurrency(token.liquidity)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                  24h Volume
                </div>
                <div className="font-mono tabular-nums text-axiom-textPrimary">
                  {formatCompactCurrency(token.volume24h)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                  TXNs (24h)
                </div>
                <div className="font-mono tabular-nums text-axiom-textPrimary">
                  {totalTxns}{" "}
                  <span className="text-axiom-textMuted">
                    ({token.txns.buys}/{token.txns.sells})
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                  Score
                </div>
                <div className="font-mono tabular-nums text-axiom-textPrimary">
                  {token.score}/100
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <BuyDialog token={token} price={price} priceColor={priceColor} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop layout: grid row + click for details dialog */}
      <div
        className={twMerge(
        "group relative hidden cursor-pointer items-center px-4 py-3 text-sm md:grid md:px-6",
        "grid-cols-[minmax(0,2.5fr)_repeat(4,minmax(0,1.1fr))_minmax(0,2fr)_112px]",
        // glassy strip
        "border-t border-white/5 bg-slate-900/25",
        "hover:bg-slate-900/50 transition-colors duration-150 ease-smooth"
        )}
        role="button"
        tabIndex={0}
        onClick={handleRowClick}
        onKeyDown={handleRowKeyDown}
      >
        {/* Left accent bar on hover */}
        <div className="pointer-events-none absolute inset-y-1 left-0 w-[3px] rounded-full bg-axiom-accent/0 transition-colors duration-200 group-hover:bg-axiom-accent/80" />

        {/* Pair Info */}
        <div className="flex items-center gap-3">
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

              {/* Small "i" icon – click-based popover, excluded from row click */}
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    data-row-ignore-click="true"
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
          <span className="text-[13px] font-mono tabular-nums">
            {totalTxns}
          </span>
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
                data-row-ignore-click="true"
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

        {/* Action – Buy dialog (shared component) */}
        <div className="flex items-center justify-end">
          <BuyDialog token={token} price={price} priceColor={priceColor} />
        </div>
      </div>

      {/* Row-wide "Token Details" dialog – desktop row click */}
      <Dialog.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[380px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/70">
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500" />
            <Dialog.Close asChild>
              <button className="absolute right-3 top-3 text-xs text-axiom-textMuted hover:text-axiom-textPrimary cursor-pointer">
                Close
              </button>
            </Dialog.Close>

            <div className="p-4 pt-5 text-xs text-axiom-textSecondary">
              <Dialog.Title className="mb-1 text-sm font-semibold text-axiom-textPrimary">
                {token.name}{" "}
                <span className="text-axiom-textMuted">({token.symbol})</span>
              </Dialog.Title>
              <Dialog.Description className="mb-4 text-[11px] text-axiom-textMuted">
                Quick overview of this token&apos;s key metrics.
              </Dialog.Description>

              <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                    Price (USD)
                  </div>
                  <div className={twMerge("font-mono tabular-nums", priceColor)}>
                    ${price.toFixed(6)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                    24h Change
                  </div>
                  <div
                    className={clsx(
                      "font-mono tabular-nums",
                      token.priceChangePct >= 0
                        ? "text-axiom-positive"
                        : "text-axiom-negative"
                    )}
                  >
                    {token.priceChangePct >= 0 ? "+" : ""}
                    {token.priceChangePct.toFixed(2)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                    Market Cap
                  </div>
                  <div className="font-mono tabular-nums">
                    {formatCompactCurrency(token.marketCap)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                    24h Volume
                  </div>
                  <div className="font-mono tabular-nums">
                    {formatCompactCurrency(token.volume24h)}
                  </div>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between text-[11px]">
                <span className="text-axiom-textMuted">
                  Age:{" "}
                  <span className="font-mono tabular-nums text-axiom-textPrimary">
                    {formatAge(token.ageMinutes)}
                  </span>
                </span>
                <span className="text-axiom-textMuted">
                  Score:{" "}
                  <span className="font-mono tabular-nums text-axiom-textPrimary">
                    {token.score}/100
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-axiom-textMuted">
                  TXNs (24h):{" "}
                  <span className="font-mono tabular-nums text-axiom-textPrimary">
                    {totalTxns}
                  </span>
                </span>
                <span className="text-axiom-textMuted">
                  Buys/Sells:{" "}
                  <span className="font-mono tabular-nums text-axiom-textPrimary">
                    {token.txns.buys}/{token.txns.sells}
                  </span>
                </span>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
});
