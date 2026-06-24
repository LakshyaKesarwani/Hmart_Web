import Link from "next/link";
import type { StorefrontCategory } from "@/src/lib/storefront/types";
import { buildProductsHref } from "./catalog-filters";

export function CategoryCards({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-md hover:scale-[1.02]"
          href={buildProductsHref({ category: category.slug })}
          key={category.id}
        >
          {category.imageUrl ? (
            <div className="aspect-[16/9] overflow-hidden bg-green-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                src={category.imageUrl}
              />
            </div>
          ) : (
            <div className="aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-green-700 to-emerald-800">
              <span className="text-3xl font-bold uppercase tracking-widest text-white/20">
                {category.name.slice(0, 2)}
              </span>
            </div>
          )}
          <div className="p-5">
            <h3 className="text-base font-semibold text-zinc-950 transition-colors group-hover:text-green-700">
              {category.name}
            </h3>
            {category.description ? (
              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-zinc-500">
                {category.description}
              </p>
            ) : (
              <p className="mt-1.5 text-sm text-zinc-500">Browse this department</p>
            )}
            <p className="mt-3 text-xs font-semibold text-green-600 transition-colors group-hover:text-green-800">
              Shop now →
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function CatalogPagination({
  category,
  maxPrice,
  minPrice,
  page,
  pageSize,
  search,
  totalCount,
}: {
  category: string;
  maxPrice: string;
  minPrice: string;
  page: number;
  pageSize: number;
  search: string;
  totalCount: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);
  const base = { category, maxPrice, minPrice, q: search };

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {start}–{end} of {totalCount}
      </p>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={page <= 1}
          className={`rounded-full border px-4 py-2 font-medium transition-colors ${
            page <= 1
              ? "pointer-events-none border-zinc-200 text-zinc-300"
              : "border-zinc-300 text-zinc-700 hover:border-green-500 hover:text-green-800"
          }`}
          href={buildProductsHref({ ...base, page: page - 1 })}
        >
          Previous
        </Link>
        <span className="px-2">
          Page {page} of {totalPages}
        </span>
        <Link
          aria-disabled={page >= totalPages}
          className={`rounded-full border px-4 py-2 font-medium transition-colors ${
            page >= totalPages
              ? "pointer-events-none border-zinc-200 text-zinc-300"
              : "border-zinc-300 text-zinc-700 hover:border-green-500 hover:text-green-800"
          }`}
          href={buildProductsHref({ ...base, page: page + 1 })}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
