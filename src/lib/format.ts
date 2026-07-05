export function formatUSD(value: number, maximumFractionDigits = 0): string {
  if (!isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

export type CurrencyCode = "USD" | "THB";

export function formatMoney(
  usd: number,
  currency: CurrencyCode,
  rate: number,
  maximumFractionDigits = 0,
): string {
  if (!isFinite(usd)) return "-";
  const value = currency === "THB" ? usd * rate : usd;
  return new Intl.NumberFormat(currency === "THB" ? "th-TH" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(value);
}

export function formatSignedMoney(
  usd: number,
  currency: CurrencyCode,
  rate: number,
  maximumFractionDigits = 0,
): string {
  if (!isFinite(usd)) return "-";
  const sign = usd > 0 ? "+" : usd < 0 ? "-" : "";
  return (
    sign + formatMoney(Math.abs(usd), currency, rate, maximumFractionDigits)
  );
}

export function formatPriceMoney(
  usd: number,
  currency: CurrencyCode,
  rate: number,
): string {
  if (!isFinite(usd)) return "-";
  const value = currency === "THB" ? usd * rate : usd;
  const digits = value >= 1000 ? 2 : value >= 1 ? 2 : value >= 0.01 ? 4 : 8;
  return new Intl.NumberFormat(currency === "THB" ? "th-TH" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatCompactMoney(
  usd: number,
  currency: CurrencyCode,
  rate: number,
): string {
  if (!isFinite(usd)) return "-";
  const value = currency === "THB" ? usd * rate : usd;
  return new Intl.NumberFormat(currency === "THB" ? "th-TH" : "en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  if (!isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(
    value,
  );
}

export function formatPercent(
  value: number,
  maximumFractionDigits = 2,
): string {
  if (!isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits,
    signDisplay: "exceptZero",
  }).format(value / 100);
}

export function formatSignedUSD(
  value: number,
  maximumFractionDigits = 0,
): string {
  if (!isFinite(value)) return "-";
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return sign + formatUSD(Math.abs(value), maximumFractionDigits);
}

export function formatCompactUSD(value: number): string {
  if (!isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPrice(value: number, currency = "USD"): string {
  if (!isFinite(value)) return "-";
  const digits = value >= 1000 ? 2 : value >= 1 ? 2 : value >= 0.01 ? 4 : 8;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
