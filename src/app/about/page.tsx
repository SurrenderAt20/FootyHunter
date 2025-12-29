import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">About FootyHunter</h1>
        <p className="mt-1 text-sm text-zinc-600">
          A daily football-themed game built with Next.js + Tailwind.
        </p>
      </header>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-zinc-700">
          This repo is evolving toward a daily challenge format using deterministic seeds and static JSON datasets.
        </p>
        <div className="mt-4">
          <Link className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-50" href="/">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
