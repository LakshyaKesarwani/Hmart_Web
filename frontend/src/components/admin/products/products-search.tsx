import Link from "next/link";
import type { ProductCategoryOption } from "@/src/lib/admin/products";

export function ProductsSearch({
  categoryId,
  categories,
  search,
}: {
  categoryId: string;
  categories: ProductCategoryOption[];
  search: string;
}) {
  return (
    <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto_auto]" method="get">
      <label>
        <span className="sr-only">Search products</span>
        <input
          className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950"
          defaultValue={search}
          name="q"
          placeholder="Search name, brand, slug, or SKU"
          type="search"
        />
      </label>

      <label>
        <span className="sr-only">Filter by category</span>
        <select
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={categoryId}
          name="category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        type="submit"
      >
        Apply
      </button>

      {search || categoryId ? (
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          href="/admin/products"
        >
          Clear
        </Link>
      ) : null}
    </form>
  );
}
