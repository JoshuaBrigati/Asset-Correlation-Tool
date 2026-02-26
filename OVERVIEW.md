# Correlation Tool — Project Overview

## Goal

A self-contained Next.js app that serves as a frontend take-home assignment for engineering candidates. The backend (data fetching, correlation math) is fully scaffolded so candidates can focus entirely on building a polished, functional UI.

Candidates receive this repo, run `npm install && npm run dev`, and build a frontend against a working `POST /api/correlation` endpoint — no backend access, credentials, or internal infrastructure required.

## Current Status

**Complete.** The backend is fully functional and the repo is ready to send to candidates.

What's built:

- `POST /api/correlation` — the full correlation engine, ported from the internal Express server and adapted for Next.js App Router
- Stock/ETF price history via Yahoo Finance (any ticker)
- Crypto and stock/ETF price history via Yahoo Finance (no API key required)
- Pearson correlation: rolling chart series and full NxN matrix
- TypeScript types exported for candidates to use
- `app/_data/assets.ts` — `AllAssets` and `DefaultAssets` arrays with the `AssetOption` interface
- `README.md` with full API docs, supported symbols, experience requirements, and helper utilities
- A working reference UI in `app/page.tsx` — candidates use this as a starting point

What candidates build:

- Their own UI in `app/page.tsx` — replacing or extending the reference implementation with components, styling, charting, etc.

## Key Decisions

- **Bitwise fund symbols (BITW, BITQ, BWEB)** are supported as regular stock tickers via Yahoo Finance. The internal `BitwiseFund` compare type has been removed — candidates pass them in `stockSymbols`.
- **Crypto data source** replaced from internal MongoDB with CoinGecko's free public API. No authentication needed; rate limits are generous enough for dev/interview use.
- **No environment variables** are required. The app runs immediately after `npm install`.
- The scaffolded backend (`app/_core/`, `app/api/`) is noted in the README as code candidates don't need to touch, but is not hard off-limits.

## Project Structure

```
/
├── app/
│   ├── _core/                 # Scaffolded backend — candidates don't need to touch
│   │   ├── CorrelationCalculator.ts
│   │   ├── correlationTypes.ts
│   │   ├── CryptoHistoryFetcher.ts
│   │   ├── MarketDataValidator.ts
│   │   ├── StockHistoryFetcher.ts
│   │   ├── dayjsHelper.ts
│   │   ├── yahooFinance.ts
│   │   └── getCorrelations.ts
│   ├── _data/
│   │   └── assets.ts          # AllAssets and DefaultAssets arrays
│   ├── _types/
│   │   └── statistics.js.d.ts
│   ├── api/
│   │   └── correlation/
│   │       └── route.ts       # POST /api/correlation
│   ├── globals.css            # Tailwind v4 + base styles
│   ├── layout.tsx
│   └── page.tsx               # Candidate starting point
├── postcss.config.mjs
└── README.md                  # Candidate-facing instructions
```

## Running Locally

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # verify production build
```

## Source

Ported from `POST /tools/correlation` in the internal `server` repo (`src/server/app.ts:1287`).
