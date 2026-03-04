import type { AssetType } from "@/app/_data/assets";

/** Tailwind classes for asset-type chip styling (border + background). */
export const TYPE_CHIP_STYLE: Record<AssetType, string> = {
  crypto: "bg-amber-50 border-amber-200",
  etf: "bg-blue-50 border-blue-200",
  stock: "bg-emerald-50 border-emerald-200",
  trust: "bg-violet-50 border-violet-200",
};

/** Hover background colors for asset-type rows (used in inline styles). */
export const TYPE_HOVER_BG: Record<AssetType, string> = {
  crypto: "rgba(255, 251, 235, 1)",
  etf: "rgba(239, 246, 255, 1)",
  stock: "rgba(236, 253, 245, 1)",
  trust: "rgba(245, 243, 255, 1)",
};

/** Brand color per asset type (icons, avatars). */
export const TYPE_COLOR: Record<AssetType, string> = {
  crypto: "#f59e0b",
  etf: "#3b82f6",
  stock: "#10b981",
  trust: "#8b5cf6",
};

/** Human-readable label per asset type. */
export const TYPE_LABEL: Record<AssetType, string> = {
  crypto: "Crypto",
  etf: "ETF",
  stock: "Stock",
  trust: "Trust",
};
