"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Token } from "@/store/tokensSlice";
import { setTokens } from "@/store/tokensSlice";
import { useAppDispatch } from "./useAppDispatch";

async function fetchTokens(): Promise<Token[]> {
  const res = await fetch("/api/tokens");
  if (!res.ok) throw new Error("Failed to fetch tokens");
  return res.json();
}

export function useTokensQuery() {
  const dispatch = useAppDispatch();

  const query = useQuery<Token[], Error>({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setTokens(query.data));
    }
  }, [query.data, dispatch]);

  return query;
}
