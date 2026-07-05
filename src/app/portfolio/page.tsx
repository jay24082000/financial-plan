"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardLabel, SectionTitle } from "@/components/Card";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { AssetIcon, CLASS_COLOR } from "@/components/AssetIcon";
import { DonutChart } from "@/components/DonutChart";
import { Disclaimer } from "@/components/Disclaimer";
import { useHoldings } from "@/hooks/useHoldings";
import { useAllPrices } from "@/hooks/useAllPrices";
import { useMounted } from "@/hooks/useMounted";
import { computeTotals, CLASS_ORDER } from "@/lib/portfolio-calc";
import { ALL_SYMBOLS, metaForSymbol } from "@/lib/types";
import { formatPercent } from "@/lib/format";
import { useCurrency } from "@/components/CurrencyProvider";

const CLASS_LABEL: Record<string, string> = {
  stock: "Stocks",
  crypto: "Crypto",
  gold: "Gold",
  fx: "FX",
  cash: "Cash",
};

export default function PortfolioPage() {
  const mounted = useMounted();
  const { fmt, fmtSigned } = useCurrency();
  const { holdings, addHolding, updateHolding, removeHolding } = useHoldings();
  const { prices } = useAllPrices();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<{
    id: string;
    type: (typeof ALL_SYMBOLS)[number]["type"];
    symbol: string;
    label: string;
    quantity: number;
    avgCost: number;
  } | null>(null);

  const totals = useMemo(
    () => computeTotals(holdings, prices),
    [holdings, prices],
  );

  const donut = CLASS_ORDER.filter((c) => totals.byClass[c]).map((c) => ({
    label: CLASS_LABEL[c],
    value: totals.byClass[c],
    color: CLASS_COLOR[c],
  }));

  const gainPos = totals.totalGain >= 0;

  if (!mounted) return <div className="min-h-[60vh]" />;

  return (
    <>
      <PageShell>
        <PageHeader
          title="Portfolio"
          subtitle="Your holdings with live profit & loss"
          right={
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 rounded-[11px] bg-[#10141a] px-4.5 py-2.75 text-[13.5px] font-semibold text-white"
            >
              <Plus size={16} /> Add holding
            </button>
          }
        />

        <div className="mb-4.5 grid gap-4.5 sm:grid-cols-3">
          <Card>
            <CardLabel>Total value</CardLabel>
            <div className="mer-num mt-1.5 text-[26px] font-semibold">
              {fmt(totals.holdingsValue)}
            </div>
          </Card>
          <Card>
            <CardLabel>Total P/L</CardLabel>
            <div
              className="mer-num mt-1.5 text-[26px] font-semibold"
              style={{ color: gainPos ? "#0e9466" : "#cf4842" }}
            >
              {fmtSigned(totals.totalGain)}
            </div>
            <div
              className="mer-num text-[13px] font-semibold"
              style={{ color: gainPos ? "#0e9466" : "#cf4842" }}
            >
              {formatPercent(totals.totalGainPct)}
            </div>
          </Card>
          <Card>
            <CardLabel>Today</CardLabel>
            <div
              className="mer-num mt-1.5 text-[26px] font-semibold"
              style={{ color: totals.dayChange >= 0 ? "#0e9466" : "#cf4842" }}
            >
              {fmtSigned(totals.dayChange)}
            </div>
            <div
              className="mer-num text-[13px] font-semibold"
              style={{ color: totals.dayChange >= 0 ? "#0e9466" : "#cf4842" }}
            >
              {formatPercent(totals.dayChangePct)}
            </div>
          </Card>
        </div>

        <div className="grid items-start gap-4.5 lg:grid-cols-[1.7fr_1fr]">
          <Card className="p-0! overflow-hidden">
            <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr_0.7fr] gap-2 border-b border-[#f0f0e8] px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-[#9aa0a8] md:grid">
              <span>Asset</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Avg cost</span>
              <span className="text-right">Price</span>
              <span className="text-right">Value / P&L</span>
              <span></span>
            </div>
            {totals.priced.map((h) => {
              const pos = h.gain >= 0;
              return (
                <div
                  key={h.id}
                  className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr_0.7fr] items-center gap-2 border-b border-[#f4f4ee] px-5 py-3.5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <AssetIcon type={h.type} label={h.label} size={34} />
                    <div>
                      <div className="text-[14px] font-bold">{h.label}</div>
                      <div className="text-[12px] text-[#9aa0a8]">
                        {CLASS_LABEL[h.type]}
                      </div>
                    </div>
                  </div>
                  <div className="mer-num text-right text-[13px]">
                    {h.quantity}
                  </div>
                  <div className="mer-num text-right text-[13px]">
                    {fmt(h.avgCost, 2)}
                  </div>
                  <div className="mer-num text-right text-[13px]">
                    {isFinite(h.price) && h.price > 0 ? fmt(h.price, 2) : "…"}
                  </div>
                  <div className="text-right">
                    <div className="mer-num text-[13.5px] font-semibold">
                      {fmt(h.value)}
                    </div>
                    <div
                      className="mer-num text-[12px] font-semibold"
                      style={{ color: pos ? "#0e9466" : "#cf4842" }}
                    >
                      {fmtSigned(h.gain)} ({formatPercent(h.gainPct)})
                    </div>
                  </div>
                  <div className="flex justify-end gap-0.5">
                    <button
                      onClick={() =>
                        setEditing({
                          id: h.id,
                          type: h.type,
                          symbol: h.symbol,
                          label: h.label,
                          quantity: h.quantity,
                          avgCost: h.avgCost,
                        })
                      }
                      className="rounded-lg p-2 text-[#b0b4ba] transition hover:bg-[#f6f6f2] hover:text-[#3a4048]"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => removeHolding(h.id)}
                      className="rounded-lg p-2 text-[#b0b4ba] transition hover:bg-[#f6f6f2] hover:text-[#cf4842]"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            {totals.priced.length === 0 && (
              <div className="px-5 py-10 text-center text-[13px] text-[#9aa0a8]">
                No holdings yet. Click “Add holding” to start.
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle>Allocation</SectionTitle>
            <div className="mt-2">
              <DonutChart data={donut} />
            </div>
            <div className="mt-3 flex flex-col gap-2.5">
              {donut.map((d) => {
                const pct =
                  totals.holdingsValue > 0
                    ? (d.value / totals.holdingsValue) * 100
                    : 0;
                return (
                  <div
                    key={d.label}
                    className="flex items-center justify-between text-[13px]"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.25 w-2.25 rounded-[3px]"
                        style={{ background: d.color }}
                      />
                      {d.label}
                    </span>
                    <span className="mer-num font-semibold">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </PageShell>

      {showAdd && (
        <HoldingModal
          onClose={() => setShowAdd(false)}
          onSubmit={(h) => {
            addHolding(h);
            setShowAdd(false);
          }}
        />
      )}
      {editing && (
        <HoldingModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={(h) => {
            updateHolding(editing.id, h);
            setEditing(null);
          }}
        />
      )}
      <Disclaimer />
    </>
  );
}

function HoldingModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: { symbol: string; quantity: number; avgCost: number };
  onClose: () => void;
  onSubmit: (h: {
    type: (typeof ALL_SYMBOLS)[number]["type"];
    symbol: string;
    label: string;
    quantity: number;
    avgCost: number;
  }) => void;
}) {
  const { currency, toUSD, fromUSD, symbol: curSymbol } = useCurrency();
  const isEdit = !!initial;
  const [symbol, setSymbol] = useState(
    initial?.symbol ?? ALL_SYMBOLS[0].symbol,
  );
  const [quantity, setQuantity] = useState(
    initial ? String(initial.quantity) : "",
  );
  const [avgCost, setAvgCost] = useState(
    initial ? String(Math.round(fromUSD(initial.avgCost) * 100) / 100) : "",
  );

  const meta = metaForSymbol(symbol);
  const valid = meta && Number(quantity) > 0 && Number(avgCost) > 0;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-[18px] border-[#ecece4] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-extrabold">
            {isEdit ? "Edit holding" : "Add holding"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-[#3a4048]">
              Asset
            </span>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="rounded-[10px] border border-[#e3e3da] bg-white px-3 py-2.5 text-[14px] outline-hidden focus:border-[#13b07a]"
            >
              {ALL_SYMBOLS.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.display} — {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-[#3a4048]">
              Quantity
            </span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="mer-num rounded-[10px] border border-[#e3e3da] px-3 py-2.5 text-[14px] outline-hidden focus:border-[#13b07a]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-[#3a4048]">
              Average cost ({currency} {curSymbol})
            </span>
            <input
              type="number"
              value={avgCost}
              onChange={(e) => setAvgCost(e.target.value)}
              placeholder="0.00"
              className="mer-num rounded-[10px] border border-[#e3e3da] px-3 py-2.5 text-[14px] outline-hidden focus:border-[#13b07a]"
            />
          </label>

          <button
            disabled={!valid}
            onClick={() => {
              if (!meta) return;
              onSubmit({
                type: meta.type,
                symbol: meta.symbol,
                label: meta.display,
                quantity: Number(quantity),
                avgCost: toUSD(Number(avgCost)),
              });
            }}
            className="mt-1 rounded-[11px] bg-[#10141a] py-3 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isEdit ? "Save changes" : "Add to portfolio"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
