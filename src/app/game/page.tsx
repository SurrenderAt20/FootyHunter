"use client";

import Link from "next/link";
import { items } from "@/lib/data/items";
import { useDailySeed } from "@/hooks/useDailySeed";
import { useGameState } from "@/hooks/useGameState";

export default function GamePage() {
  const daily = useDailySeed();
  const { state, actions } = useGameState();

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
        <h2 className="text-lg font-semibold">Hint</h2>
        <p className="mt-1 text-zinc-700">{daily.item.hint}</p>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">Guesses: {state.guesses.length}</p>
          <button
            className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50"
            onClick={actions.reset}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Guess</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((it) => {
            const guessed = state.guesses.includes(it.id);
            const disabled = guessed || state.isSolved;
            return (
              <button
                key={it.id}
                disabled={disabled}
                onClick={() => actions.guess(it.id)}
                className={
                  "rounded-xl border p-4 text-left transition " +
                  (state.isSolved && it.id === daily.item.id
                    ? "border-emerald-300 bg-emerald-50"
                    : guessed
                      ? "bg-zinc-50"
                      : "hover:bg-zinc-50")
                }
              >
                <div className="font-medium">{it.name}</div>
                <div className="mt-1 text-xs text-zinc-600">
                  {state.isSolved && it.id === daily.item.id
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

      {state.isSolved && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          You got it! Head to <Link className="underline" href="/game/result">result</Link>.
        </div>
      )}
    </main>
  );
}
