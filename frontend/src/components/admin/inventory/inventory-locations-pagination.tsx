import Link from "next/link";
import { buildInventoryHref } from "./inventory-query";

export function InventoryLocationsPagination({
  locPage,
  locQ,
  lowPage,
  movePage,
  moveType,
  pageSize,
  stockLocation,
  stockPage,
  stockQ,
  totalCount,
}: {
  locPage: number;
  locQ: string;
  lowPage: number;
  movePage: number;
  moveType: string;
  pageSize: number;
  stockLocation: string;
  stockPage: number;
  stockQ: string;
  totalCount: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (locPage - 1) * pageSize + 1;
  const end = Math.min(locPage * pageSize, totalCount);
  const base = {
    locQ,
    lowPage,
    movePage,
    moveType,
    stockLocation,
    stockPage,
    stockQ,
  };

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {start}-{end} of {totalCount}
      </p>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={locPage <= 1}
          className={`rounded-md border px-3 py-2 font-medium ${
            locPage <= 1
              ? "pointer-events-none border-zinc-200 text-zinc-300"
              : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          }`}
          href={buildInventoryHref({ ...base, locPage: locPage - 1 })}
        >
          Previous
        </Link>
        <span className="px-2">
          Page {locPage} of {totalPages}
        </span>
        <Link
          aria-disabled={locPage >= totalPages}
          className={`rounded-md border px-3 py-2 font-medium ${
            locPage >= totalPages
              ? "pointer-events-none border-zinc-200 text-zinc-300"
              : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          }`}
          href={buildInventoryHref({ ...base, locPage: locPage + 1 })}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
