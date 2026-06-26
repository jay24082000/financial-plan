import { NextResponse } from "next/server";
import { fetchYahooQuotes } from "@/lib/yahoo";
import { metaForSymbol } from "@/lib/types";
import type { Quote } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("symbols");
  if (!raw) {
    return NextResponse.json({ quotes: [] });
  }

  const symbols = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const data = await fetchYahooQuotes(symbols);
    const quotes: Quote[] = symbols.map((symbol) => {
      const meta = metaForSymbol(symbol);
      const q = data.get(symbol);
      return {
        symbol,
        displaySymbol: meta?.display ?? symbol,
        name: meta?.name ?? q?.name ?? symbol,
        type: meta?.type ?? "stock",
        price: q?.price ?? NaN,
        changePercent: q?.changePercent ?? 0,
        currency: q?.currency ?? "USD",
      };
    });
    return NextResponse.json({ quotes });
  } catch (e) {
    return NextResponse.json(
      { quotes: [], error: e instanceof Error ? e.message : "fetch failed" },
      { status: 502 },
    );
  }
}
