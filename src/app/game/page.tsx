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

  const remainingTurns = 8 - state.turns.length;
  const remainingCategories = 8 - state.usedCategories.length;

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
        <p className="mt-2 text-zinc-700">Guess a player, pick a category, and get feedback.</p>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            Status: <span className="font-medium">{state.status}</span> 1 Turns: {state.turns.length}/8
            1 Remaining turns: {remainingTurns} 1 Remaining categories: {remainingCategories}
          </p>
          <button
            className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50"
            onClick={actions.reset}
          >
            Reset
          </button>
        </div>
      </section>

      {state.status !== "playing" && (
        <div
          className={
            "rounded-2xl border p-4 " +
            (state.status === "solved"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : "border-rose-200 bg-rose-50 text-rose-950")
          }
        >
          {state.status === "solved" ? (
            <div>
              <div className="font-medium">Solved!</div>
              <div className="mt-1 text-sm">You found the player in {state.turns.length} turns.</div>
            </div>
          ) : (
            <div>
              <div className="font-medium">Out of turns</div>
              <div className="mt-1 text-sm">Better luck tomorrow.</div>
            </div>
          )}
        </div>
      )}

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

        {state.status !== "playing" && (
          <div className="mt-3 text-xs text-zinc-500">Selections are locked because the run is over.</div>
        )}

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
              const guessedPlayer = players.find((p) => p.id === t.guessPlayerId);

              const meaning =
                t.comparison === "equal"
                  ? "Match"
                  : t.comparison === "higher"
                    ? "Target is higher"
                    : "Target is lower";

              return (
                <div key={t.turn} className="rounded-xl border bg-white p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-medium">Turn {t.turn}</span> 1 {guessedPlayer?.name ?? t.guessPlayerId}
                      <span className="text-zinc-500"> 1 </span>
                      {categoryLabel}
                      {t.correct && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-900">Correct</span>}
                    </div>
                    <div className="text-xs text-zinc-600">
                      Your value: <span className="font-mono">{t.guessValue}</span> 1 {meaning}
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
