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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          className="rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-400"
          href={buildProductsHref({ category: category.slug })}
          key={category.id}
        >
          <h3 className="text-lg font-semibold text-zinc-950">{category.name}</h3>
          {category.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
              {category.description}
            </p>
          ) : (
            <p className="mt-2 text-sm text-zinc-600">Browse this department</p>
          )}
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
        Showing {start}-{end} of {totalCount}
      </p>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={page <= 1}
          className={`rounded-full border px-4 py-2 font-medium ${
            page <= 1
              ? "pointer-events-none border-zinc-200 text-zinc-300"
              : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
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
          className={`rounded-full border px-4 py-2 font-medium ${
            page >= totalPages
              ? "pointer-events-none border-zinc-200 text-zinc-300"
              : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          }`}
          href={buildProductsHref({ ...base, page: page + 1 })}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
