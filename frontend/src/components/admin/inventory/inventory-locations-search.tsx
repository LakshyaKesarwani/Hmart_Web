import { buildInventoryHref } from "./inventory-query";

export function InventoryLocationsSearch({
  locQ,
  lowPage,
  movePage,
  moveType,
  stockLocation,
  stockPage,
  stockQ,
}: {
  locPage: number;
  locQ: string;
  lowPage: number;
  movePage: number;
  moveType: string;
  stockLocation: string;
  stockPage: number;
  stockQ: string;
}) {
  return (
    <form
      action="/admin/inventory"
      className="flex w-full max-w-md items-center gap-2"
      method="get"
    >
      <input name="stockQ" type="hidden" value={stockQ} />
      <input name="stockLocation" type="hidden" value={stockLocation} />
      <input name="stockPage" type="hidden" value={stockPage > 1 ? stockPage : ""} />
      <input name="moveType" type="hidden" value={moveType} />
      <input name="movePage" type="hidden" value={movePage > 1 ? movePage : ""} />
      <input name="lowPage" type="hidden" value={lowPage > 1 ? lowPage : ""} />
      <label className="flex-1">
        <span className="sr-only">Search locations</span>
        <input
          className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={locQ}
          name="locQ"
          placeholder="Search locations"
          type="search"
        />
      </label>
      <button
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"
        type="submit"
      >
        Search
      </button>
      {locQ ? (
        <a
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700"
          href={buildInventoryHref({
            locPage: 1,
            lowPage,
            movePage,
            moveType,
            stockLocation,
            stockPage,
            stockQ,
          })}
        >
          Clear
        </a>
      ) : null}
    </form>
  );
}
