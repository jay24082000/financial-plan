"use client";

import { useMemo, useState } from "react";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { AssetIcon, ClassBadge } from "@/components/AssetIcon";
import { PriceCell } from "@/components/PriceCell";
import { Sparkline } from "@/components/Sparkline";
import { Disclaimer } from "@/components/Disclaimer";
import { useBinancePrices } from "@/hooks/useBinancePrices";
import { useQuotes } from "@/hooks/useQuotes";
import { useCryptoSparks } from "@/hooks/useCryptoSparks";
import { CRYPTO_SYMBOLS, YAHOO_SYMBOLS, ALL_SYMBOLS } from "@/lib/types";
import type { AssetType } from "@/lib/types";
import { formatPercent } from "@/lib/format";

const TABS = [
  { id: "all", label: "All" },
  { id: "crypto", label: "Crypto" },
  { id: "stock", label: "Stocks" },
  { id: "gold", label: "Gold" },
  { id: "fx", label: "FX" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function MarketsPage() {
  const [tab, setTab] = useState<TabId>("all");
  const { prices: crypto } = useBinancePrices(
    CRYPTO_SYMBOLS.map((s) => s.symbol),
  );
  const { quotes } = useQuotes(YAHOO_SYMBOLS.map((s) => s.symbol));
  const cryptoSparks = useCryptoSparks(CRYPTO_SYMBOLS.map((s) => s.symbol));

  const rows = useMemo(() => {
    return ALL_SYMBOLS.map((m) => {
      const src = m.type === "crypto" ? crypto[m.symbol] : quotes[m.symbol];
      const price = src?.price ?? NaN;
      const changePercent = src?.changePercent ?? 0;
      const spark =
        m.type === "crypto"
          ? (cryptoSparks[m.symbol] ?? [])
          : (quotes[m.symbol]?.spark ?? []);
      return { ...m, price, changePercent, spark };
    });
  }, [crypto, quotes, cryptoSparks]);

  const filtered = rows.filter((r) =>
    tab === "all" ? true : r.type === (tab as AssetType),
  );

  return (
    <>
      <PageShell>
        <PageHeader
          title="Markets"
          subtitle="Live prices · updating every few seconds"
          right={
            <div className="hidden gap-1 rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(20,25,30,0.04)] sm:flex">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                    tab === t.id ? "bg-[#10141a] text-white" : "text-[#646b74]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          }
        />

        <div className="mb-4 flex gap-1 overflow-x-auto sm:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold ${
                tab === t.id
                  ? "bg-[#10141a] text-white"
                  : "bg-white text-[#646b74]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Card className="!p-0 overflow-hidden">
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1.2fr_0.9fr] gap-2 border-b border-[#f0f0e8] px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-[#9aa0a8]">
            <span>Asset</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h</span>
            <span className="text-center">Trend</span>
            <span className="text-right">Class</span>
          </div>
          {filtered.map((r) => {
            const up = r.changePercent >= 0;
            const hasPrice = isFinite(r.price) && r.price > 0;
            return (
              <div
                key={r.symbol}
                className="grid grid-cols-[2fr_1.2fr_1fr_1.2fr_0.9fr] items-center gap-2 border-b border-[#f4f4ee] px-5 py-3.5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <AssetIcon type={r.type} label={r.display} size={34} />
                  <div>
                    <div className="text-[14px] font-bold">{r.display}</div>
                    <div className="text-[12px] text-[#9aa0a8]">{r.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  {hasPrice ? (
                    <PriceCell price={r.price} />
                  ) : (
                    <span className="text-[13px] text-[#c4c8cd]">…</span>
                  )}
                </div>
                <div
                  className="mer-num text-right text-[13px] font-semibold"
                  style={{ color: up ? "#0e9466" : "#cf4842" }}
                >
                  {hasPrice ? formatPercent(r.changePercent) : "—"}
                </div>
                <div className="flex justify-center">
                  {r.spark.length >= 2 ? (
                    <Sparkline data={r.spark} up={up} />
                  ) : (
                    <span className="text-[12px] text-[#c4c8cd]">—</span>
                  )}
                </div>
                <div className="flex justify-end">
                  <ClassBadge type={r.type} />
                </div>
              </div>
            );
          })}
        </Card>
      </PageShell>
      <Disclaimer />
    </>
  );
}
