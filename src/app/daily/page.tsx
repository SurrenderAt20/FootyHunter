import { getDailyPick } from "@/lib/game/engine";

export const dynamic = "force-static";

export default function DailyPage() {
  const daily = getDailyPick();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Daily challenge</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Seeded by UTC date. Everyone gets the same daily pick.
        </p>
      </header>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600">Date</div>
          <div className="font-mono text-sm">{daily.dateKey}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-zinc-600">Seed</div>
          <div className="font-mono text-sm">{daily.seed}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-zinc-600">Index</div>
          <div className="font-mono text-sm">{daily.index}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-zinc-600">Item</div>
          <div className="font-medium">{daily.item.name}</div>
        </div>
      </section>
    </main>
  );
}
