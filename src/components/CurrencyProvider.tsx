"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  formatMoney,
  formatSignedMoney,
  formatCompactMoney,
  formatPriceMoney,
  type CurrencyCode,
} from "@/lib/format";

interface CurrencyCtx {
  currency: CurrencyCode;
  rate: number;
  setCurrency: (c: CurrencyCode) => void;
  fmt: (usd: number, maxFrac?: number) => string;
  fmtSigned: (usd: number, maxFrac?: number) => string;
  fmtCompact: (usd: number) => string;
  fmtPrice: (usd: number) => string;
  toUSD: (display: number) => number;
  fromUSD: (usd: number) => number;
  symbol: string;
}

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [rate, setRate] = useState(35);

  useEffect(() => {
    const saved = localStorage.getItem("stax-currency");
    if (saved === "THB" || saved === "USD") setCurrencyState(saved);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/quote?symbols=THB=X");
        const data = (await res.json()) as { quotes: { price: number }[] };
        const p = data.quotes?.[0]?.price;
        if (!cancelled && p && isFinite(p) && p > 0) setRate(p);
      } catch {
        // keep fallback rate
      }
    };
    load();
    const t = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem("stax-currency", c);
  };

  const value = useMemo<CurrencyCtx>(
    () => ({
      currency,
      rate,
      setCurrency,
      fmt: (usd, maxFrac = 0) => formatMoney(usd, currency, rate, maxFrac),
      fmtSigned: (usd, maxFrac = 0) =>
        formatSignedMoney(usd, currency, rate, maxFrac),
      fmtCompact: (usd) => formatCompactMoney(usd, currency, rate),
      fmtPrice: (usd) => formatPriceMoney(usd, currency, rate),
      toUSD: (display) => (currency === "THB" ? display / rate : display),
      fromUSD: (usd) => (currency === "THB" ? usd * rate : usd),
      symbol: currency === "THB" ? "฿" : "$",
    }),
    [currency, rate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
