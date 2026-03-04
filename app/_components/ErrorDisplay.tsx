"use client";

import type { CorrelationWarning } from "@/app/_lib/api";

interface ErrorDisplayProps {
  errors: string[];
  warnings: CorrelationWarning[];
}

export default function ErrorDisplay({ errors, warnings }: ErrorDisplayProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className="space-y-3 animate-fade-up">
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
              Error
            </span>
          </div>
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-700">
              {error}
            </p>
          ))}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Data Warnings
            </span>
          </div>
          <div className="space-y-1">
            {warnings.map((w, i) => (
              <p key={i} className="text-sm text-amber-800">
                <span className="font-medium text-amber-900">{w.symbol}</span>
                {" — "}
                {w.error === "data_missing"
                  ? "Some data may be incomplete"
                  : "Requested range exceeds available data"}{" "}
                <span className="text-amber-600">
                  ({w.startDate} → {w.endDate})
                </span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
