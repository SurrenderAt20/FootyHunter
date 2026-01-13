"use client";

import type { Category, StatKey } from "@/lib/game/types";

export function CategoryPicker(props: {
  categories: Category[];
  used: StatKey[];
  value: StatKey | null;
  onChange: (value: StatKey) => void;
  disabled?: boolean;
}) {
  const { categories, used, value, onChange, disabled } = props;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {categories.map((c) => {
        const isUsed = used.includes(c.id);
        const isSelected = value === c.id;
        const isDisabled = disabled || isUsed;

        return (
          <button
            key={c.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(c.id)}
            className={
              "rounded-xl border px-3 py-2 text-left text-sm transition " +
              (isDisabled
                ? "cursor-not-allowed bg-zinc-50 text-zinc-400"
                : isSelected
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "bg-white hover:bg-zinc-50")
            }
          >
            <div className="font-medium">{c.label}</div>
            {c.description && <div className="mt-0.5 text-xs opacity-80">{c.description}</div>}
            {isUsed && <div className="mt-0.5 text-xs">Used</div>}
          </button>
        );
      })}
    </div>
  );
}
