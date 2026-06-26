"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

export function NetWorthChart({
  data,
  height = 180,
}: {
  data: { i: number; value: number }[];
  height?: number;
}) {
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="pfgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#13b07a" stopOpacity={0.16} />
            <stop offset="1" stopColor="#13b07a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={[min * 0.97, max * 1.02]} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#13b07a"
          strokeWidth={2.2}
          fill="url(#pfgrad)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
