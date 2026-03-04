"use client";

import { useState, useRef, useCallback } from "react";
import { formatDate } from "@/app/_lib/utils";
import { useClickOutside } from "@/app/_hooks/useClickOutside";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  minDate?: string;
}

const PRESETS = [
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "2Y", months: 24 },
  { label: "3Y", months: 36 },
  { label: "5Y", months: 60 },
] as const;

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  minDate,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = formatDate(new Date());

  useClickOutside(containerRef, useCallback(() => setOpen(false), []));

  const handlePreset = (months: number) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    onStartChange(minDate && formatDate(start) < minDate ? minDate : formatDate(start));
    onEndChange(formatDate(end));
  };

  const activePreset = PRESETS.find(({ months }) => {
    const diff =
      (new Date(endDate).getFullYear() - new Date(startDate).getFullYear()) * 12 +
      (new Date(endDate).getMonth() - new Date(startDate).getMonth());
    return Math.abs(diff - months) <= 1;
  });

  return (
    <div ref={containerRef} className="relative flex items-center">
      <div className="flex items-center bg-input rounded-lg p-0.5">
        {PRESETS.map(({ label, months }) => (
          <button
            key={label}
            onClick={() => handlePreset(months)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
              ${
                activePreset?.label === label
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted hover:text-subtle"
              }`}
          >
            {label}
          </button>
        ))}

        {/* Custom date trigger */}
        <button
          onClick={() => setOpen(!open)}
          className={`px-2 py-1.5 rounded-md transition-all ml-0.5
            ${
              !activePreset
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-subtle"
            }`}
          title="Custom date range"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </button>
      </div>

      {/* Custom date popover */}
      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 rounded-xl bg-card border border-edge
                        shadow-xl shadow-black/8 p-4 w-[22rem] overflow-hidden animate-pop-in origin-top">
          <div className="text-[10px] font-medium text-muted uppercase tracking-wider mb-3">
            Custom Range
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[11px] text-muted mb-1 block">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartChange(e.target.value)}
                min={minDate}
                max={endDate}
                className="w-full px-3 py-2 text-sm rounded-lg bg-input border border-edge
                           text-fg focus:outline-none focus:border-edge-focus transition-all"
              />
            </div>
            <svg className="w-4 h-4 text-muted shrink-0 mt-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <div className="flex-1">
              <label className="text-[11px] text-muted mb-1 block">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndChange(e.target.value)}
                min={startDate}
                max={today}
                className="w-full px-3 py-2 text-sm rounded-lg bg-input border border-edge
                           text-fg focus:outline-none focus:border-edge-focus transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
