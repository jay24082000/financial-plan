"use client";

import { useEffect, useRef, useState } from "react";

export interface LivePrice {
  price: number;
  changePercent: number;
  updatedAt: number;
}

interface BinanceTicker {
  s: string;
  c: string;
  P: string;
}

interface CombinedMessage {
  stream: string;
  data: BinanceTicker;
}

/**
 * @param symbols uppercase Binance symbols, e.g. ["BTCUSDT", "ETHUSDT"]
 * @returns map of symbol -> { price, changePercent, updatedAt } and connection state
 */
export function useBinancePrices(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, LivePrice>>({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = symbols.join(",");

  useEffect(() => {
    if (symbols.length === 0) return;
    let closedByUs = false;

    const connect = () => {
      const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
      const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as CombinedMessage;
          const t = msg.data;
          if (!t || !t.s) return;
          setPrices((prev) => ({
            ...prev,
            [t.s]: {
              price: parseFloat(t.c),
              changePercent: parseFloat(t.P),
              updatedAt: Date.now(),
            },
          }));
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        if (!closedByUs) {
          reconnectRef.current = setTimeout(connect, 2500);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      closedByUs = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [key]);

  return { prices, connected };
}
