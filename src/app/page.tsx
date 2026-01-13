"use client";

import * as React from "react";
import { getDailyPick } from "@/lib/game/engine";
import Link from "next/link";

export default function Home() {
  const daily = React.useMemo(() => getDailyPick(), []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">FootyHunter</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Daily hunt   <span className="font-mono">{daily.dateKey}</span>
          </p>
        </header>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">How it works</h2>
          <p className="mt-2 text-zinc-700">
            Guess the secret football player in up to <span className="font-semibold">8</span> turns.
            Each turn you guess a player and then choose <span className="font-semibold">one</span> of
            the 8 stat categories to reveal feedback. Each category can only be used once.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-zinc-600">Today: <span className="font-mono">{daily.dateKey}</span></p>
            <Link className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50" href="/game">
              Play
            </Link>
          </div>
        </section>

        <footer className="pb-4 text-center text-xs text-zinc-500">
          Built with Next.js (App Router) + Tailwind • deployable on Vercel
        </footer>
      </main>
    </div>
  );
}
