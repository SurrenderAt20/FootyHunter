"use client";

import Link from "next/link";
import { useDailySeed } from "@/hooks/useDailySeed";
import { useGameState } from "@/hooks/useGameState";
import * as React from "react";
import { buildShareText } from "@/lib/game/share";

export default function ResultPage() {
  const daily = useDailySeed();
  const { state, actions } = useGameState();

  const [copied, setCopied] = React.useState(false);

  const statusLabel =
    state.status === "solved" ? "Solved" : state.status === "failed" ? "Failed" : "In progress";

  const canReveal = state.status === "solved" || state.status === "failed";

  const shareText = React.useMemo(() => {
    return buildShareText({
      dateKey: daily.dateKey,
      status: state.status,
      turns: state.turns,
    });
  }, [daily.dateKey, state.status, state.turns]);

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
          <div className="font-medium">{canReveal ? daily.item.name : "Hidden"}</div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white" href="/daily">
            View daily
          </Link>
          <button
            type="button"
            disabled={!canReveal}
            onClick={async () => {
              if (!canReveal) return;
              setCopied(false);
              try {
                await navigator.clipboard.writeText(shareText);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                // Fallback for older browsers.
                const el = document.createElement("textarea");
                el.value = shareText;
                el.setAttribute("readonly", "true");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
            className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            title={canReveal ? "Copy share text" : "Finish the run to share"}
          >
            {copied ? "Copied!" : "Copy results"}
          </button>
          <Link className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-50" href="/about">
            About
          </Link>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-xs font-medium text-zinc-600">Share preview</div>
          <pre className="whitespace-pre-wrap rounded-xl border bg-zinc-50 p-3 text-xs text-zinc-800">
            {shareText}
          </pre>
          {!canReveal && (
            <div className="mt-2 text-xs text-zinc-500">
              Finish the run (solve or fail) to unlock sharing.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
