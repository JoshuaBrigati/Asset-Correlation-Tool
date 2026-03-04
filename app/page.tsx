"use client";

import dynamic from "next/dynamic";
import { useCorrelation } from "@/app/_hooks/useCorrelation";
import ControlsCard from "@/app/_components/ControlsCard";
import InsightCards from "@/app/_components/InsightCards";
import ErrorDisplay from "@/app/_components/ErrorDisplay";
import PageHeader from "@/app/_components/PageHeader";
import PresetScenarios from "@/app/_components/PresetScenarios";
// Lazy-load heavy charting components — Recharts is ~200KB and not needed until results arrive
const CorrelationChart = dynamic(() => import("@/app/_components/CorrelationChart"), {
  loading: () => <div className="h-[540px] rounded-2xl skeleton" />,
});
const CorrelationMatrix = dynamic(() => import("@/app/_components/CorrelationMatrix"), {
  loading: () => <div className="h-72 rounded-2xl skeleton" />,
});

export default function Home() {
  const {
    hydrated,
    controls,
    loading,
    result,
    error,
    hasResults,
    designatedSymbol,
    assetTypes,
    rollingWindow,
    highlightedSymbol,
    setHighlightedSymbol,
    handleMatrixHighlight,
    chartRef,
    handlePreset,
  } = useCorrelation();

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        <PageHeader />

        {hydrated && <ControlsCard {...controls} />}

        {error && <ErrorDisplay errors={[error]} warnings={[]} />}

        {result && (
          <div className="space-y-4">
            {(result.errors.errors.length > 0 || result.errors.warnings.length > 0) && (
              <ErrorDisplay errors={result.errors.errors} warnings={result.errors.warnings} />
            )}

            {hasResults && result.correlations && (
              <>
                <InsightCards
                  matrix={result.correlations.correlationMatrix}
                  chartData={result.correlations.correlationChart}
                  designatedSymbol={designatedSymbol}
                  assetTypes={assetTypes}
                />

                {Object.keys(result.correlations.correlationChart).length > 0 && (
                  <div ref={chartRef}>
                    <CorrelationChart
                      data={result.correlations.correlationChart}
                      designatedSymbol={designatedSymbol}
                      highlightedSymbol={highlightedSymbol}
                      onHighlightChange={setHighlightedSymbol}
                    />
                  </div>
                )}

                {result.correlations.correlationMatrix.length > 0 && (
                  <CorrelationMatrix
                    matrix={result.correlations.correlationMatrix}
                    designatedSymbol={designatedSymbol}
                    highlightedSymbol={highlightedSymbol}
                    onCellClick={handleMatrixHighlight}
                  />
                )}

                <p className="text-[10px] text-muted text-center pt-2">
                  Generated {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                  {" · "}Rolling {rollingWindow}-day window · Daily return basis · Estimates only
                </p>
              </>
            )}
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-card border border-edge flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-subtle mb-2">Select assets to get started</h3>
              <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                Choose a base asset and up to 5 comparisons, then hit Analyze to see how they move together.
              </p>
            </div>
            <PresetScenarios onSelect={handlePreset} />
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4 animate-fade-up">
            {/* Insight badges */}
            <div className="flex flex-col sm:flex-row gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl skeleton flex-1" />)}
            </div>
            {/* Key Findings */}
            <div className="h-20 rounded-xl skeleton" />
            {/* Chart (header + legend + chart area + brush) */}
            <div className="h-[540px] rounded-2xl skeleton" />
            {/* Matrix */}
            <div className="h-72 rounded-2xl skeleton" />
          </div>
        )}
      </div>
    </main>
  );
}
