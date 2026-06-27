// Shared types used across the app.

export type AssetType = "crypto" | "stock" | "gold" | "fx";

export interface Quote {
  symbol: string;
  displaySymbol: string;
  name: string;
  type: AssetType;
  price: number;
  changePercent: number;
  currency: string;
  spark: number[];
}

export interface AssetMeta {
  symbol: string;
  display: string;
  name: string;
  type: AssetType;
}

export interface Holding {
  id: string;
  type: AssetType;
  symbol: string;
  label: string;
  quantity: number;
  avgCost: number;
}

export const CRYPTO_SYMBOLS: AssetMeta[] = [
  { symbol: "BTCUSDT", display: "BTC", name: "Bitcoin", type: "crypto" },
  { symbol: "ETHUSDT", display: "ETH", name: "Ethereum", type: "crypto" },
  { symbol: "BNBUSDT", display: "BNB", name: "BNB", type: "crypto" },
  { symbol: "SOLUSDT", display: "SOL", name: "Solana", type: "crypto" },
  { symbol: "XRPUSDT", display: "XRP", name: "XRP", type: "crypto" },
  { symbol: "ADAUSDT", display: "ADA", name: "Cardano", type: "crypto" },
  { symbol: "DOGEUSDT", display: "DOGE", name: "Dogecoin", type: "crypto" },
];

export const STOCK_SYMBOLS: AssetMeta[] = [
  { symbol: "AAPL", display: "AAPL", name: "Apple", type: "stock" },
  { symbol: "MSFT", display: "MSFT", name: "Microsoft", type: "stock" },
  { symbol: "NVDA", display: "NVDA", name: "NVIDIA", type: "stock" },
  { symbol: "GOOGL", display: "GOOGL", name: "Alphabet", type: "stock" },
  { symbol: "AMZN", display: "AMZN", name: "Amazon", type: "stock" },
  { symbol: "TSLA", display: "TSLA", name: "Tesla", type: "stock" },
  { symbol: "META", display: "META", name: "Meta", type: "stock" },
];

export const GOLD_FX_SYMBOLS: AssetMeta[] = [
  { symbol: "GC=F", display: "Gold", name: "Gold Futures (oz)", type: "gold" },
  {
    symbol: "SI=F",
    display: "Silver",
    name: "Silver Futures (oz)",
    type: "gold",
  },
  { symbol: "EURUSD=X", display: "EUR/USD", name: "Euro / Dollar", type: "fx" },
  { symbol: "JPY=X", display: "USD/JPY", name: "Dollar / Yen", type: "fx" },
  { symbol: "THB=X", display: "USD/THB", name: "Dollar / Baht", type: "fx" },
];

export const YAHOO_SYMBOLS: AssetMeta[] = [
  ...STOCK_SYMBOLS,
  ...GOLD_FX_SYMBOLS,
];

export const ALL_SYMBOLS: AssetMeta[] = [...CRYPTO_SYMBOLS, ...YAHOO_SYMBOLS];

export function metaForSymbol(symbol: string): AssetMeta | undefined {
  return ALL_SYMBOLS.find((s) => s.symbol === symbol);
}
