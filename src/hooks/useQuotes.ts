"use client";

import { useEffect, useRef, useState } from "react";
import type { Quote } from "@/lib/types";

export interface QuoteData {
  price: number;
  changePercent: number;
  currency: string;
  name: string;
  updatedAt: number;
}

/**
 * @param symbols
 * @param intervalMs
 */
export function useQuotes(symbols: string[], intervalMs = 10_000) {
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const key = symbols.join(",");

  useEffect(() => {
    if (symbols.length === 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/quote?symbols=${encodeURIComponent(key)}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { quotes: Quote[] };
        if (cancelled) return;
        const next: Record<string, QuoteData> = {};
        for (const q of data.quotes) {
          next[q.symbol] = {
            price: q.price,
            changePercent: q.changePercent,
            currency: q.currency,
            name: q.name,
            updatedAt: Date.now(),
          };
        }
        setQuotes(next);
        setError(null);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "fetch error");
      } finally {
        if (!cancelled) {
          setLoading(false);
          timer = setTimeout(poll, intervalMs);
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key, intervalMs]);

  return { quotes, loading, error };
}
