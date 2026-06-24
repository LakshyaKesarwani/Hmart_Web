export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-40 rounded-md bg-zinc-200" />
        <div className="mt-3 h-5 w-full max-w-xl rounded-md bg-zinc-200" />
      </div>
      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="h-16 rounded-md bg-zinc-200" />
          <div className="h-16 rounded-md bg-zinc-200" />
        </div>
      </section>
    </div>
  );
}
