"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearPoint } from "@/lib/finance";
import { useCurrency } from "@/components/CurrencyProvider";

export function GrowthChart({
  data,
  height = 300,
}: {
  data: YearPoint[];
  height?: number;
}) {
  const { fmt, fmtCompact } = useCurrency();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a3340" stopOpacity={0.85} />
            <stop offset="1" stopColor="#2a3340" stopOpacity={0.55} />
          </linearGradient>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#13b07a" stopOpacity={0.9} />
            <stop offset="1" stopColor="#13b07a" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#eeeee7" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#9aa0a8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}y`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9aa0a8" }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => fmtCompact(Number(v))}
        />
        <Tooltip
          formatter={(value, name) => [
            fmt(Number(value)),
            name === "contributed" ? "Your contributions" : "Compound growth",
          ]}
          labelFormatter={(l) => `Year ${l}`}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #ecece4",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="contributed"
          stackId="1"
          stroke="#2a3340"
          strokeWidth={1.5}
          fill="url(#contribGrad)"
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="growth"
          stackId="1"
          stroke="#13b07a"
          strokeWidth={1.5}
          fill="url(#growthGrad)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
