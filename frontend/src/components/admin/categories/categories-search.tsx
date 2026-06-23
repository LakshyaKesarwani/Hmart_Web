import Link from "next/link";

export function CategoriesSearch({ search }: { search: string }) {
  return (
    <form className="flex flex-col gap-3 sm:flex-row" method="get">
      <label className="flex-1">
        <span className="sr-only">Search categories</span>
        <input
          className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950"
          defaultValue={search}
          name="q"
          placeholder="Search by name or slug"
          type="search"
        />
      </label>
      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        type="submit"
      >
        Search
      </button>
      {search ? (
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          href="/admin/categories"
        >
          Clear
        </Link>
      ) : null}
    </form>
  );
}
