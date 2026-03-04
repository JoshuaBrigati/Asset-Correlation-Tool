"use client";

const WINDOW_OPTIONS = [30, 60, 90, 120, 180, 252] as const;

interface RollingWindowInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RollingWindowInput({
  value,
  onChange,
}: RollingWindowInputProps) {
  return (
    <div className="flex items-center bg-input rounded-lg p-0.5">
      {WINDOW_OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
            ${
              value === opt
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-subtle"
            }`}
        >
          {opt}d
        </button>
      ))}
    </div>
  );
}
