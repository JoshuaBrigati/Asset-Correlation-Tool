"use client";

import { useState, useMemo } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Brush,
  Label,
} from "recharts";
import { CHART_COLORS, corrLabel } from "@/app/_lib/colors";

interface CorrelationChartProps {
  data: Record<string, Array<[number, number]>>;
  designatedSymbol: string;
  highlightedSymbol?: string | null;
  onHighlightChange?: (symbol: string | null) => void;
}

interface ChartDataPoint {
  date: number;
  [symbol: string]: number;
}

function formatTick(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function formatFull(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CorrelationChart({
  data,
  designatedSymbol,
  highlightedSymbol,
  onHighlightChange,
}: CorrelationChartProps) {
  const symbols = Object.keys(data);
  const [hiddenSymbols, setHiddenSymbols] = useState<Set<string>>(new Set());

  const chartData = useMemo(() => {
    const dateMap = new Map<number, ChartDataPoint>();
    for (const [symbol, points] of Object.entries(data)) {
      for (const [timestamp, value] of points) {
        if (!dateMap.has(timestamp)) dateMap.set(timestamp, { date: timestamp });
        dateMap.get(timestamp)![symbol] = value;
      }
    }
    return Array.from(dateMap.values()).sort((a, b) => a.date - b.date);
  }, [data]);

  const toggleSymbol = (symbol: string) => {
    setHiddenSymbols((prev) => {
      const next = new Set(prev);
      next.has(symbol) ? next.delete(symbol) : next.add(symbol);
      return next;
    });
  };

  const latestValues = useMemo(() => {
    if (chartData.length === 0) return {};
    const last = chartData[chartData.length - 1];
    const result: Record<string, number> = {};
    for (const s of symbols) {
      if (last[s] !== undefined) result[s] = last[s];
    }
    return result;
  }, [chartData, symbols]);

  if (chartData.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 border border-edge shadow-sm animate-fade-up-delay-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
        <div>
          <h3 className="text-base font-semibold text-fg">
            Rolling Correlation
          </h3>
          <p className="text-xs text-muted mt-0.5">
            How each asset&apos;s daily returns track with {designatedSymbol} over time
          </p>
        </div>
        <p className="text-[10px] text-muted italic shrink-0">
          Click an asset to focus · eye icon to hide
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 my-4">
        {symbols.map((symbol, i) => {
          const color = CHART_COLORS[i % CHART_COLORS.length];
          const isHidden = hiddenSymbols.has(symbol);
          const isHighlighted = highlightedSymbol === symbol;
          const isDimmed = highlightedSymbol && !isHighlighted;
          const val = latestValues[symbol];
          return (
            <div
              key={symbol}
              className={`flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-lg border transition-all duration-300
                ${isHidden
                  ? "opacity-40 border-transparent"
                  : isHighlighted
                    ? "border-accent bg-accent-subtle ring-1 ring-accent/20"
                    : isDimmed
                      ? "opacity-40 border-transparent"
                      : "bg-input/50 border-edge hover:border-edge-focus"
                }`}
            >
              {/* Clickable area: focus/highlight (or unhide if hidden) */}
              <button
                onClick={() => isHidden ? toggleSymbol(symbol) : onHighlightChange?.(isHighlighted ? null : symbol)}
                title={isHidden ? `Show ${symbol}` : isHighlighted ? `Clear focus` : `Focus ${symbol}`}
                className="flex items-center gap-2"
              >
                <span
                  className="w-3 h-1 rounded-full"
                  style={{ backgroundColor: isHidden ? "var(--color-muted)" : color }}
                />
                <span className={`text-xs font-semibold ${isHidden ? "text-muted" : "text-fg"}`}>
                  {symbol}
                </span>
                {val !== undefined && !isHidden && (
                  <span className="text-[11px] font-mono font-medium" style={{ color }}>
                    {val >= 0 ? "+" : ""}{val.toFixed(2)}
                  </span>
                )}
                {val !== undefined && !isHidden && (
                  <span className="text-[10px] text-muted px-1.5 py-0.5 rounded bg-input">
                    {corrLabel(val)}
                  </span>
                )}
              </button>
              {/* Eye icon: hide/show */}
              <button
                onClick={() => toggleSymbol(symbol)}
                title={isHidden ? `Show ${symbol}` : `Hide ${symbol}`}
                className="p-1 rounded-md hover:bg-black/5 transition-colors"
              >
                {isHidden ? (
                  <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
        {highlightedSymbol && (
          <button
            onClick={() => onHighlightChange?.(null)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium
                       text-muted hover:text-subtle transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear focus
          </button>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={chartData}>
          <defs>
            {symbols.map((symbol, i) => (
              <linearGradient key={`g-${symbol}`} id={`g-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.1} />
                <stop offset="100%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />

          <XAxis
            dataKey="date"
            tickFormatter={formatTick}
            stroke="var(--color-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[-1, 1]}
            ticks={[-1, -0.5, 0, 0.5, 1]}
            stroke="var(--color-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={32}
            tickFormatter={(v) => v.toFixed(1)}
          />

          <Tooltip
            labelFormatter={(label) => formatFull(Number(label))}
            formatter={(value, name) => {
              const v = Number(value);
              return [`${v >= 0 ? "+" : ""}${v.toFixed(4)} — ${corrLabel(v)}`, String(name)];
            }}
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-edge)",
              borderRadius: "12px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              fontSize: "12px",
              color: "var(--color-fg)",
              padding: "12px 16px",
            }}
            labelStyle={{ color: "var(--color-subtle)", marginBottom: "6px", fontSize: "11px" }}
          />

          {/* Zone indicators */}
          <ReferenceLine y={0} stroke="rgba(0,0,0,0.12)" />
          <ReferenceLine y={0.7} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 8">
            <Label value="Strong" position="right" fontSize={9} fill="var(--color-muted)" />
          </ReferenceLine>
          <ReferenceLine y={-0.7} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 8">
            <Label value="Inverse" position="right" fontSize={9} fill="var(--color-muted)" />
          </ReferenceLine>

          {/* Gradient fills (hidden from tooltip via legendType/tooltipType) */}
          {symbols.map((symbol) => (
            <Area
              key={`a-${symbol}`}
              type="monotone"
              dataKey={symbol}
              fill={`url(#g-${symbol})`}
              stroke="none"
              hide={hiddenSymbols.has(symbol)}
              connectNulls
              isAnimationActive={false}
              tooltipType="none"
              legendType="none"
            />
          ))}

          {/* Lines */}
          {symbols.map((symbol, i) => {
            const color = CHART_COLORS[i % CHART_COLORS.length];
            const isDimmed = highlightedSymbol && highlightedSymbol !== symbol;
            return (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={color}
                strokeWidth={highlightedSymbol === symbol ? 2.5 : 1.5}
                strokeOpacity={isDimmed ? 0.15 : 1}
                dot={false}
                hide={hiddenSymbols.has(symbol)}
                connectNulls
                name={symbol}
                activeDot={{ r: 3, fill: color, stroke: "#ffffff", strokeWidth: 2 }}
              />
            );
          })}

          {/* Time-range brush */}
          <Brush
            dataKey="date"
            height={28}
            stroke="var(--color-edge)"
            fill="var(--color-input)"
            tickFormatter={formatTick}
            travellerWidth={8}
          />
        </ComposedChart>
      </ResponsiveContainer>

    </div>
  );
}
