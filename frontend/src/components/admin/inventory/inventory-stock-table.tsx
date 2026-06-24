import type {
  InventoryLocationOption,
  InventoryStockItem,
} from "@/src/lib/admin/inventory";

export function InventoryStockTable({ stock }: { stock: InventoryStockItem[] }) {
  if (stock.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-base font-semibold text-zinc-950">No stock records</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Add stock or adjust filters to view inventory by variant.
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
              <th className="px-5 py-3" scope="col">SKU</th>
              <th className="px-5 py-3" scope="col">Product</th>
              <th className="px-5 py-3" scope="col">Location</th>
              <th className="px-5 py-3" scope="col">On hand</th>
              <th className="px-5 py-3" scope="col">Reserved</th>
              <th className="px-5 py-3" scope="col">Available</th>
              <th className="px-5 py-3" scope="col">Threshold</th>
              <th className="px-5 py-3" scope="col">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {stock.map((item) => (
              <tr className="text-zinc-700" key={item.id}>
                <td className="px-5 py-4 font-medium text-zinc-950">{item.sku}</td>
                <td className="px-5 py-4">{item.productName}</td>
                <td className="px-5 py-4">
                  {item.locationName}
                  <p className="mt-1 text-xs text-zinc-500">{item.locationCode}</p>
                </td>
                <td className="px-5 py-4">{item.quantity_on_hand}</td>
                <td className="px-5 py-4">{item.quantity_reserved}</td>
                <td className="px-5 py-4">{item.availableQuantity}</td>
                <td className="px-5 py-4">{item.reorder_level}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.isLowStock
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.isLowStock ? "Low stock" : "OK"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InventoryLowStockTable({ items }: { items: InventoryStockItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
        <h2 className="text-base font-semibold">All stock levels healthy</h2>
        <p className="mt-2 text-sm leading-6">
          No variants are currently below their reorder threshold.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-amber-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-amber-50 text-left text-xs font-semibold uppercase tracking-wide text-amber-800">
            <tr>
              <th className="px-5 py-3" scope="col">SKU</th>
              <th className="px-5 py-3" scope="col">Product</th>
              <th className="px-5 py-3" scope="col">Location</th>
              <th className="px-5 py-3" scope="col">On hand</th>
              <th className="px-5 py-3" scope="col">Threshold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {items.map((item) => (
              <tr className="text-zinc-700" key={item.id}>
                <td className="px-5 py-4 font-medium text-zinc-950">{item.sku}</td>
                <td className="px-5 py-4">{item.productName}</td>
                <td className="px-5 py-4">{item.locationName}</td>
                <td className="px-5 py-4">{item.quantity_on_hand}</td>
                <td className="px-5 py-4">{item.reorder_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InventoryStockFilters({
  locPage,
  locQ,
  locations,
  lowPage,
  movePage,
  moveType,
  stockLocation,
  stockQ,
}: {
  locPage: number;
  locQ: string;
  locations: InventoryLocationOption[];
  lowPage: number;
  movePage: number;
  moveType: string;
  stockLocation: string;
  stockPage: number;
  stockQ: string;
}) {
  return (
    <form action="/admin/inventory" className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <input name="locQ" type="hidden" value={locQ} />
      <input name="locPage" type="hidden" value={locPage > 1 ? locPage : ""} />
      <input name="moveType" type="hidden" value={moveType} />
      <input name="movePage" type="hidden" value={movePage > 1 ? movePage : ""} />
      <input name="lowPage" type="hidden" value={lowPage > 1 ? lowPage : ""} />
      <label className="block flex-1">
        <span className="text-sm font-medium text-zinc-800">Search SKU</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={stockQ}
          name="stockQ"
          placeholder="Filter by SKU"
          type="search"
        />
      </label>
      <label className="block w-full lg:w-56">
        <span className="text-sm font-medium text-zinc-800">Location</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={stockLocation}
          name="stockLocation"
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>
      <button
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"
        type="submit"
      >
        Apply
      </button>
    </form>
  );
}
