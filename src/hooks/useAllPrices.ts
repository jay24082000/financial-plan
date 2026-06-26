"use client";

import { useMemo } from "react";
import { useBinancePrices } from "./useBinancePrices";
import { useQuotes } from "./useQuotes";
import { CRYPTO_SYMBOLS, YAHOO_SYMBOLS } from "@/lib/types";

export interface MergedPrice {
  price: number;
  changePercent: number;
}

const CRYPTO_LIST = CRYPTO_SYMBOLS.map((s) => s.symbol);
const YAHOO_LIST = YAHOO_SYMBOLS.map((s) => s.symbol);

export function useAllPrices() {
  const { prices: crypto, connected } = useBinancePrices(
    CRYPTO_SYMBOLS.map((s) => s.symbol),
  );
  const { quotes, loading, error } = useQuotes(YAHOO_LIST);

  const map = useMemo(() => {
    const out: Record<string, MergedPrice> = {};
    for (const sym of CRYPTO_LIST) {
      const c = crypto[sym];
      if (c) out[sym] = { price: c.price, changePercent: c.changePercent };
    }
    for (const sym of YAHOO_LIST) {
      const q = quotes[sym];
      if (q) out[sym] = { price: q.price, changePercent: q.changePercent };
    }
    return out;
  }, [crypto, quotes]);

  return {
    prices: map,
    cryptoConnected: connected,
    quotesLoading: loading,
    quotesError: error,
  };
}
