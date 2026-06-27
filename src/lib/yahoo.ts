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

interface ChartResult {
  meta?: ChartMeta;
  indicators?: { quote?: { close?: (number | null)[] }[] };
}

interface ChartResponse {
  chart?: {
    result?: ChartResult[];
    error?: unknown;
  };
}

function downsample(values: number[], target = 24): number[] {
  if (values.length <= target) return values;
  const step = values.length / target;
  const out: number[] = [];
  for (let i = 0; i < target; i++) out.push(values[Math.floor(i * step)]);
  return out;
}

async function fetchOne(symbol: string): Promise<Partial<Quote> | null> {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(symbol) +
    "?range=1d&interval=15m";

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
  const result = data.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta || meta.regularMarketPrice === undefined) return null;

  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const changePercent =
    prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;

  const closes = (result?.indicators?.quote?.[0]?.close ?? []).filter(
    (v): v is number => typeof v === "number" && isFinite(v),
  );

  return {
    symbol,
    price,
    changePercent,
    currency: meta.currency ?? "USD",
    name: meta.shortName ?? meta.longName ?? symbol,
    spark: downsample(closes),
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
