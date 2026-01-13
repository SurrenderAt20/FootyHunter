"use client";

import Link from "next/link";
import { useDailySeed } from "@/hooks/useDailySeed";
import { useGameState } from "@/hooks/useGameState";

export default function ResultPage() {
  const daily = useDailySeed();
  const { state, actions } = useGameState();

  const statusLabel =
    state.status === "solved" ? "Solved" : state.status === "failed" ? "Failed" : "In progress";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Result</h1>
          <p className="text-sm text-zinc-600">
            {daily.dateKey} • <span className="font-mono">seed {daily.seed}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50" href="/game">
            Back
          </Link>
          <button
            className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50"
            onClick={actions.reset}
          >
            Reset
          </button>
        </div>
      </header>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600">Status</div>
          <div className="font-medium">{statusLabel}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-zinc-600">Guesses</div>
          <div className="font-medium">{state.turns.length}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-zinc-600">Todays player</div>
          <div className="font-medium">{daily.item.name}</div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white" href="/daily">
            View daily
          </Link>
          <Link className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-50" href="/about">
            About
          </Link>
        </div>
      </section>
    </main>
  );
}
