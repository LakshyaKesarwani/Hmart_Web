import Link from "next/link";

function buildPageHref({
  categoryId,
  page,
  search,
}: {
  categoryId: string;
  page: number;
  search: string;
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("q", search);
  }

  if (categoryId) {
    params.set("category", categoryId);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/admin/products?${query}` : "/admin/products";
}

export function ProductsPagination({
  categoryId,
  page,
  pageSize,
  search,
  totalCount,
}: {
  categoryId: string;
  page: number;
  pageSize: number;
  search: string;
  totalCount: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {start}-{end} of {totalCount}
      </p>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={page <= 1}
          className={`rounded-md border px-3 py-2 font-medium ${
            page <= 1
              ? "pointer-events-none border-zinc-200 text-zinc-300"
              : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          }`}
          href={buildPageHref({ categoryId, page: page - 1, search })}
        >
          Previous
        </Link>
        <span className="px-2">
          Page {page} of {totalPages}
        </span>
        <Link
          aria-disabled={page >= totalPages}
          className={`rounded-md border px-3 py-2 font-medium ${
            page >= totalPages
              ? "pointer-events-none border-zinc-200 text-zinc-300"
              : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          }`}
          href={buildPageHref({ categoryId, page: page + 1, search })}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
