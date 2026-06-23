import Link from "next/link";
import { buildInventoryHref } from "./inventory-query";

function PaginationBar({
  base,
  page,
  pageKey,
  pageSize,
  totalCount,
}: {
  base: Record<string, string | number | undefined>;
  page: number;
  pageKey: "stockPage" | "movePage" | "lowPage";
  pageSize: number;
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
          href={buildInventoryHref({ ...base, [pageKey]: page - 1 })}
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
          href={buildInventoryHref({ ...base, [pageKey]: page + 1 })}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

export function InventoryStockPagination(props: {
  locPage: number;
  locQ: string;
  lowPage: number;
  movePage: number;
  moveType: string;
  page: number;
  pageSize: number;
  stockLocation: string;
  stockQ: string;
  totalCount: number;
}) {
  return (
    <PaginationBar
      base={{
        locPage: props.locPage,
        locQ: props.locQ,
        lowPage: props.lowPage,
        movePage: props.movePage,
        moveType: props.moveType,
        stockLocation: props.stockLocation,
        stockQ: props.stockQ,
      }}
      page={props.page}
      pageKey="stockPage"
      pageSize={props.pageSize}
      totalCount={props.totalCount}
    />
  );
}

export function InventoryLowStockPagination(props: {
  locPage: number;
  locQ: string;
  movePage: number;
  moveType: string;
  page: number;
  pageSize: number;
  stockLocation: string;
  stockPage: number;
  stockQ: string;
  totalCount: number;
}) {
  return (
    <PaginationBar
      base={{
        locPage: props.locPage,
        locQ: props.locQ,
        movePage: props.movePage,
        moveType: props.moveType,
        stockLocation: props.stockLocation,
        stockPage: props.stockPage,
        stockQ: props.stockQ,
      }}
      page={props.page}
      pageKey="lowPage"
      pageSize={props.pageSize}
      totalCount={props.totalCount}
    />
  );
}

export function InventoryMovementsPagination(props: {
  locPage: number;
  locQ: string;
  lowPage: number;
  moveType: string;
  page: number;
  pageSize: number;
  stockLocation: string;
  stockPage: number;
  stockQ: string;
  totalCount: number;
}) {
  return (
    <PaginationBar
      base={{
        locPage: props.locPage,
        locQ: props.locQ,
        lowPage: props.lowPage,
        moveType: props.moveType,
        stockLocation: props.stockLocation,
        stockPage: props.stockPage,
        stockQ: props.stockQ,
      }}
      page={props.page}
      pageKey="movePage"
      pageSize={props.pageSize}
      totalCount={props.totalCount}
    />
  );
}
