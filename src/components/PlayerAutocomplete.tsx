"use client";

import * as React from "react";
import type { Player } from "@/lib/game/types";

export function PlayerAutocomplete(props: {
  players: Player[];
  value: Player | null;
  onChange: (player: Player | null) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { players, value, onChange, placeholder = "Search player…", disabled } = props;
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    // Keep text input aligned with selected value.
    if (value) setQuery(value.name);
  }, [value]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players.slice(0, 12);

    return players
      .filter((p) => {
        const haystack = `${p.name} ${p.club} ${p.nationality}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 12);
  }, [players, query]);

  return (
    <div className="relative">
      <input
        disabled={disabled}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          if (value) onChange(null);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 disabled:cursor-not-allowed disabled:bg-zinc-50"
      />

      {isOpen && (
        <button
          type="button"
          aria-label="Close"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && !disabled && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border bg-white shadow-sm">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-zinc-600">No matches.</div>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p);
                  setQuery(p.name);
                  setIsOpen(false);
                }}
                className="flex w-full flex-col px-3 py-2 text-left hover:bg-zinc-50"
              >
                <span className="text-sm font-medium">{p.name}</span>
                <span className="text-xs text-zinc-600">
                  {p.club} • {p.nationality} • {p.position}
                </span>
              </button>
            ))
          )}

          <div className="border-t px-3 py-2 text-xs text-zinc-500">Tip: type name/club/country</div>
        </div>
      )}
    </div>
  );
}
