# Meridian — Financial Planning Web App

Personal finance planning: retirement projections, compound-interest and
investment calculators, realtime market prices (crypto, US stocks, gold, FX),
and a portfolio tracker with live profit & loss.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3** — styling
- **Recharts 3** — charts
- **Zustand** (+persist) — portfolio state (localStorage)
- **lucide-react** — icons

## Realtime data (free, no API key required)

| Asset              | Source                     | Method                                |
| ------------------ | -------------------------- | ------------------------------------- |
| Crypto             | Binance public WebSocket   | live stream                           |
| Stocks / Gold / FX | Yahoo Finance (`v8/chart`) | Next API route (`/api/quote`), polled |

## Pages

- **Dashboard** — net worth, total gain/loss, allocation, top holdings, today's movers
- **Retirement** — projects your savings and shows whether you're on track (funded %)
- **Calculator** — compound interest, split into contributions vs. growth
- **Markets** — realtime prices (crypto / stocks / gold / FX)
- **Portfolio** — holdings with live P/L, add/remove, persisted to localStorage

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint

## Disclaimer

Meridian provides **estimates for educational purposes only** — not financial or
investment advice. Market data may be delayed (especially outside trading hours).
