import type { AssetOption } from "@/app/_data/assets";
import { DefaultAssets, AllAssets } from "@/app/_data/assets";

/** Format a Date to YYYY-MM-DD. */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Look up an asset by symbol, checking DefaultAssets first. */
export function findAsset(symbol: string): AssetOption | undefined {
  return (
    DefaultAssets.find((a) => a.value === symbol) ||
    AllAssets.find((a) => a.value === symbol)
  );
}
