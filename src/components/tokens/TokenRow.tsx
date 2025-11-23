"use client";

import React, { memo, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { Token } from "@/store/tokensSlice";
import { formatAge, formatCompactCurrency } from "@/lib/format";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "@/components/ui/Button";
import { Info, LineChart, ExternalLink, HelpCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface TokenRowProps {
  token: Token;
}

export const TokenRow = memo(function TokenRow({ token }: TokenRowProps) {
  // selector closes over token.id
  const runtime = useAppSelector(
    (state) => state.tokens.runtime[token.id]
  );

  const [flashDirection, setFlashDirection] = useState<"up" | "down" | null>(
    null
  );

  useEffect(() => {
    if (!runtime) return;
    if (runtime.direction === "up" || runtime.direction === "down") {
      setFlashDirection(runtime.direction);
      const timeout = setTimeout(() => setFlashDirection(null), 350);
      return () => clearTimeout(timeout);
    }
  }, [runtime?.direction]);

  const totalTxns = token.txns.buys + token.txns.sells;
  const price = runtime?.lastPriceUsd ?? token.priceUsd;
  const direction = runtime?.direction ?? "flat";

  const priceColor =
    direction === "up"
      ? "text-axiom-positive"
      : direction === "down"
      ? "text-axiom-negative"
      : "text-axiom-textPrimary";

  const flashBg =
    flashDirection === "up"
      ? "bg-emerald-500/10"
      : flashDirection === "down"
      ? "bg-red-500/10"
      : "";

  // …rest of TokenRow JSX stays exactly as before…
});
