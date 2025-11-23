"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { useSearch } from "@/context/SearchContext";

export function TopNav() {
  const { query, setQuery } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Top row */}
        <div className="flex h-14 items-center justify-between md:h-16">
          {/* Left: logo + brand */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative h-7 w-7 md:h-8 md:w-8">
              <Image
                src="/axiom-logo.ico" // make sure this file exists in /public
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
            {/* Live pill — desktop only */}
            <button className="hidden items-center rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-axiom-textSecondary hover:bg-slate-800/80 cursor-pointer md:inline-flex">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </button>

            {/* Bell: always visible */}
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80 cursor-pointer">
              <Bell className="h-4 w-4" />
            </button>

            {/* Settings: always visible */}
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80 cursor-pointer">
              <Settings className="h-4 w-4" />
            </button>

            {/* Login dialog – green pill, visible on all breakpoints */}
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

            {/* Mobile menu button (shows dropdown with search + Connect) */}
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-axiom-textSecondary hover:bg-slate-800/80 cursor-pointer md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown: search + Live + Connect */}
        {mobileMenuOpen && (
          <div className="mb-2 mt-1 space-y-2 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-axiom-textSecondary shadow-lg shadow-black/50 md:hidden">
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
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Connection stable
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
