import { NextResponse } from "next/server";
import type { Token } from "@/store/tokensSlice";

const CMC_API_KEY = process.env.CMC_API_KEY;

// ---------- Types for CMC responses ----------

interface CmcListing {
  id: number;
  name: string;
  symbol: string;
  cmc_rank: number;
  last_updated: string;
  quote: {
    USD?: {
      price?: number;
      volume_24h?: number;
      market_cap?: number;
      percent_change_24h?: number;
    };
  };
}

interface CmcListingsResponse {
  status: {
    error_code: number;
    error_message: string | null;
  };
  data: CmcListing[];
}

interface CmcInfoEntry {
  id: number;
  name: string;
  symbol: string;
  logo?: string;
}

interface CmcInfoResponse {
  status: {
    error_code: number;
    error_message: string | null;
  };
  // keyed by id as string, e.g. "1": { id: 1, name: "Bitcoin", logo: "..." }
  data: Record<string, CmcInfoEntry>;
}

// ---------- Helper functions ----------

function phaseFromRank(rank: number | null | undefined): Token["phase"] {
  if (!rank) return "new";
  if (rank <= 50) return "migrated";
  if (rank <= 200) return "final";
  return "new";
}

function ageMinutesFromIso(lastUpdated: string | undefined): number {
  if (!lastUpdated) return 60 * 24;
  const updated = new Date(lastUpdated).getTime();
  if (Number.isNaN(updated)) return 60 * 24;
  const diffMs = Date.now() - updated;
  return Math.max(1, Math.round(diffMs / (1000 * 60)));
}

function estimateTxns(volume24h: number): { buys: number; sells: number } {
  if (!volume24h || volume24h <= 0) return { buys: 0, sells: 0 };
  const total = Math.max(10, Math.round(volume24h / 1000));
  const buys = Math.round(total * 0.6);
  const sells = total - buys;
  return { buys, sells };
}

function scoreFromRank(rank: number | null | undefined): number {
  if (!rank) return 70;
  if (rank <= 20) return 95;
  if (rank <= 100) return 90;
  if (rank <= 300) return 80;
  return 70;
}

/** Map a single CMC listing into your Token shape, with optional logo */
function mapCmcToToken(
  coin: CmcListing,
  logoUrl?: string
): Token {
  const usd = coin.quote.USD ?? {};
  const marketCap = usd.market_cap ?? 0;
  const volume24h = usd.volume_24h ?? 0;

  const liquidity = marketCap > 0 ? marketCap * 0.05 : volume24h * 0.5;
  const txns = estimateTxns(volume24h);

  return {
    id: String(coin.id),
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    ageMinutes: ageMinutesFromIso(coin.last_updated),
    avatarUrl: logoUrl ?? "",
    phase: phaseFromRank(coin.cmc_rank),

    priceUsd: usd.price ?? 0,
    priceChangePct: usd.percent_change_24h ?? 0,
    marketCap,
    liquidity,
    volume24h,
    txns,
    score: scoreFromRank(coin.cmc_rank),
  };
}

// ---------- Fallback static tokens (unchanged) ----------

