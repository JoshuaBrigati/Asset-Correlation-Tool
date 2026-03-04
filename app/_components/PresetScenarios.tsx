"use client";

import type { AssetOption } from "@/app/_data/assets";
import AssetIcon from "@/app/_components/AssetIcon";
import { findAsset } from "@/app/_lib/utils";
import { TYPE_COLOR } from "@/app/_lib/constants";

interface Preset {
  id: string;
  title: string;
  description: string;
  base: string;
  comparisons: string[];
  accent: string;
  icon: string;
}

const PRESETS: Preset[] = [
  {
    id: "btc-markets",
    title: "BTC vs Markets",
    description: "How does Bitcoin move relative to equities and gold?",
    base: "BTC",
    comparisons: ["ETH", "SPY", "GLD"],
    accent: TYPE_COLOR.crypto,
    icon: "₿",
  },
  {
    id: "crypto-majors",
    title: "Crypto Majors",
    description: "Do the top crypto assets move in lockstep?",
    base: "BTC",
    comparisons: ["ETH", "SOL", "XRP"],
    accent: TYPE_COLOR.trust,
    icon: "◈",
  },
  {
    id: "bitwise-funds",
    title: "Bitwise Funds",
    description: "How do Bitwise products correlate with their benchmarks?",
    base: "BITW",
    comparisons: ["BTC", "SPY", "QQQ"],
    accent: TYPE_COLOR.etf,
    icon: "◆",
  },
];

interface PresetScenariosProps {
  onSelect: (base: AssetOption, comparisons: AssetOption[]) => void;
}

export default function PresetScenarios({ onSelect }: PresetScenariosProps) {
  const handleClick = (preset: Preset) => {
    const base = findAsset(preset.base);
    const comps = preset.comparisons.map(findAsset).filter(Boolean) as AssetOption[];
    if (base && comps.length > 0) {
      onSelect(base, comps);
    }
  };

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto">
      <p className="text-xs text-muted text-center mb-3 uppercase tracking-wider font-medium">
        Quick start
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRESETS.map((preset, i) => {
          const allSymbols = [preset.base, ...preset.comparisons];
          return (
            <button
              key={preset.id}
              onClick={() => handleClick(preset)}
              className={`group text-left p-4 rounded-xl border border-edge
                         bg-card hover:border-edge-focus
                         hover:shadow-md transition-all duration-300
                         animate-fade-up-delay-${i + 1}`}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: preset.accent }}
                >
                  {preset.icon}
                </span>
                <span className="text-sm font-semibold text-fg group-hover:text-accent transition-colors">
                  {preset.title}
                </span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed mb-3">
                {preset.description}
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                {allSymbols.map((sym, i) => {
                  const asset = findAsset(sym);
                  return (
                    <span key={sym} className="inline-flex items-center shrink-0">
                      {i === 1 && (
                        <span className="text-[9px] text-muted font-medium mx-0.5">vs</span>
                      )}
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-subtle bg-input px-1 py-0.5 rounded">
                        <AssetIcon symbol={sym} type={asset?.type || "stock"} size={11} />
                        {sym}
                      </span>
                    </span>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
