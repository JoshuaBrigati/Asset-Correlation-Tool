"use client";

import { useMemo } from "react";
import { heatmapStyle } from "@/app/_lib/colors";

interface CorrelationMatrixProps {
  matrix: Array<Record<string, number>>;
  designatedSymbol: string;
  highlightedSymbol?: string | null;
  onCellClick?: (symbol: string) => void;
}

export default function CorrelationMatrix({
  matrix,
  designatedSymbol,
  highlightedSymbol,
  onCellClick,
}: CorrelationMatrixProps) {
  const { symbols, grid } = useMemo(() => {
    if (!matrix.length) return { symbols: [], grid: [] };
    const symbols = Object.keys(matrix[0]);
    const grid = symbols.map((rowSymbol) => {
      const row = matrix.find((r) => r[rowSymbol] === 1);
      return symbols.map((colSymbol) => (row ? row[colSymbol] ?? 0 : 0));
    });
    return { symbols, grid };
  }, [matrix]);

  if (symbols.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 border border-edge shadow-sm animate-fade-up-delay-2">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-fg">
              Correlation Matrix
            </h3>
            <p className="text-xs text-muted mt-0.5">
              How closely each pair of assets moved together over the full period.
              Values range from −1 (always opposite) to +1 (always together).
            </p>
          </div>
          {onCellClick && (
            <p className="text-[10px] text-muted italic">
              Click a cell to focus that asset in the chart
            </p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <div className="inline-block min-w-full px-2">
          <div className="grid gap-1" style={{
            gridTemplateColumns: `80px repeat(${symbols.length}, 1fr)`,
          }}>
            {/* Header row */}
            <div />
            {symbols.map((symbol) => {
              const isActive = highlightedSymbol === symbol;
              return (
                <div
                  key={`h-${symbol}`}
                  className={`text-center py-2 text-[11px] font-semibold transition-colors
                    ${isActive ? "text-accent" : "text-subtle"}`}
                >
                  {symbol}
                </div>
              );
            })}

            {/* Data rows */}
            {symbols.map((rowSymbol, rowIdx) => {
              const isRowActive = highlightedSymbol === rowSymbol;
              return (
                <div key={`row-${rowSymbol}`} className="contents">
                  <div
                    className={`flex items-center justify-end pr-3 text-[11px] font-semibold transition-colors
                      ${isRowActive ? "text-accent" : "text-subtle"}`}
                  >
                    {rowSymbol}
                  </div>
                  {grid[rowIdx].map((value, colIdx) => {
                    const colSymbol = symbols[colIdx];
                    const isSelf = rowIdx === colIdx;
                    const style = heatmapStyle(value);
                    const involves = rowSymbol === highlightedSymbol || colSymbol === highlightedSymbol;
                    const isDimmed = highlightedSymbol && !involves && !isSelf;
                    const isClickable = !isSelf && onCellClick;
                    return (
                      <div
                        key={`${rowSymbol}-${colSymbol}`}
                        className={`rounded-xl flex flex-col items-center justify-center py-3 px-1
                                   transition-all duration-300 group relative
                                   ${isDimmed ? "opacity-30" : ""}
                                   ${involves ? "ring-1 ring-accent/30 scale-[1.02]" : "hover:scale-[1.04]"}
                                   ${isClickable ? "cursor-pointer" : "cursor-default"}`}
                        style={{ backgroundColor: style.bg }}
                        title={`${rowSymbol} ↔ ${colSymbol}: ${value.toFixed(6)}`}
                        onClick={() => {
                          if (!isSelf && onCellClick) {
                            // Highlight the non-designated symbol from this pair
                            const target = rowSymbol === designatedSymbol ? colSymbol : rowSymbol;
                            onCellClick(target);
                          }
                        }}
                      >
                        {isSelf ? (
                          <span className="text-xs text-muted">—</span>
                        ) : (
                          <>
                            <span
                              className="text-sm font-mono font-semibold tabular-nums"
                              style={{ color: style.text }}
                            >
                              {value >= 0 ? "+" : ""}{value.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-muted mt-0.5">
                              {style.label}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="w-4 h-2 rounded-sm bg-blue-400/20" />
            <div className="w-4 h-2 rounded-sm bg-blue-400/10" />
          </div>
          <span className="text-[10px] text-muted">Inverse (−1)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 rounded-sm bg-input" />
          <span className="text-[10px] text-muted">Neutral (0)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="w-4 h-2 rounded-sm bg-red-400/10" />
            <div className="w-4 h-2 rounded-sm bg-red-400/20" />
          </div>
          <span className="text-[10px] text-muted">Correlated (+1)</span>
        </div>
      </div>
    </div>
  );
}
