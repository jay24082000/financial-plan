# Stax — Financial Planning Web App

Stax helps young earners see their whole financial picture, know if they're on
track to retire, and grow their money with confidence — retirement projections,
compound-interest calculators, realtime market prices (crypto, US stocks, gold,
FX), and a portfolio tracker with live profit & loss.

## Features

- **Landing page** — public marketing page; shows your profile + "Go to dashboard" when signed in
- **Auth** — email/password + Google OAuth, password reset (Supabase)
- **Onboarding** — a friendly multi-step survey (age, income, savings, goals, risk) that personalizes your plan
- **Dashboard** — net worth, gain/loss, allocation, top holdings, live movers, real net-worth history (daily snapshots)
- **Retirement** — projects your savings and shows whether you're on track (funded %), prefilled from your profile
- **Calculator** — compound growth, split into contributions vs. growth
- **Markets** — realtime prices with sparklines (crypto / stocks / gold / FX)
- **Portfolio** — holdings with live P/L, add / edit / delete, stored per-user
- **Profile & Settings** — edit your financial profile, change email/password, notifications
- **Currency** — switch USD ⇄ THB app-wide using the live USD/THB rate

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** (Radix primitives)
- **Supabase** — auth + Postgres (Row Level Security), data stored per user
- **Recharts 3** — charts
- **lucide-react** — icons

## Realtime data (free, no API key required)

| Asset              | Source                     | Method                                |
| ------------------ | -------------------------- | ------------------------------------- |
| Crypto             | Binance public WebSocket   | live stream                           |
| Stocks / Gold / FX | Yahoo Finance (`v8/chart`) | Next API route (`/api/quote`), polled |

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure Supabase

Create a project at [supabase.com](https://supabase.com), then create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Create the database tables

In Supabase → **SQL Editor**, run the contents of [`supabase/schema.sql`](supabase/schema.sql)
(creates `holdings`, `portfolio_snapshots`, and `profiles` with Row Level Security).

### 4. (Optional) Enable Google login

- Supabase → Authentication → Providers → **Google** → add Client ID/Secret from Google Cloud Console
- Google OAuth redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
- Supabase → Authentication → URL Configuration → add `http://localhost:3000/**`

> For quick local testing, turn off "Confirm email" (Authentication → Providers → Email), or add a
> user via Authentication → Users with "Auto Confirm".

### 5. Run

```bash
npm run dev
# open http://localhost:3000
```

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint

## Project structure

```
src/
  app/            # routes: landing, login, onboarding, dashboard, retirement,
                  # calculator, markets, portfolio, profile, settings, api/quote
  components/     # UI: PillNav, cards, charts, Fields (currency-aware inputs),
                  # CurrencyProvider, ui/ (shadcn)
  hooks/          # useHoldings, useProfile, useSnapshots, useBinancePrices,
                  # useQuotes, useAllPrices, useUser, useMounted
  lib/            # finance math, formatters, profile config, supabase clients
  proxy.ts        # auth middleware (route protection + onboarding gate)
supabase/schema.sql
```

## Notes

- All amounts are stored internally in **USD** and converted for display via the live rate.
- Net-worth history builds up over time (one snapshot per day), so the chart fills in as you return.
- Supabase free projects **auto-pause** after inactivity — click _Restore_ in the dashboard if the app can't reach it.

## Disclaimer

Stax provides **estimates for educational purposes only** — not financial or
investment advice. Market data may be delayed (especially outside trading hours).
