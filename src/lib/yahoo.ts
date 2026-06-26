import type { Quote } from "./types";

interface ChartMeta {
  symbol?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  currency?: string;
  shortName?: string;
  longName?: string;
}

interface ChartResponse {
  chart?: {
    result?: { meta?: ChartMeta }[];
    error?: unknown;
  };
}

async function fetchOne(symbol: string): Promise<Partial<Quote> | null> {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(symbol) +
    "?range=1d&interval=1d";

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
    next: { revalidate: 10 },
  } as RequestInit & { next: { revalidate: number } });

  if (!res.ok) return null;

  const data = (await res.json()) as ChartResponse;
  const meta = data.chart?.result?.[0]?.meta;
  if (!meta || meta.regularMarketPrice === undefined) return null;

  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const changePercent =
    prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;

  return {
    symbol,
    price,
    changePercent,
    currency: meta.currency ?? "USD",
    name: meta.shortName ?? meta.longName ?? symbol,
  };
}

export async function fetchYahooQuotes(
  symbols: string[],
): Promise<Map<string, Partial<Quote>>> {
  const result = new Map<string, Partial<Quote>>();
  if (symbols.length === 0) return result;

  const settled = await Promise.allSettled(symbols.map((s) => fetchOne(s)));
  settled.forEach((r, i) => {
    if (r.status === "fulfilled" && r.value) {
      result.set(symbols[i], r.value);
    }
  });

  return result;
}
