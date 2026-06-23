export default function ProductDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <div className="h-5 w-36 animate-pulse rounded bg-zinc-200" />
        <div className="mt-4 h-8 w-80 max-w-full animate-pulse rounded bg-zinc-100" />
        <div className="mt-3 h-4 w-48 animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-28 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-28 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-28 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-28 animate-pulse rounded-lg bg-zinc-100" />
      </div>
      <div className="h-56 animate-pulse rounded-lg bg-zinc-100" />
    </div>
  );
}
