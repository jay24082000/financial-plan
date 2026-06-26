"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardLabel, SectionTitle } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { NetWorthChart } from "@/components/NetWorthChart";
import { AssetIcon, CLASS_COLOR } from "@/components/AssetIcon";
import { Disclaimer } from "@/components/Disclaimer";
import { usePortfolio } from "@/store/portfolio";
import { useAllPrices } from "@/hooks/useAllPrices";
import { useMounted } from "@/hooks/useMounted";
import { computeTotals, CLASS_ORDER } from "@/lib/portfolio-calc";
import { buildHistory } from "@/lib/series";
import {
  formatUSD,
  formatSignedUSD,
  formatPercent,
  formatPrice,
} from "@/lib/format";

const CASH = 28450;
const RANGES = ["1W", "1M", "1Y", "ALL"] as const;
const RANGE_POINTS: Record<(typeof RANGES)[number], number> = {
  "1W": 7,
  "1M": 30,
  "1Y": 52,
  ALL: 80,
};

const CLASS_LABEL: Record<string, string> = {
  stock: "Stocks",
  crypto: "Crypto",
  gold: "Gold",
  fx: "FX",
  cash: "Cash",
};

export default function DashboardPage() {
  const mounted = useMounted();
  const holdings = usePortfolio((s) => s.holdings);
  const { prices } = useAllPrices();
  const [range, setRange] = useState<(typeof RANGES)[number]>("1Y");

  const totals = useMemo(
    () => computeTotals(holdings, prices, CASH),
    [holdings, prices],
  );

  const history = useMemo(
    () => buildHistory(totals.netWorth, RANGE_POINTS[range]),
    [totals.netWorth, range],
  );

  const gainPos = totals.totalGain >= 0;
  const dayPos = totals.dayChange >= 0;

  const allocation = CLASS_ORDER.filter((c) => totals.byClass[c]).map((c) => {
    const v = totals.byClass[c];
    const pct = totals.netWorth > 0 ? (v / totals.netWorth) * 100 : 0;
    return { cls: c, label: CLASS_LABEL[c], pct, color: CLASS_COLOR[c] };
  });

  const topHoldings = totals.priced.slice(0, 4);

  const movers = useMemo(() => {
    return Object.entries(prices)
      .map(([symbol, p]) => ({ symbol, ...p }))
      .filter((m) => isFinite(m.price) && m.price > 0)
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 5);
  }, [prices]);

  if (!mounted) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <>
      <div className="mx-auto max-w-[1200px] px-5 pb-14 pt-3 md:px-10">
        <div className="mb-6 flex items-end justify-between gap-5">
          <div>
            <div className="mb-1 text-[13px] font-medium text-[#8a8f98]">
              Friday, June 26
            </div>
            <h1 className="text-[27px] font-extrabold tracking-tight">
              Good morning, Alex
            </h1>
          </div>
          <Link
            href="/portfolio"
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[11px] bg-[#10141a] px-[18px] py-[11px] text-[13.5px] font-semibold text-white"
          >
            <span className="-mt-px text-[17px] leading-none">+</span> Add
            transaction
          </Link>
        </div>

        <div className="mb-[18px] grid gap-[18px] lg:grid-cols-[1.9fr_1fr]">
          <Card className="!p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardLabel>Total net worth</CardLabel>
                <div className="mer-num mt-1.5 text-[40px] font-semibold tracking-tight">
                  {formatUSD(totals.netWorth)}
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <span
                    className="mer-num text-[14px] font-semibold"
                    style={{ color: dayPos ? "#0e9466" : "#cf4842" }}
                  >
                    {formatSignedUSD(totals.dayChange)}
                  </span>
                  <span
                    className="mer-num rounded-full px-2 py-0.5 text-[12.5px] font-semibold"
                    style={{
                      color: dayPos ? "#0e9466" : "#cf4842",
                      background: dayPos ? "#e7f5ee" : "#fbe9e8",
                    }}
                  >
                    {formatPercent(totals.dayChangePct)}
                  </span>
                  <span className="text-[12.5px] text-[#9aa0a8]">today</span>
                </div>
              </div>
              <div className="flex gap-1 rounded-[10px] bg-[#f4f4ef] p-1">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`rounded-[7px] px-[9px] py-[5px] text-[12px] font-semibold transition ${
                      range === r
                        ? "bg-white text-[#1a1d21] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                        : "text-[#8a8f98]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2.5">
              <NetWorthChart data={history} />
            </div>
          </Card>

          <div className="flex flex-col gap-[18px]">
            <StatCard
              label="Total gain"
              value={formatSignedUSD(totals.totalGain)}
              sub={`${formatPercent(totals.totalGainPct)} all time`}
              valueClass={gainPos ? "text-[#0e9466]" : "text-[#cf4842]"}
              subClass={gainPos ? "text-[#0e9466]" : "text-[#cf4842]"}
            />
            <StatCard
              label="Investable cash"
              value={formatUSD(CASH)}
              sub="Ready to deploy"
              subClass="text-[#9aa0a8]"
            />
          </div>
        </div>

        <div className="grid gap-[18px] lg:grid-cols-3">
          <Card>
            <SectionTitle>Allocation</SectionTitle>
            <div className="mb-[18px] mt-4 flex h-[11px] overflow-hidden rounded-md">
              {allocation.map((a) => (
                <div
                  key={a.cls}
                  style={{ width: `${a.pct}%`, background: a.color }}
                />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {allocation.map((a) => (
                <div
                  key={a.cls}
                  className="flex items-center justify-between text-[13px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-[9px] w-[9px] rounded-[3px]"
                      style={{ background: a.color }}
                    />
                    <span className="font-medium text-[#3a4048]">
                      {a.label}
                    </span>
                  </div>
                  <span className="mer-num font-semibold">
                    {a.pct.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle>Top holdings</SectionTitle>
              <Link
                href="/portfolio"
                className="text-[12.5px] font-semibold text-[#0e9466]"
              >
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-3.5">
              {topHoldings.map((h) => (
                <div key={h.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AssetIcon type={h.type} label={h.label} size={32} />
                    <div>
                      <div className="text-[13px] font-bold">{h.label}</div>
                      <div className="text-[11.5px] text-[#9aa0a8]">
                        {h.type === "crypto"
                          ? h.symbol.replace("USDT", "")
                          : h.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mer-num text-[13px] font-semibold">
                      {formatUSD(h.value)}
                    </div>
                    <div
                      className="mer-num text-[11.5px] font-semibold"
                      style={{ color: h.gainPct >= 0 ? "#0e9466" : "#cf4842" }}
                    >
                      {formatPercent(h.gainPct)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle>Today&apos;s movers</SectionTitle>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0e9466]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#13b07a]" />
                LIVE
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              {movers.map((m) => (
                <div
                  key={m.symbol}
                  className="flex items-center justify-between"
                >
                  <span className="text-[13px] font-semibold">
                    {m.symbol
                      .replace("USDT", "")
                      .replace("=X", "")
                      .replace("=F", "")}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="mer-num text-[12.5px] text-[#3a4048]">
                      {formatPrice(m.price)}
                    </span>
                    <span
                      className="mer-num flex items-center gap-0.5 text-[12.5px] font-semibold"
                      style={{
                        color: m.changePercent >= 0 ? "#0e9466" : "#cf4842",
                      }}
                    >
                      <ArrowUpRight
                        size={13}
                        className={m.changePercent >= 0 ? "" : "rotate-90"}
                      />
                      {formatPercent(m.changePercent)}
                    </span>
                  </div>
                </div>
              ))}
              {movers.length === 0 && (
                <div className="text-[12.5px] text-[#9aa0a8]">
                  Loading live prices…
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      <Disclaimer />
    </>
  );
}
