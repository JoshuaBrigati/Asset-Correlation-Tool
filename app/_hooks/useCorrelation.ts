"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { AssetOption } from "@/app/_data/assets";
import {
  fetchCorrelations,
  assetToCompareType,
  splitSymbols,
  type CorrelationResponse,
} from "@/app/_lib/api";
import { formatDate, findAsset } from "@/app/_lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

function defaultStart(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return formatDate(d);
}

function writeUrl(base: string, comps: string[], start: string, end: string, win: number) {
  const params = new URLSearchParams();
  params.set("base", base);
  params.set("compare", comps.join(","));
  params.set("start", start);
  params.set("end", end);
  params.set("window", String(win));
  window.history.replaceState({}, "", `?${params.toString()}`);
}

// ── Shared submit logic ─────────────────────────────────────────────────────

async function runCorrelation(
  base: AssetOption,
  comps: AssetOption[],
  start: string,
  end: string,
  win: number,
): Promise<CorrelationResponse> {
  const { stockSymbols, cryptoSymbols } = splitSymbols(comps);
  return fetchCorrelations({
    compareSymbol: base.value,
    compareType: assetToCompareType(base),
    stockSymbols,
    cryptoSymbols,
    startDateString: start,
    endDateString: end,
    rollingWindow: win,
  });
}

// ── Hook return type ────────────────────────────────────────────────────────

export interface CorrelationControls {
  designated: AssetOption[];
  comparisons: AssetOption[];
  startDate: string;
  endDate: string;
  rollingWindow: number;
  minDate: string | undefined;
  expanded: boolean;
  loading: boolean;
  result: CorrelationResponse | null;
  validation: { ok: boolean; msg: string | null };
  onDesignatedChange: (assets: AssetOption[]) => void;
  onComparisonsChange: (assets: AssetOption[]) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onRollingWindowChange: (value: number) => void;
  onExpandedChange: (expanded: boolean) => void;
  onSubmit: () => void;
}

export interface UseCorrelationReturn {
  /** True once URL hydration check is complete. */
  hydrated: boolean;
  /** Everything the ControlsCard needs — spread directly as props. */
  controls: CorrelationControls;

  /** Async / result state. */
  loading: boolean;
  result: CorrelationResponse | null;
  error: string | null;
  hasResults: boolean;

  /** Derived data. */
  designatedSymbol: string;
  assetTypes: Record<string, string>;
  rollingWindow: number;

  /** Cross-component highlight state (matrix ↔ chart). */
  highlightedSymbol: string | null;
  setHighlightedSymbol: (symbol: string | null) => void;
  handleMatrixHighlight: (symbol: string) => void;
  chartRef: React.RefObject<HTMLDivElement | null>;

  /** Quick-start preset handler. */
  handlePreset: (base: AssetOption, comps: AssetOption[]) => void;
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useCorrelation(): UseCorrelationReturn {
  // Form state
  const [designated, setDesignated] = useState<AssetOption[]>([]);
  const [comparisons, setComparisons] = useState<AssetOption[]>([]);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(() => formatDate(new Date()));
  const [rollingWindow, setRollingWindow] = useState(90);

  // Async state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrelationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [expanded, setExpanded] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [highlightedSymbol, setHighlightedSymbol] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // ── Derived values ──────────────────────────────────────────────────────

  const minDate = useMemo(() => {
    const dates = [...designated, ...comparisons]
      .filter((a) => a.inceptionDate)
      .map((a) => a.inceptionDate!);
    return dates.length > 0 ? dates.sort().pop() : undefined;
  }, [designated, comparisons]);

  const validation = useMemo(() => {
    if (designated.length === 0) return { ok: false, msg: "Select a base ticker" };
    if (comparisons.length === 0) return { ok: false, msg: "Add at least one comparison" };
    const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    if (diff < 90) return { ok: false, msg: "Minimum 90-day range required" };
    if (new Date(endDate) > new Date()) return { ok: false, msg: "End date in the future" };
    return { ok: true, msg: null };
  }, [designated, comparisons, startDate, endDate]);

  const hasResults = !!(
    result &&
    (Object.keys(result.correlations.correlationChart).length > 0 ||
      result.correlations.correlationMatrix.length > 0)
  );

  const assetTypes = useMemo(() => {
    const types: Record<string, string> = {};
    for (const a of [...designated, ...comparisons]) {
      types[a.value] = a.type;
    }
    return types;
  }, [designated, comparisons]);

  const designatedSymbol = designated[0]?.value || "";

  // ── Core submit (single source of truth) ────────────────────────────────

  const submit = useCallback(
    async (base: AssetOption, comps: AssetOption[], start: string, end: string, win: number) => {
      setLoading(true);
      setError(null);
      setResult(null);
      setExpanded(false);
      setHighlightedSymbol(null);
      try {
        const res = await runCorrelation(base, comps, start, end, win);
        setResult(res);
        writeUrl(base.value, comps.map((c) => c.value), start, end, win);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ── Public handlers ─────────────────────────────────────────────────────

  const handleSubmit = useCallback(() => {
    if (!validation.ok || !designated.length) return;
    submit(designated[0], comparisons, startDate, endDate, rollingWindow);
  }, [designated, comparisons, startDate, endDate, rollingWindow, validation.ok, submit]);

  const handlePreset = useCallback(
    (base: AssetOption, comps: AssetOption[]) => {
      const start = defaultStart();
      const end = formatDate(new Date());
      const win = 90;
      setDesignated([base]);
      setComparisons(comps);
      setStartDate(start);
      setEndDate(end);
      setRollingWindow(win);
      submit(base, comps, start, end, win);
    },
    [submit],
  );

  const handleMatrixHighlight = useCallback(
    (symbol: string) => {
      setHighlightedSymbol((prev) => (prev === symbol ? null : symbol));
      chartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [],
  );

  // ── URL hydration on mount ──────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const baseParam = params.get("base");
    const compareParam = params.get("compare");
    if (!baseParam) return;

    const baseAsset = findAsset(baseParam);
    if (!baseAsset) return;

    const compAssets = (compareParam?.split(",").filter(Boolean) || [])
      .map(findAsset)
      .filter(Boolean) as AssetOption[];
    if (compAssets.length === 0) return;

    const start = params.get("start") || defaultStart();
    const end = params.get("end") || formatDate(new Date());
    const win = Number(params.get("window")) || 90;

    setDesignated([baseAsset]);
    setComparisons(compAssets);
    setStartDate(start);
    setEndDate(end);
    setRollingWindow(win);

    submit(baseAsset, compAssets, start, end, win);
    setHydrated(true);
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mark hydrated even when no URL params (next frame after mount)
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ── Return ──────────────────────────────────────────────────────────────

  return {
    hydrated,
    controls: {
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
      onDesignatedChange: setDesignated,
      onComparisonsChange: setComparisons,
      onStartDateChange: setStartDate,
      onEndDateChange: setEndDate,
      onRollingWindowChange: setRollingWindow,
      onExpandedChange: setExpanded,
      onSubmit: handleSubmit,
    },
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
  };
}
