"use client";

import { useMemo } from "react";
import AssetIcon from "@/app/_components/AssetIcon";

interface InsightCardsProps {
  matrix: Array<Record<string, number>>;
  chartData: Record<string, Array<[number, number]>>;
  designatedSymbol: string;
  assetTypes?: Record<string, string>;
}

interface Insight {
  label: string;
  symbol: string;
  symbolType: string;
  value: number;
  formatted: string;
  color: string;
  bg: string;
  border: string;
}

export default function InsightCards({
  matrix,
  chartData,
  designatedSymbol,
  assetTypes = {},
}: InsightCardsProps) {
  const insights = useMemo(() => {
    const results: Insight[] = [];
    if (!matrix.length) return results;

    const symbols = Object.keys(matrix[0]).filter((s) => s !== designatedSymbol);
    const row = matrix.find((r) => r[designatedSymbol] === 1);
    if (!row) return results;

    let maxCorr = -2, minCorr = 2, maxSym = "", minSym = "";
    for (const s of symbols) {
      const v = row[s] ?? 0;
      if (v > maxCorr) { maxCorr = v; maxSym = s; }
      if (v < minCorr) { minCorr = v; minSym = s; }
    }

    if (maxSym) {
      results.push({
        label: "Strongest",
        symbol: maxSym,
        symbolType: assetTypes[maxSym] || "stock",
        value: maxCorr,
        formatted: `${maxCorr >= 0 ? "+" : ""}${maxCorr.toFixed(2)}`,
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-100",
      });
    }

    if (minSym && minSym !== maxSym) {
      results.push({
        label: minCorr < 0 ? "Diversifier" : "Independent",
        symbol: minSym,
        symbolType: assetTypes[minSym] || "stock",
        value: minCorr,
        formatted: `${minCorr >= 0 ? "+" : ""}${minCorr.toFixed(2)}`,
        color: minCorr < 0 ? "text-blue-500" : "text-emerald-500",
        bg: minCorr < 0 ? "bg-blue-50" : "bg-emerald-50",
        border: minCorr < 0 ? "border-blue-100" : "border-emerald-100",
      });
    }

    // Find most volatile correlation (shifting relationship)
    let volSym = "";
    let volStd = 0;
    for (const s of symbols) {
      const pts = chartData[s];
      if (!pts || pts.length < 20) continue;
      const vals = pts.map((p) => p[1]);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const std = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);
      if (std > 0.15 && std > volStd) {
        volStd = std;
        volSym = s;
      }
    }
    if (volSym) {
      results.push({
        label: "Unstable",
        symbol: volSym,
        symbolType: assetTypes[volSym] || "stock",
        value: volStd,
        formatted: `σ ${volStd.toFixed(2)}`,
        color: "text-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-100",
      });
    }

    return results;
  }, [matrix, chartData, designatedSymbol, assetTypes]);

  if (insights.length === 0) return null;

  const strongest = insights.find((i) => i.label === "Strongest");
  const diversifier = insights.find((i) => i.label === "Diversifier" || i.label === "Independent");
  const unstable = insights.find((i) => i.label === "Unstable");

  return (
    <div className="space-y-3 animate-fade-up">
      {/* Compact stat badges */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {insights.map((insight) => (
          <div
            key={insight.label}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${insight.border} ${insight.bg} flex-1`}
          >
            <AssetIcon symbol={insight.symbol} type={insight.symbolType} size={24} />
            <div className="min-w-0">
              <div className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                {insight.label}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-fg">{insight.symbol}</span>
                <span className={`text-sm font-mono font-semibold ${insight.color}`}>
                  {insight.formatted}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Readable summary */}
      <div className="px-4 py-3 rounded-xl bg-card border border-edge">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 rounded-full bg-accent" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Key Findings
          </span>
        </div>
        <p className="text-[13px] text-subtle leading-relaxed">
          {strongest && (
            <>
              <span className="inline-flex items-center gap-1 align-middle">
                <AssetIcon symbol={strongest.symbol} type={strongest.symbolType} size={15} />
                <strong className="text-fg">{strongest.symbol}</strong>
              </span>
              {" "}tracks {designatedSymbol} most closely at{" "}
              <span className="font-mono font-semibold text-red-500">{strongest.formatted}</span>.
            </>
          )}
          {diversifier && (
            <>
              {" "}
              <span className="inline-flex items-center gap-1 align-middle">
                <AssetIcon symbol={diversifier.symbol} type={diversifier.symbolType} size={15} />
                <strong className="text-fg">{diversifier.symbol}</strong>
              </span>
              {diversifier.value < 0
                ? <> offers the best diversification at{" "}
                    <span className="font-mono font-semibold text-blue-500">{diversifier.formatted}</span>
                    {" — "}useful for hedging.</>
                : <> shows the most independence at{" "}
                    <span className="font-mono font-semibold text-emerald-500">{diversifier.formatted}</span>.</>
              }
            </>
          )}
          {unstable && (
            <>
              {" "}The{" "}
              <span className="inline-flex items-center gap-1 align-middle">
                <AssetIcon symbol={unstable.symbol} type={unstable.symbolType} size={15} />
                <strong className="text-fg">{unstable.symbol}</strong>
              </span>
              {" "}relationship shifts significantly over time{" "}
              <span className="text-muted">({unstable.formatted})</span>,
              so recent correlation may not reflect the longer trend.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
