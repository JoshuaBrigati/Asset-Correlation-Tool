/**
 * Chart line colors — rich and readable on light backgrounds.
 */
export const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
] as const;

/**
 * Human-readable label for a correlation coefficient.
 */
export function corrLabel(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 0.7) return value > 0 ? "Strong" : "Strong inverse";
  if (abs >= 0.4) return value > 0 ? "Moderate" : "Moderate inverse";
  if (abs >= 0.2) return value > 0 ? "Weak" : "Weak inverse";
  return "Very weak";
}

/**
 * Heatmap cell style based on correlation value.
 * Uses subtle opacity-based coloring for light backgrounds.
 */
export function heatmapStyle(value: number): {
  bg: string;
  text: string;
  label: string;
} {
  const clamped = Math.max(-1, Math.min(1, value));
  const abs = Math.abs(clamped);

  // Self-correlation
  if (clamped >= 0.999) {
    return { bg: "rgba(59, 130, 246, 0.06)", text: "var(--color-muted)", label: "" };
  }

  const label = corrLabel(clamped);
  const alpha = 0.03 + abs * 0.15;

  if (clamped >= 0) {
    return {
      bg: `rgba(239, 68, 68, ${alpha})`,
      text: abs > 0.5 ? "#dc2626" : abs > 0.2 ? "var(--color-subtle)" : "var(--color-muted)",
      label,
    };
  } else {
    return {
      bg: `rgba(59, 130, 246, ${alpha})`,
      text: abs > 0.5 ? "#2563eb" : abs > 0.2 ? "var(--color-subtle)" : "var(--color-muted)",
      label,
    };
  }
}
