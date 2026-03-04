import type { AssetOption } from "@/app/_data/assets";

export interface CorrelationWarning {
  symbol: string;
  error: "data_missing" | "data_range_short";
  startDate: string;
  endDate: string;
}

export interface CorrelationResponse {
  errors: {
    errors: string[];
    warnings: CorrelationWarning[];
  };
  correlations: {
    correlationChart: Record<string, Array<[number, number]>>;
    correlationMatrix: Array<Record<string, number>>;
  } | null;
}

export interface CorrelationRequest {
  compareSymbol: string;
  compareType: "stock" | "crypto";
  stockSymbols: string[];
  cryptoSymbols: string[];
  startDateString: string;
  endDateString: string;
  rollingWindow: number;
}

export const assetToCompareType = (asset: AssetOption): "stock" | "crypto" => {
  return asset.type === "crypto" ? "crypto" : "stock";
};

export const splitSymbols = (assets: AssetOption[]) => ({
  stockSymbols: assets.filter((a) => a.type !== "crypto").map((a) => a.value),
  cryptoSymbols: assets.filter((a) => a.type === "crypto").map((a) => a.value),
});

export async function fetchCorrelations(
  request: CorrelationRequest
): Promise<CorrelationResponse> {
  const response = await fetch("/api/correlation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.errors?.[0] || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}
