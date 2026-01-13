"use client";

import Link from "next/link";
import { useDailySeed } from "@/hooks/useDailySeed";
import { useGameState } from "@/hooks/useGameState";
import { categories } from "@/lib/data/categories";
import { players } from "@/lib/data/players";
import * as React from "react";
import { PlayerAutocomplete } from "@/components/PlayerAutocomplete";
import type { Player } from "@/lib/game/types";
import { CategoryPicker } from "@/components/CategoryPicker";
import type { StatKey } from "@/lib/game/types";

export default function GamePage() {
  const daily = useDailySeed();
  const { state, actions } = useGameState();
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<StatKey | null>(null);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Game</h1>
          <p className="text-sm text-zinc-600">
            Daily hunt • <span className="font-mono">{daily.dateKey}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50" href="/">
            Home
          </Link>
          <Link
            className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50"
            href="/game/result"
          >
            Result
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">GeoHunter core loop (WIP)</h2>
        <p className="mt-2 text-zinc-700">
          This page is now wired to the new turn-based state. Next step is adding the player
          autocomplete and the category picker.
        </p>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            Status: <span className="font-medium">{state.status}</span> • Turns: {state.turns.length}
            /8 • Used categories: {state.usedCategories.length}/8
          </p>
          <button
            className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50"
            onClick={actions.reset}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Choose a player</h2>
        <p className="mt-1 text-sm text-zinc-600">Pick your guess for this turn.</p>

        <div className="mt-3">
          <PlayerAutocomplete
            players={players}
            value={selectedPlayer}
            onChange={setSelectedPlayer}
            disabled={state.status !== "playing"}
          />
        </div>

        {selectedPlayer && (
          <div className="mt-3 rounded-xl border bg-zinc-50 p-3 text-sm">
            Selected: <span className="font-medium">{selectedPlayer.name}</span>
          </div>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Choose a category</h2>
        <p className="mt-1 text-sm text-zinc-600">Each category can only be used once.</p>

        <div className="mt-3">
          <CategoryPicker
            categories={categories}
            used={state.usedCategories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            disabled={state.status !== "playing"}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            {selectedCategory ? (
              <>Selected category: <span className="font-medium">{selectedCategory}</span></>
            ) : (
              <>Select a category to submit the turn.</>
            )}
          </div>

          <button
            type="button"
            disabled={state.status !== "playing" || !selectedPlayer || !selectedCategory}
            onClick={() => {
              if (!selectedPlayer || !selectedCategory) return;
              actions.submitTurn({
                guessPlayerId: selectedPlayer.id,
                categoryId: selectedCategory,
              });
              setSelectedCategory(null);
              setSelectedPlayer(null);
            }}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            Submit turn
          </button>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Turn history</h2>
        <div className="mt-4 flex flex-col gap-2">
          {state.turns.length === 0 ? (
            <p className="text-sm text-zinc-600">No turns yet.</p>
          ) : (
            state.turns.map((t) => {
              const categoryLabel = categories.find((c) => c.id === t.categoryId)?.label ?? t.categoryId;
              return (
                <div key={t.turn} className="rounded-xl border bg-white p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-medium">Turn {t.turn}</span> • {categoryLabel}
                    </div>
                    <div className="font-mono">
                      {t.guessValue} → {t.comparison}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
