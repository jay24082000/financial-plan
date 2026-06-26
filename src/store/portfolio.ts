"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssetType } from "@/lib/types";

export interface Holding {
  id: string;
  type: AssetType;
  symbol: string;
  label: string;
  quantity: number;
  avgCost: number;
}

interface PortfolioState {
  holdings: Holding[];
  addHolding: (h: Omit<Holding, "id">) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, patch: Partial<Omit<Holding, "id">>) => void;
  clear: () => void;
}

let counter = 0;
function makeId(): string {
  counter += 1;
  return `h_${Date.now().toString(36)}_${counter}`;
}

const SAMPLE: Holding[] = [
  {
    id: "seed_btc",
    type: "crypto",
    symbol: "BTCUSDT",
    label: "BTC",
    quantity: 0.5,
    avgCost: 52000,
  },
  {
    id: "seed_eth",
    type: "crypto",
    symbol: "ETHUSDT",
    label: "ETH",
    quantity: 4,
    avgCost: 2400,
  },
  {
    id: "seed_nvda",
    type: "stock",
    symbol: "NVDA",
    label: "NVIDIA",
    quantity: 80,
    avgCost: 900,
  },
  {
    id: "seed_aapl",
    type: "stock",
    symbol: "AAPL",
    label: "Apple",
    quantity: 120,
    avgCost: 175,
  },
  {
    id: "seed_gold",
    type: "gold",
    symbol: "GC=F",
    label: "Gold",
    quantity: 10,
    avgCost: 2100,
  },
];

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: SAMPLE,
      addHolding: (h) =>
        set((state) => ({
          holdings: [...state.holdings, { ...h, id: makeId() }],
        })),
      removeHolding: (id) =>
        set((state) => ({
          holdings: state.holdings.filter((h) => h.id !== id),
        })),
      updateHolding: (id, patch) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id ? { ...h, ...patch } : h,
          ),
        })),
      clear: () => set({ holdings: [] }),
    }),
    { name: "meridian-portfolio" },
  ),
);
