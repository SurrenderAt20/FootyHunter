export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm">
        <div className="h-5 w-32 rounded bg-zinc-100" />
        <div className="mt-4 h-4 w-full rounded bg-zinc-100" />
        <div className="mt-2 h-4 w-2/3 rounded bg-zinc-100" />
      </div>
    </main>
  );
}
