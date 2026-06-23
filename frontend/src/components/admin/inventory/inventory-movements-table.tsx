import type { InventoryMovementItem } from "@/src/lib/admin/inventory";
import { INVENTORY_MOVEMENT_TYPES } from "@/src/lib/admin/inventory";
import { buildInventoryHref } from "./inventory-query";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function InventoryMovementsFilter({
  locPage,
  locQ,
  lowPage,
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
    <form action="/admin/inventory" className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <input name="locQ" type="hidden" value={locQ} />
      <input name="locPage" type="hidden" value={locPage > 1 ? locPage : ""} />
      <input name="stockQ" type="hidden" value={stockQ} />
      <input name="stockLocation" type="hidden" value={stockLocation} />
      <input name="stockPage" type="hidden" value={stockPage > 1 ? stockPage : ""} />
      <input name="lowPage" type="hidden" value={lowPage > 1 ? lowPage : ""} />
      <label className="block w-full sm:w-56">
        <span className="text-sm font-medium text-zinc-800">Movement type</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={moveType}
          name="moveType"
        >
          <option value="">All types</option>
          {INVENTORY_MOVEMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <button
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"
        type="submit"
      >
        Filter
      </button>
      {moveType ? (
        <a
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700"
          href={buildInventoryHref({
            locPage,
            locQ,
            lowPage,
            movePage: 1,
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

export function InventoryMovementsTable({
  movements,
}: {
  movements: InventoryMovementItem[];
}) {
  if (movements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-base font-semibold text-zinc-950">No movements yet</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Stock changes will appear here as an audit trail.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3" scope="col">When</th>
              <th className="px-5 py-3" scope="col">Type</th>
              <th className="px-5 py-3" scope="col">SKU</th>
              <th className="px-5 py-3" scope="col">Product</th>
              <th className="px-5 py-3" scope="col">Location</th>
              <th className="px-5 py-3" scope="col">Qty</th>
              <th className="px-5 py-3" scope="col">Before</th>
              <th className="px-5 py-3" scope="col">After</th>
              <th className="px-5 py-3" scope="col">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {movements.map((movement) => (
              <tr className="align-top text-zinc-700" key={movement.id}>
                <td className="px-5 py-4 whitespace-nowrap">
                  {dateFormatter.format(new Date(movement.created_at))}
                </td>
                <td className="px-5 py-4 capitalize">{movement.movement_type}</td>
                <td className="px-5 py-4 font-medium text-zinc-950">{movement.sku}</td>
                <td className="px-5 py-4">{movement.productName}</td>
                <td className="px-5 py-4">
                  {movement.locationName}
                  {movement.toLocationName ? (
                    <p className="mt-1 text-xs text-zinc-500">
                      → {movement.toLocationName}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4">{movement.quantity}</td>
                <td className="px-5 py-4">{movement.quantity_before}</td>
                <td className="px-5 py-4">{movement.quantity_after}</td>
                <td className="px-5 py-4 max-w-xs">
                  {movement.notes ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
