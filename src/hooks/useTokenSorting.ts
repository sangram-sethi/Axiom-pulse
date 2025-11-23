"use client";

import { useMemo, useState } from "react";
import type { Token } from "@/store/tokensSlice";

export type SortKey =
  | "marketCap"
  | "liquidity"
  | "volume24h"
  | "txns"
  | "score";

export type SortDirection = "asc" | "desc";

export function useTokenSorting(tokens: Token[]) {
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sorted = useMemo(() => {
    const arr = [...tokens];

    arr.sort((a, b) => {
      let av = 0;
      let bv = 0;

      switch (sortKey) {
        case "marketCap":
          av = a.marketCap;
          bv = b.marketCap;
          break;
        case "liquidity":
          av = a.liquidity;
          bv = b.liquidity;
          break;
        case "volume24h":
          av = a.volume24h;
          bv = b.volume24h;
          break;
        case "txns":
          av = a.txns.buys + a.txns.sells;
          bv = b.txns.buys + b.txns.sells;
          break;
        case "score":
          av = a.score;
          bv = b.score;
          break;
      }

      if (av === bv) return 0;
      const res = av > bv ? 1 : -1;
      return direction === "asc" ? res : -res;
    });

    return arr;
  }, [tokens, sortKey, direction]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setDirection("desc");
    }
  };

  return {
    sorted,
    sortKey,
    direction,
    toggleSort,
  };
}
