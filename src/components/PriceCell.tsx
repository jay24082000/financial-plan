"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrency } from "@/components/CurrencyProvider";

export function PriceCell({ price }: { price: number }) {
  const { fmtPrice } = useCurrency();
  const prev = useRef(price);
  const [flash, setFlash] = useState<"" | "flash-up" | "flash-down">("");

  useEffect(() => {
    if (price > prev.current) setFlash("flash-up");
    else if (price < prev.current) setFlash("flash-down");
    prev.current = price;
    const t = setTimeout(() => setFlash(""), 600);
    return () => clearTimeout(t);
  }, [price]);

  return (
    <span className={`mer-num rounded-sm px-1.5 py-0.5 font-semibold ${flash}`}>
      {isFinite(price) ? fmtPrice(price) : "—"}
    </span>
  );
}