const FALLBACK_TOKENS: Token[] = [
  {
    id: "fwog",
    name: "FWOG",
    symbol: "FWOG",
    ageMinutes: 60 * 24,
    avatarUrl: "",
    phase: "new",
    priceUsd: 0.00045,
    priceChangePct: 1.48,
    marketCap: 6_630_000,
    liquidity: 1_750_000,
    volume24h: 31_300,
    txns: { buys: 49, sells: 38 },
    score: 86,
  },
  {
    id: "believe",
    name: "BELIEVE",
    symbol: "BELIEVE",
    ageMinutes: 5,
    avatarUrl: "",
    phase: "new",
    priceUsd: 0.0011,
    priceChangePct: 65.2,
    marketCap: 11_600,
    liquidity: 13_900,
    volume24h: 23_100,
    txns: { buys: 305, sells: 131 },
    score: 92,
  },
  {
    id: "apa",
    name: "APA",
    symbol: "APA",
    ageMinutes: 21,
    avatarUrl: "",
    phase: "final",
    priceUsd: 0.00036,
    priceChangePct: 32.75,
    marketCap: 361_000,
    liquidity: 24_800,
    volume24h: 12_300,
    txns: { buys: 220, sells: 79 },
    score: 80,
  },
  {
    id: "foreign",
    name: "FOREIGN",
    symbol: "FOREIGN",
    ageMinutes: 50,
    avatarUrl: "",
    phase: "final",
    priceUsd: 0.00011,
    priceChangePct: -0.57,
    marketCap: 112_000,
    liquidity: 32_300,
    volume24h: 7_930,
    txns: { buys: 112, sells: 44 },
    score: 71,
  },
  {
    id: "mutt",
    name: "MUTT Official Pump",
    symbol: "MUTT",
    ageMinutes: 60,
    avatarUrl: "",
    phase: "migrated",
    priceUsd: 0.00018,
    priceChangePct: 11.22,
    marketCap: 183_000,
    liquidity: 41_500,
    volume24h: 9_190,
    txns: { buys: 112, sells: 52 },
    score: 88,
  },
];

// ---------- GET handler ----------

export async function GET() {
  if (!CMC_API_KEY) {
    console.warn("[/api/tokens] CMC_API_KEY not set, using fallback tokens");
    return NextResponse.json(FALLBACK_TOKENS);
  }

  const params = new URLSearchParams({
    start: "1",
    limit: "50", // top 50
    convert: "USD",
    sort: "market_cap",
  });

  try {
    // 1) Latest listings
    const listingsRes = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?${params.toString()}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": CMC_API_KEY,
          Accept: "application/json",
          "Accept-Encoding": "deflate, gzip",
        },
        next: { revalidate: 60 },
      }
    );

    if (!listingsRes.ok) {
      console.error("[/api/tokens] CMC listings error status", listingsRes.status);
      return NextResponse.json(FALLBACK_TOKENS);
    }

    const listingsJson = (await listingsRes.json()) as CmcListingsResponse;

    if (listingsJson.status.error_code !== 0) {
      console.error(
        "[/api/tokens] CMC listings error payload",
        listingsJson.status.error_code,
        listingsJson.status.error_message
      );
      return NextResponse.json(FALLBACK_TOKENS);
    }

    const coins = listingsJson.data.slice(0, 25); // subset for the table

    // 2) Metadata / logos for those IDs
    const ids = coins.map((c) => c.id).join(",");
    let logosById: Record<number, string> = {};

    try {
      const infoRes = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${ids}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": CMC_API_KEY,
            Accept: "application/json",
            "Accept-Encoding": "deflate, gzip",
          },
          // can cache a bit longer; logos are static-ish
          next: { revalidate: 600 },
        }
      );

      if (infoRes.ok) {
        const infoJson = (await infoRes.json()) as CmcInfoResponse;
        if (infoJson.status.error_code === 0 && infoJson.data) {
          const map: Record<number, string> = {};
          for (const [idStr, entry] of Object.entries(infoJson.data)) {
            if (entry.logo) {
              map[Number(idStr)] = entry.logo;
            }
          }
          logosById = map;
        } else {
          console.warn(
            "[/api/tokens] CMC info error payload",
            infoJson.status.error_code,
            infoJson.status.error_message
          );
        }
      } else {
        console.warn("[/api/tokens] CMC info error status", infoRes.status);
      }
    } catch (infoErr) {
      console.warn("[/api/tokens] CMC info request failed, continuing without logos", infoErr);
    }

    // 3) Map to Token[] with logos (if present)
    const tokens: Token[] = coins.map((coin) =>
      mapCmcToToken(coin, logosById[coin.id])
    );

    return NextResponse.json(tokens);
  } catch (err) {
    console.error("[/api/tokens] Failed to call CMC, using fallback", err);
    return NextResponse.json(FALLBACK_TOKENS);
  }
}
