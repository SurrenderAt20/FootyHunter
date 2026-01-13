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
              "rounded-xl border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300/60 dark:focus:ring-white/20 " +
              (isDisabled
                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white/35"
                : isSelected
                  ? "border-slate-900 bg-slate-900 text-white dark:border-white/20 dark:bg-white dark:text-slate-900"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10")
            }
          >
            <div className="font-medium">{c.label}</div>
            {c.description && <div className="mt-0.5 text-xs opacity-80">{c.description}</div>}
            {isUsed && <div className="mt-1 text-xs font-medium">Used</div>}
          </button>
        );
      })}
    </div>
  );
}
