"use client";

import { useEffect, useState } from "react";

export function useCryptoSparks(symbols: string[]) {
  const [sparks, setSparks] = useState<Record<string, number[]>>({});
  const key = symbols.join(",");

  useEffect(() => {
    if (symbols.length === 0) return;
    let cancelled = false;

    const load = async () => {
      const results = await Promise.allSettled(
        symbols.map(async (sym) => {
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=15m&limit=24`,
          );
          if (!res.ok) throw new Error(`${res.status}`);
          const rows = (await res.json()) as unknown[][];
          return [sym, rows.map((r) => parseFloat(r[4] as string))] as const;
        }),
      );
      if (cancelled) return;
      const next: Record<string, number[]> = {};
      for (const r of results) {
        if (r.status === "fulfilled") next[r.value[0]] = r.value[1];
      }
      setSparks(next);
    };

    load();
    const timer = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return sparks;
}
