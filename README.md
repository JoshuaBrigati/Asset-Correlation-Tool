# Asset Correlations Tool

A correlation visualization tool for stocks, ETFs, and crypto assets. Built as a frontend take-home for Bitwise.

**Created by Joshua Brigati**

## Setup

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # verify production build
```

No environment variables or external credentials required.

## Features

**Core**
- Select a base asset and up to 5 comparisons from 50+ supported tickers
- Rolling correlation line chart (Recharts) with gradient fills, reference zone labels, and time-range brush
- Heatmap-style correlation matrix with color-coded cells and descriptive labels
- Configurable date range (preset buttons + custom picker) and rolling window

**Interaction & Discovery**
- **Cross-component linking** — click a matrix cell to highlight that asset in the chart (and vice versa)
- **Chart legend split controls** — click an asset name to focus it, click the eye icon to hide/show it
- **Quick-start presets** — one-click scenarios (BTC vs Markets, Crypto Majors, Bitwise Funds)
- **AI-generated insights** — auto-computed Key Findings with strongest correlation, best diversifier, and volatility detection
**Polish**
- URL state persistence — shareable links that restore the full query
- Spring-easing animations with content crossfade (no layout flash on expand/collapse)
- Responsive layout for mobile through desktop
- Tailwind v4 design tokens (`@theme`) for consistent theming

## Architecture

```
app/
├── page.tsx                     # ~130 lines — pure layout, delegates to hook + components
├── loading.tsx                  # Suspense fallback skeleton (Next.js streaming)
├── error.tsx                    # Error boundary with retry (Next.js error handling)
├── _hooks/
│   ├── useCorrelation.ts        # All state management, URL sync, validation, API calls
│   └── useClickOutside.ts       # Shared dismiss-on-click-outside + Escape hook
├── _components/
│   ├── ControlsCard.tsx         # Expand/collapse controls with persistent card shell
│   ├── CorrelationChart.tsx     # Recharts ComposedChart with legend, brush, zone labels
│   ├── CorrelationMatrix.tsx    # CSS Grid heatmap with cross-highlight support
│   ├── InsightCards.tsx         # Auto-computed insight badges + Key Findings summary
│   ├── AssetPicker.tsx          # Searchable multi-select with type-colored chips
│   ├── DateRangePicker.tsx      # Preset buttons + custom range popover
│   ├── PresetScenarios.tsx      # Quick-start scenario cards
│   └── ...                      # PageHeader, AssetIcon, ErrorDisplay, RollingWindowInput
├── _lib/
│   ├── api.ts                   # API client, request/response types
│   ├── colors.ts                # Chart colors, heatmap styling, correlation labels
│   ├── constants.ts             # Shared type chip styles, hover colors
│   └── utils.ts                 # findAsset, formatDate helpers
├── _data/assets.ts              # AssetOption type, DefaultAssets, AllAssets
└── globals.css                  # @theme tokens, spring-eased keyframe animations
```

**Key decisions:**
- **Single hook pattern** — `useCorrelation()` owns all state so `page.tsx` stays ~130 lines of pure layout. Easy to test, easy to reason about.
- **No extra dependencies** — animations are pure CSS with spring cubic-beziers (`--ease-spring`). No Framer Motion, no animation library.
- **Persistent card shell** — the ControlsCard renders one `<div>` that never unmounts. Expand/collapse swaps inner content with a quick crossfade instead of re-animating the entire card.
- **URL-first state** — on mount, the hook checks URL params and auto-submits if present. A `hydrated` flag prevents flash of empty controls.
- **Lazy-loaded charts** — `CorrelationChart` and `CorrelationMatrix` use `next/dynamic` since Recharts is ~200KB and not needed until results arrive. Skeleton placeholders show during load.

## What I'd Do With More Time

- **Export & sharing** — CSV download of correlation matrix, copyable shareable links with encoded state
- **Keyboard shortcuts** — `/` to focus asset search, `Esc` to collapse controls, arrow-key matrix navigation
- **Dark mode** — the `@theme` token system is already set up for it, just needs a second set of values
- **Annotation system** — let users pin notes to specific dates on the chart ("BTC halving", "Fed rate cut")
- **Comparison snapshots** — save and compare multiple correlation runs side by side
- **Server-side caching** — cache API responses by param hash to speed up repeat queries
- **E2E tests** — Playwright tests for the core flow (select assets → analyze → verify chart renders)
- **Accessibility audit** — full keyboard nav for matrix cells, ARIA live regions for loading states
