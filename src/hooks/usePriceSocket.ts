"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { applyPriceUpdate, type Token } from "@/store/tokensSlice";
import { mockPriceSocket } from "@/lib/mockPriceSocket";

export function usePriceSocket(tokens: Token[]) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!tokens.length) return;

    mockPriceSocket.start(tokens);

    const unsubscribe = mockPriceSocket.subscribe((msg) => {
      dispatch(applyPriceUpdate(msg));
    });

    return () => {
      unsubscribe();
      mockPriceSocket.stop();
    };
  }, [dispatch, tokens]);
}
