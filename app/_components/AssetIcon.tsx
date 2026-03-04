"use client";

import { useState } from "react";
import type { AssetType } from "@/app/_data/assets";
import { TYPE_COLOR } from "@/app/_lib/constants";

interface AssetIconProps {
  symbol: string;
  type: string;
  size?: number;
}

/**
 * Crypto icons from CoinGecko CDN, letter avatars for stocks/ETFs.
 */
const CRYPTO_ICON_MAP: Record<string, string> = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  XRP: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  AVAX: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  DOT: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  LINK: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  LTC: "https://assets.coingecko.com/coins/images/2/small/litecoin.png",
  UNI: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg",
  ATOM: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png",
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  TON: "https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png",
  NEAR: "https://assets.coingecko.com/coins/images/10365/small/near.jpg",
  AAVE: "https://assets.coingecko.com/coins/images/12645/small/aave-token-round.png",
  MKR: "https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png",
  INJ: "https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png",
  SHIB: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
  PEPE: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
  APT: "https://assets.coingecko.com/coins/images/26455/small/aptos_round.png",
  ARB: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  OP: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  SUI: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg",
};

export default function AssetIcon({ symbol, type, size = 20 }: AssetIconProps) {
  const [imgError, setImgError] = useState(false);
  const iconUrl = type === "crypto" ? CRYPTO_ICON_MAP[symbol] : null;
  const bgColor = TYPE_COLOR[type as AssetType];

  if (iconUrl && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={iconUrl}
        alt={symbol}
        width={size}
        height={size}
        className="rounded-full"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    );
  }

  // Letter avatar fallback
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size * 0.45,
      }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}
