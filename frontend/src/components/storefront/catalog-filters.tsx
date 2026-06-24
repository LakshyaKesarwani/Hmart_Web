import Link from "next/link";
import type { StorefrontCategory } from "@/src/lib/storefront/types";

export function buildProductsHref({
  category = "",
  maxPrice = "",
  minPrice = "",
  page,
  q = "",
}: {
  category?: string;
  maxPrice?: string;
  minPrice?: string;
  page?: number;
  q?: string;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();

  return query ? `/products?${query}` : "/products";
}

export function CatalogFilters({
  categories,
  category,
  maxPrice,
  minPrice,
  search,
}: {
  categories: StorefrontCategory[];
  category: string;
  maxPrice: string;
  minPrice: string;
  search: string;
}) {
  return (
    <form
      action="/products"
      className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_120px_auto]"
    >
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Search</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={search}
          name="q"
          placeholder="Search products"
          type="search"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Category</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={category}
          name="category"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Min price</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={minPrice}
          min={0}
          name="minPrice"
          placeholder="0"
          step="0.01"
          type="number"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Max price</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={maxPrice}
          min={0}
          name="maxPrice"
          placeholder="Any"
          step="0.01"
          type="number"
        />
      </label>

      <div className="flex items-end gap-2">
        <button
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700"
          type="submit"
        >
          Apply
        </button>
        {(search || category || minPrice || maxPrice) && (
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            href="/products"
          >
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
