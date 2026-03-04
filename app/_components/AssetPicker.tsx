"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import type { AssetOption } from "@/app/_data/assets";
import { DefaultAssets, AllAssets } from "@/app/_data/assets";
import AssetIcon from "@/app/_components/AssetIcon";
import { TYPE_CHIP_STYLE, TYPE_HOVER_BG } from "@/app/_lib/constants";
import { useClickOutside } from "@/app/_hooks/useClickOutside";

interface AssetPickerProps {
  label: string;
  selected: AssetOption[];
  onChange: (assets: AssetOption[]) => void;
  max?: number;
  exclude?: string[];
  single?: boolean;
}

export default function AssetPicker({
  label,
  selected,
  onChange,
  max = 5,
  exclude = [],
  single = false,
}: AssetPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(containerRef, useCallback(() => setOpen(false), []));

  const options = useMemo(() => {
    const source = query.length > 0 ? AllAssets : DefaultAssets;
    const lowerQuery = query.toLowerCase();
    return source.filter((asset) => {
      if (exclude.includes(asset.value)) return false;
      if (selected.some((s) => s.value === asset.value)) return false;
      if (!query) return true;
      return (
        asset.value.toLowerCase().includes(lowerQuery) ||
        asset.label.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query, exclude, selected]);

  const handleSelect = (asset: AssetOption) => {
    if (single) {
      onChange([asset]);
    } else if (selected.length < max) {
      onChange([...selected, asset]);
    }
    setQuery("");
    if (single) setOpen(false);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((s) => s.value !== value));
  };

  const atMax = !single && selected.length >= max;

  return (
    <div ref={containerRef} className="relative flex items-center gap-1.5">
      {/* Label */}
      {label && (
        <span className="text-[10px] font-semibold text-subtle uppercase tracking-[0.08em] shrink-0">
          {label}
        </span>
      )}

      {/* Selected chips */}
      {selected.map((asset) => {
    const chipStyle = TYPE_CHIP_STYLE[asset.type];
        return (
          <span
            key={asset.value}
            className={`inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg
                       border text-xs text-fg shrink-0
                       transition-colors ${chipStyle}`}
          >
            <AssetIcon symbol={asset.value} type={asset.type} size={20} />
            <span className="font-semibold">{asset.value}</span>
            <button
              onClick={() => handleRemove(asset.value)}
              className="ml-0.5 w-4 h-4 rounded flex items-center justify-center
                         text-muted hover:text-fg hover:bg-black/5 transition-colors text-xs"
              aria-label={`Remove ${asset.label}`}
            >
              ×
            </button>
          </span>
        );
      })}

      {/* Add button */}
      {!atMax && (
        <div className="relative">
          <button
            onClick={() => {
              setOpen(!open);
              setTimeout(() => inputRef.current?.focus(), 10);
            }}
            aria-expanded={open}
            aria-haspopup="listbox"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       text-accent hover:text-accent-hover
                       bg-accent-subtle hover:bg-accent/10
                       border border-accent/20 hover:border-accent/30
                       transition-all"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {single && selected.length > 0 ? "Replace" : "Add"}
          </button>

          {open && (
            <div className="absolute top-full left-0 mt-2 z-50 w-72 rounded-xl bg-card
                            border border-edge shadow-xl shadow-black/8 overflow-hidden
                            animate-pop-in origin-top">
              <div className="p-2.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tickers or names..."
                  className="w-full px-3 py-2 text-sm rounded-lg bg-input border border-edge
                             text-fg placeholder:text-muted
                             focus:outline-none focus:border-edge-focus transition-all"
                  autoFocus
                />
              </div>
              <div className="max-h-56 overflow-y-auto">
                {query.length === 0 && (
                  <div className="px-3 py-1.5 text-[9px] text-muted uppercase tracking-widest">
                    Suggested
                  </div>
                )}
                {options.slice(0, 20).map((asset) => {
                  const hoverBg = TYPE_HOVER_BG[asset.type];
                  return (
                    <button
                      key={asset.value}
                      onClick={() => handleSelect(asset)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors"
                      style={{ ["--hover-bg" as string]: hoverBg }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <AssetIcon symbol={asset.value} type={asset.type} size={20} />
                      <span className="text-sm font-semibold text-fg">{asset.value}</span>
                      <span className="text-sm text-muted truncate">{asset.label}</span>
                      {asset.inceptionDate && (
                        <span className="ml-auto text-[10px] text-muted shrink-0">
                          {asset.inceptionDate.slice(0, 4)}
                        </span>
                      )}
                    </button>
                  );
                })}
                {options.length === 0 && (
                  <div className="px-3 py-4 text-sm text-muted text-center">No matches</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Count indicator for multi */}
      {!single && selected.length > 0 && (
        <span className="text-xs text-muted shrink-0">
          {selected.length}/{max}
        </span>
      )}
    </div>
  );
}
