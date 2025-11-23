"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { useSearch } from "@/context/SearchContext";
import { SimpleTooltip } from "@/components/ui/SimpleTooltip";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setDensity, setLiveUpdatesEnabled } from "@/store/uiSlice";
import { twMerge } from "tailwind-merge";

export function TopNav() {
  const { query, setQuery } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ui = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const liveEnabled = ui.preferences.liveUpdatesEnabled;
  const density = ui.preferences.density;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Top row */}
        <div className="flex h-14 items-center justify-between md:h-16">
          {/* Left: logo + brand */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative h-7 w-7 md:h-8 md:w-8">
              <Image
                src="/axiom-logo.ico"
                alt="Axiom"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-axiom-textPrimary md:text-base">
                AXIOM Pro
              </span>
              <span className="text-[11px] uppercase tracking-wide text-axiom-textMuted">
                Pulse
              </span>
            </div>
          </div>

          {/* Center: search (desktop only) */}
          <div className="hidden flex-1 items-center justify-center px-4 md:flex">
            <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs text-axiom-textSecondary shadow-sm shadow-black/30">
              <Search className="h-3.5 w-3.5 shrink-0 text-axiom-textMuted" />
              <input
                className="h-6 flex-1 bg-transparent text-xs text-axiom-textPrimary outline-none placeholder:text-axiom-textMuted"
                placeholder="Search tokens, pairs, wallets…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {/* Clear button – only when query is non-empty */}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] text-axiom-textMuted hover:bg-slate-700 hover:text-axiom-textPrimary cursor-pointer"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
              <span className="hidden rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-axiom-textMuted md:inline-flex">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-1.5 md:gap-2.5">
            {/* Live pill — desktop only, with tooltip */}
            <SimpleTooltip content="Prices are simulated and refresh every few seconds">
              <button
                type="button"
                className="hidden items-center rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-axiom-textSecondary hover:bg-slate-800/80 cursor-pointer md:inline-flex"
              >
                <span
                  className={twMerge(
                    "mr-1 inline-block h-2 w-2 rounded-full",
                    liveEnabled ? "bg-emerald-500" : "bg-slate-500"
                  )}
                />
                {liveEnabled ? "Live" : "Paused"}
              </button>
            </SimpleTooltip>

            {/* Bell: always visible */}
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>

            {/* Settings popover: live updates + density */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80 cursor-pointer"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="bottom"
                  align="end"
                  sideOffset={8}
                  className="w-64 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-axiom-textSecondary shadow-xl shadow-black/60"
                >
                  <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-axiom-textMuted">
                    Preferences
                  </div>

                  {/* Live price updates */}
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(setLiveUpdatesEnabled(!liveEnabled))
                    }
                    className="mb-3 flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px] text-axiom-textSecondary hover:bg-slate-800/80"
                  >
                    <span>Live price updates</span>
                    <span
                      className={twMerge(
                        "inline-flex h-5 min-w-[38px] items-center rounded-full border px-1 text-[10px] transition-colors duration-150",
                        liveEnabled
                          ? "justify-end border-emerald-500/60 bg-emerald-500/20 text-emerald-300"
                          : "justify-start border-slate-700 bg-slate-900 text-axiom-textMuted"
                      )}
                    >
                      <span className="h-3 w-3 rounded-full bg-current" />
                    </span>
                  </button>

                  {/* Density */}
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-wide text-axiom-textMuted">
                      Row density
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => dispatch(setDensity("comfortable"))}
                        className={twMerge(
                          "flex-1 rounded-lg border px-2 py-1.5 text-[11px]",
                          density === "comfortable"
                            ? "border-axiom-accent/60 bg-axiom-accent/10 text-axiom-accent"
                            : "border-slate-800 bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80"
                        )}
                      >
                        Comfortable
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(setDensity("compact"))}
                        className={twMerge(
                          "flex-1 rounded-lg border px-2 py-1.5 text-[11px]",
                          density === "compact"
                            ? "border-axiom-accent/60 bg-axiom-accent/10 text-axiom-accent"
                            : "border-slate-800 bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80"
                        )}
                      >
                        Compact
                      </button>
                    </div>
                  </div>

                  <Popover.Arrow className="fill-slate-950" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Login dialog – green pill */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  size="md"
                  className="inline-flex h-8 px-4 text-xs
                             bg-emerald-500 text-slate-950
                             hover:bg-emerald-400
                             border border-emerald-500/60"
                >
                  Login
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/70" />
                <Dialog.Content
                  className="fixed left-1/2 top-1/2 w-[360px] max-w-[90vw]
                             -translate-x-1/2 -translate-y-1/2
                             overflow-hidden rounded-2xl border border-slate-800
                             bg-slate-950 shadow-2xl shadow-black/70"
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500" />

                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button className="absolute right-3 top-3 text-xs text-axiom-textMuted hover:text-axiom-textPrimary cursor-pointer">
                      Close
                    </button>
                  </Dialog.Close>

                  {/* Inner content */}
                  <div className="p-4 pt-5">
                    <Dialog.Title className="mb-1.5 text-sm font-semibold">
                      Login
                    </Dialog.Title>
                    <Dialog.Description className="mb-4 text-xs text-axiom-textSecondary">
                      Enter your credentials to continue.
                    </Dialog.Description>

                    <form className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="block text-[11px] text-axiom-textMuted">
                          Username
                        </label>
                        <input
                          type="text"
                          className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs text-axiom-textPrimary outline-none placeholder:text-axiom-textMuted"
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] text-axiom-textMuted">
                          Password
                        </label>
                        <input
                          type="password"
                          className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs text-axiom-textPrimary outline-none placeholder:text-axiom-textMuted"
                          placeholder="Enter password"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        className="w-full"
                      >
                        Login
                      </Button>
                    </form>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        className="text-axiom-textMuted underline-offset-2 hover:text-axiom-textPrimary hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                      <button
                        type="button"
                        className="text-axiom-accent underline-offset-2 hover:text-axiom-accent/90 hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* Desktop Connect button */}
            <Button
              variant="primary"
              size="md"
              className="hidden h-8 px-4 text-xs md:inline-flex"
            >
              Connect
            </Button>

            {/* Mobile menu button (dropdown trigger) */}
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80 cursor-pointer md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-haspopup="true"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown: search + Live + Connect */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            role="region"
            aria-label="Axiom navigation options"
            className="mb-2 mt-1 space-y-2 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-axiom-textSecondary shadow-lg shadow-black/50 md:hidden"
          >
            {/* Search for mobile */}
            <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 shrink-0 text-axiom-textMuted" />
              <input
                className="h-6 flex-1 bg-transparent text-xs text-axiom-textPrimary outline-none placeholder:text-axiom-textMuted"
                placeholder="Search tokens, pairs, wallets…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {/* Clear button – mobile search */}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] text-axiom-textMuted hover:bg-slate-700 hover:text-axiom-textPrimary cursor-pointer"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Live + Connect inside dropdown */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-axiom-textSecondary">
                <span
                  className={twMerge(
                    "mr-1 inline-block h-2 w-2 rounded-full",
                    liveEnabled ? "bg-emerald-500" : "bg-slate-500"
                  )}
                />
                {liveEnabled ? "Connection stable" : "Updates paused"}
              </span>
              <Button
                variant="primary"
                size="md"
                className="h-8 px-4 text-xs"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connect
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
