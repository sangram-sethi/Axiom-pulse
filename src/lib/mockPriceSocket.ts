import type { Token } from "@/store/tokensSlice";

export interface PriceMessage {
  id: string;
  priceUsd: number;
  marketCap?: number;
  volume24h?: number;
}

type Listener = (msg: PriceMessage) => void;

export class MockPriceSocket {
  private listeners = new Set<Listener>();
  private intervalId: number | null = null;
  private tokens: Token[] = [];

  start(tokens: Token[]) {
    this.tokens = tokens;
    if (this.intervalId !== null) return;

    this.intervalId = window.setInterval(() => {
      if (!this.tokens.length) return;

      const token =
        this.tokens[Math.floor(Math.random() * this.tokens.length)];

      const changeFactor = 1 + (Math.random() - 0.5) * 0.02; // ±1%
      const newPrice = token.priceUsd * changeFactor;

      const msg: PriceMessage = {
        id: token.id,
        priceUsd: Number(newPrice.toFixed(6)),
      };

      this.listeners.forEach((listener) => listener(msg));
    }, 1300);
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.listeners.clear();
  }
}

export const mockPriceSocket = new MockPriceSocket();
