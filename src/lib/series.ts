export function sparkFromChange(changePercent: number, points = 14): number[] {
  const dir = changePercent >= 0 ? 1 : -1;
  const mag = Math.min(0.5, Math.abs(changePercent) / 100 + 0.06);
  const out: number[] = [];
  let v = 1;
  for (let i = 0; i < points; i++) {
    const trend = (dir * mag * i) / points;
    const wave = Math.sin(i * 0.9) * mag * 0.35;
    out.push(v + trend + wave);
  }
  return out;
}

export function buildHistory(
  endValue: number,
  points: number,
  volatility = 0.012,
  drift = 0.0035,
): { i: number; value: number }[] {
  if (endValue <= 0) {
    return Array.from({ length: points }, (_, i) => ({ i, value: 0 }));
  }
  const raw: number[] = [];
  let v = 1;
  for (let i = 0; i < points; i++) {
    const wave =
      Math.sin(i * 0.6) * volatility + Math.sin(i * 0.21) * volatility * 0.7;
    v = v * (1 + drift) + wave;
    raw.push(v);
  }
  const last = raw[raw.length - 1];
  const scale = endValue / last;
  return raw.map((value, i) => ({ i, value: value * scale }));
}
