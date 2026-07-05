"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrency } from "@/components/CurrencyProvider";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function MoneyField({
  label,
  usdValue,
  usdMin,
  usdMax,
  usdStep = 1,
  onChangeUSD,
  accent,
}: {
  label: string;
  usdValue: number;
  usdMin: number;
  usdMax: number;
  usdStep?: number;
  onChangeUSD: (usd: number) => void;
  accent?: boolean;
}) {
  const { fromUSD, toUSD, symbol, currency, rate } = useCurrency();
  const disp = Math.round(fromUSD(usdValue));
  const dispMin = Math.round(fromUSD(usdMin));
  const dispMax = Math.round(fromUSD(usdMax));
  const dispStep =
    currency === "THB" ? Math.max(1, Math.round(usdStep * rate)) : usdStep;

  const [text, setText] = useState(String(disp));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(String(disp));
  }, [disp]);

  const commitLive = (raw: string) => {
    setText(raw);
    if (raw === "") return;
    const n = Number(raw);
    if (isFinite(n)) onChangeUSD(toUSD(Math.min(n, dispMax)));
  };
  const commitFinal = () => {
    focused.current = false;
    const n = clamp(Number(text) || 0, dispMin, dispMax);
    setText(String(n));
    onChangeUSD(toUSD(n));
  };
  const fromSlider = (n: number) => {
    setText(String(n));
    onChangeUSD(toUSD(n));
  };

  const symEl = (
    <span className="mer-num text-[15px] font-semibold">{symbol}</span>
  );

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="text-[14px] font-semibold text-[#3a4048]">
          {label}
        </span>
        <div
          className="flex items-baseline rounded-lg border border-transparent px-1 focus-within:border-[#13b07a]"
          style={accent ? { color: "#0e9466" } : undefined}
        >
          {currency !== "THB" && symEl}
          <input
            type="number"
            value={text}
            onFocus={() => (focused.current = true)}
            onChange={(e) => commitLive(e.target.value)}
            onBlur={commitFinal}
            className="mer-num w-27.5 bg-transparent text-right text-[15px] font-semibold outline-hidden [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          {currency === "THB" && <span className="ml-1">{symEl}</span>}
        </div>
      </div>
      <input
        type="range"
        className="mer-range"
        min={dispMin}
        max={dispMax}
        step={dispStep}
        value={clamp(disp, dispMin, dispMax)}
        onChange={(e) => fromSlider(Number(e.target.value))}
      />
    </div>
  );
}

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  prefix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  const [text, setText] = useState(String(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  const commitLive = (raw: string) => {
    setText(raw);
    if (raw === "") return;
    const n = Number(raw);
    if (isFinite(n)) onChange(Math.min(n, max));
  };
  const commitFinal = () => {
    focused.current = false;
    const n = clamp(Number(text) || min, min, max);
    setText(String(n));
    onChange(n);
  };

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="text-[14px] font-semibold text-[#3a4048]">
          {label}
        </span>
        <div className="flex items-baseline rounded-lg border border-transparent px-1 focus-within:border-[#13b07a]">
          {prefix && (
            <span className="mer-num text-[15px] font-semibold">{prefix}</span>
          )}
          <input
            type="number"
            value={text}
            onFocus={() => (focused.current = true)}
            onChange={(e) => commitLive(e.target.value)}
            onBlur={commitFinal}
            className="mer-num w-16 bg-transparent text-right text-[15px] font-semibold outline-hidden [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && (
            <span className="mer-num text-[15px] font-semibold">{suffix}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        className="mer-range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onChange={(e) => {
          setText(e.target.value);
          onChange(Number(e.target.value));
        }}
      />
    </div>
  );
}
