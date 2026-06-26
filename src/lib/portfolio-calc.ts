import type { Holding } from "@/store/portfolio";
import type { AssetType } from "./types";

export interface PricedHolding extends Holding {
  price: number;
  changePercent: number;
  value: number;
  cost: number;
  gain: number;
  gainPct: number;
}

export interface PortfolioTotals {
  holdingsValue: number;
  netWorth: number;
  totalCost: number;
  totalGain: number;
  totalGainPct: number;
  dayChange: number;
  dayChangePct: number;
  byClass: Record<string, number>;
  priced: PricedHolding[];
}

export function priceHoldings(
  holdings: Holding[],
  prices: Record<string, { price: number; changePercent: number }>,
): PricedHolding[] {
  return holdings
    .map((h) => {
      const price = prices[h.symbol]?.price ?? 0;
      const changePercent = prices[h.symbol]?.changePercent ?? 0;
      const value = h.quantity * price;
      const cost = h.quantity * h.avgCost;
      const gain = value - cost;
      const gainPct = cost > 0 ? (gain / cost) * 100 : 0;
      return { ...h, price, changePercent, value, cost, gain, gainPct };
    })
    .sort((a, b) => b.value - a.value);
}

export function computeTotals(
  holdings: Holding[],
  prices: Record<string, { price: number; changePercent: number }>,
  cash = 0,
): PortfolioTotals {
  const priced = priceHoldings(holdings, prices);

  let holdingsValue = 0;
  let totalCost = 0;
  let dayChange = 0;
  const byClass: Record<string, number> = {};

  for (const h of priced) {
    holdingsValue += h.value;
    totalCost += h.cost;
    dayChange += h.value - h.value / (1 + h.changePercent / 100);
    byClass[h.type] = (byClass[h.type] ?? 0) + h.value;
  }

  if (cash > 0) byClass.cash = cash;
  const netWorth = holdingsValue + cash;
  const totalGain = holdingsValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const dayBase = netWorth - dayChange;
  const dayChangePct = dayBase > 0 ? (dayChange / dayBase) * 100 : 0;

  return {
    holdingsValue,
    netWorth,
    totalCost,
    totalGain,
    totalGainPct,
    dayChange,
    dayChangePct,
    byClass,
    priced,
  };
}

export const CLASS_ORDER: (AssetType | "cash")[] = [
  "stock",
  "crypto",
  "gold",
  "cash",
  "fx",
];
