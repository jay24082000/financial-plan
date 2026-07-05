"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCurrency } from "@/components/CurrencyProvider";

export interface ProjectionPoint {
  age: number;
  balance: number;
}

export function ProjectionChart({
  data,
  target,
  height = 280,
}: {
  data: ProjectionPoint[];
  target?: number;
  height?: number;
}) {
  const { fmt, fmtCompact } = useCurrency();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="projgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#13b07a" stopOpacity={0.18} />
            <stop offset="1" stopColor="#13b07a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#eeeee7" />
        <XAxis
          dataKey="age"
          tick={{ fontSize: 11, fill: "#9aa0a8" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tickFormatter={(v) => `${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9aa0a8" }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => fmtCompact(Number(v))}
        />
        <Tooltip
          formatter={(value) => [fmt(Number(value)), "Balance"]}
          labelFormatter={(l) => `Age ${l}`}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #ecece4",
            fontSize: 12,
          }}
        />
        {target !== undefined && target > 0 && (
          <ReferenceLine
            y={target}
            stroke="#d29b26"
            strokeDasharray="5 5"
            strokeWidth={1.4}
          />
        )}
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#13b07a"
          strokeWidth={2.4}
          fill="url(#projgrad)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
