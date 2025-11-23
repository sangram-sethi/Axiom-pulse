import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TokenPhase = "new" | "final" | "migrated";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  ageMinutes: number;
  avatarUrl?: string;
  phase: TokenPhase;

  priceUsd: number;
  priceChangePct: number;
  marketCap: number;
  liquidity: number;
  volume24h: number;
  txns: {
    buys: number;
    sells: number;
  };
  score: number;
}

export type LiveDirection = "up" | "down" | "flat";

export interface TokenRuntime {
  lastPriceUsd: number;
  direction: LiveDirection;
}

export interface TokensState {
  byId: Record<string, Token>;
  runtime: Record<string, TokenRuntime>;
}

const initialState: TokensState = {
  byId: {},
  runtime: {},
};

interface PriceUpdatePayload {
  id: string;
  priceUsd: number;
  marketCap?: number;
  volume24h?: number;
}

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<Token[]>) {
      state.byId = {};
      state.runtime = {};

      for (const token of action.payload) {
        state.byId[token.id] = token;
        state.runtime[token.id] = {
          lastPriceUsd: token.priceUsd,
          direction: "flat",
        };
      }
    },
    applyPriceUpdate(state, action: PayloadAction<PriceUpdatePayload>) {
      const { id, priceUsd, marketCap, volume24h } = action.payload;
      const token = state.byId[id];
      if (!token) return;

      const runtime = state.runtime[id] ?? {
        lastPriceUsd: token.priceUsd,
        direction: "flat" as LiveDirection,
      };

      const prev = runtime.lastPriceUsd;
      runtime.direction =
        priceUsd > prev ? "up" : priceUsd < prev ? "down" : "flat";
      runtime.lastPriceUsd = priceUsd;

      token.priceUsd = priceUsd;
      if (typeof marketCap === "number") token.marketCap = marketCap;
      if (typeof volume24h === "number") token.volume24h = volume24h;

      state.runtime[id] = runtime;
    },
  },
});

export const { setTokens, applyPriceUpdate } = tokensSlice.actions;
export default tokensSlice.reducer;
