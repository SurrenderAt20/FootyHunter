"use client";

import * as React from "react";
import { items } from "@/data/items";
import { getDailyPick } from "@/lib/dailyPick";
import { useGame } from "@/lib/gameState";

function RarityBadge({ rarity }: { rarity: string }) {
  const cls =
    rarity === "legendary"
      ? "bg-amber-100 text-amber-900 border-amber-200"
      : rarity === "epic"
        ? "bg-purple-100 text-purple-900 border-purple-200"
        : rarity === "rare"
          ? "bg-blue-100 text-blue-900 border-blue-200"
          : rarity === "uncommon"
            ? "bg-emerald-100 text-emerald-900 border-emerald-200"
            : "bg-zinc-100 text-zinc-800 border-zinc-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {rarity}
    </span>
  );
}

export default function Home() {
  const daily = React.useMemo(() => getDailyPick(), []);
  const { state, actions, isHydrated } = useGame();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">FootyHunter</h1>
          <p className="text-sm text-zinc-600">
            Daily hunt • seed: <span className="font-mono">{daily.seed}</span> • date: {daily.dateKey}
          </p>
        </header>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Today’s hint</h2>
              <p className="mt-1 text-zinc-700">{daily.item.hint}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50"
                onClick={actions.reset}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-zinc-600">
            {state.isSolved ? (
              <p>
                You got it! Today’s item is <span className="font-semibold">{daily.item.name}</span>.
              </p>
            ) : (
              <p>Pick an item to guess. Your progress is saved locally.</p>
            )}
            {!isHydrated && <p className="mt-1 text-xs text-zinc-500">Loading saved state…</p>}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Items</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Starter dataset. We’ll expand this into real FootyHunter content.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((it) => {
              const guessed = state.guesses.includes(it.id);
              const isCorrect = state.isSolved && it.id === daily.item.id;

              return (
                <button
                  key={it.id}
                  onClick={() => actions.guess(it.id)}
                  disabled={state.isSolved}
                  className={
                    "group flex flex-col gap-2 rounded-xl border p-4 text-left transition " +
                    (isCorrect
                      ? "border-emerald-300 bg-emerald-50"
                      : guessed
                        ? "border-zinc-300 bg-zinc-50"
                        : "hover:bg-zinc-50")
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{it.name}</div>
                    <RarityBadge rarity={it.rarity} />
                  </div>
                  <div className="text-xs text-zinc-600">
                    {isCorrect
                      ? "Correct"
                      : guessed
                        ? "Guessed"
                        : "Click to guess"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="pb-4 text-center text-xs text-zinc-500">
          Built with Next.js (App Router) + Tailwind • deployable on Vercel
        </footer>
      </main>
    </div>
  );
}
