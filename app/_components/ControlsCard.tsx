"use client";

import type { AssetType } from "@/app/_data/assets";
import type { CorrelationControls } from "@/app/_hooks/useCorrelation";
import AssetPicker from "@/app/_components/AssetPicker";
import AssetIcon from "@/app/_components/AssetIcon";
import DateRangePicker from "@/app/_components/DateRangePicker";
import RollingWindowInput from "@/app/_components/RollingWindowInput";
import { TYPE_CHIP_STYLE, TYPE_LABEL } from "@/app/_lib/constants";

function rangeSummary(start: string, end: string): string {
  const months =
    (new Date(end).getFullYear() - new Date(start).getFullYear()) * 12 +
    (new Date(end).getMonth() - new Date(start).getMonth());
  if (months <= 7) return "6M";
  if (months <= 14) return "1Y";
  if (months <= 30) return "2Y";
  if (months <= 42) return "3Y";
  return "5Y";
}

const LEGEND_TYPES: AssetType[] = ["crypto", "etf", "stock", "trust"];

export default function ControlsCard({
  designated,
  comparisons,
  startDate,
  endDate,
  rollingWindow,
  minDate,
  expanded,
  loading,
  result,
  validation,
  onDesignatedChange,
  onComparisonsChange,
  onStartDateChange,
  onEndDateChange,
  onRollingWindowChange,
  onExpandedChange,
  onSubmit,
}: CorrelationControls) {
  return (
    <>
      {/* Type legend */}
      <div className="hidden sm:flex items-center justify-end gap-3">
        {LEGEND_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <span className={`w-5 h-3 rounded-md border ${TYPE_CHIP_STYLE[type]}`} />
            <span className="text-xs text-muted">{TYPE_LABEL[type]}</span>
          </div>
        ))}
      </div>

      {/* Controls card — single persistent shell, content crossfades */}
      <div className="relative z-10">
        {(expanded || result || loading) && (
          <div className="bg-card border border-edge rounded-xl transition-[border-color] duration-300
                          animate-fade-up">

            {/* Collapsed summary */}
            {!expanded && (result || loading) ? (
              <button
                onClick={() => onExpandedChange(true)}
                className="w-full flex items-center gap-4 px-4 sm:px-6 py-4 sm:py-5
                           hover:bg-input/20 transition-colors group animate-content-fade"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 flex-wrap">
                  <span className="text-xs font-semibold text-subtle uppercase tracking-[0.08em] shrink-0">Compare</span>
                  <div className="flex items-center gap-2">
                    {designated.map((a) => (
                      <span
                        key={a.value}
                        className={`inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-lg border text-sm font-bold text-fg ${TYPE_CHIP_STYLE[a.type]}`}
                      >
                        <AssetIcon symbol={a.value} type={a.type} size={22} />
                        {a.value}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-subtle uppercase tracking-[0.08em]">Against</span>
                  <div className="flex items-center gap-1.5">
                    {comparisons.map((a) => (
                      <span
                        key={a.value}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-sm font-semibold text-fg ${TYPE_CHIP_STYLE[a.type]}`}
                      >
                        <AssetIcon symbol={a.value} type={a.type} size={18} />
                        {a.value}
                      </span>
                    ))}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
                    <span className="text-muted font-medium">over</span>
                    <span className="px-2.5 py-1 rounded-md bg-accent/10 text-xs font-semibold text-accent">
                      {rangeSummary(startDate, endDate)}
                    </span>
                    <span>·</span>
                    <span className="px-2.5 py-1 rounded-md bg-accent/10 text-xs font-semibold text-accent">
                      {rollingWindow}d
                    </span>
                    <span className="text-muted font-medium">window</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-muted group-hover:text-accent transition-colors">
                  <span className="text-xs font-medium">Edit</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                </div>
              </button>
            ) : expanded ? (
              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 animate-content-fade">
                {/* Row 1: Assets */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-semibold text-subtle uppercase tracking-[0.06em] shrink-0">Compare</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-7 rounded-full bg-accent" />
                    <AssetPicker
                      label=""
                      selected={designated}
                      onChange={onDesignatedChange}
                      max={1}
                      single
                      exclude={comparisons.map((c) => c.value)}
                    />
                  </div>

                  <span className="text-xs font-semibold text-subtle uppercase tracking-[0.06em]">Against</span>

              <AssetPicker
                label=""
                selected={comparisons}
                onChange={onComparisonsChange}
                max={5}
                exclude={designated.map((d) => d.value)}
              />
                </div>

                {/* Divider */}
                <div className="border-t border-edge" />

                {/* Row 2: Settings + Analyze */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold text-subtle uppercase tracking-[0.06em]">Range</span>
                      <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={onStartDateChange}
                        onEndChange={onEndDateChange}
                        minDate={minDate}
                      />
                    </div>

                    <div className="w-px h-7 bg-edge" />

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold text-subtle uppercase tracking-[0.06em]">Window</span>
                      <RollingWindowInput value={rollingWindow} onChange={onRollingWindowChange} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!validation.ok && validation.msg && (
                      <span className="text-xs text-muted">{validation.msg}</span>
                    )}
                    {result && (
                      <button
                        onClick={() => onExpandedChange(false)}
                        className="px-5 py-2.5 text-sm font-medium rounded-lg text-muted
                                   hover:text-subtle hover:bg-input transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={onSubmit}
                      disabled={!validation.ok || loading}
                      className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all
                                 bg-accent text-white hover:bg-accent-hover
                                 disabled:bg-input disabled:text-muted disabled:cursor-not-allowed
                                 inline-flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Computing...
                        </>
                      ) : result ? "Update" : "Analyze"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

          </div>
        )}
      </div>
    </>
  );
}
