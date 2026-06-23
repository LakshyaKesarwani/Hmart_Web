import type { InventoryLocationRow } from "@/src/lib/admin/inventory";
import { InventoryLocationDeleteForm } from "./inventory-location-delete-form";
import { InventoryLocationForm } from "./inventory-location-form";

export function InventoryLocationsTable({
  locations,
}: {
  locations: InventoryLocationRow[];
}) {
  if (locations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-base font-semibold text-zinc-950">No locations yet</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Create a warehouse or store location to begin tracking stock.
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
              <th className="px-5 py-3" scope="col">Location</th>
              <th className="px-5 py-3" scope="col">Code</th>
              <th className="px-5 py-3" scope="col">Status</th>
              <th className="px-5 py-3" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {locations.map((location) => (
              <tr className="align-top text-zinc-700" key={location.id}>
                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-950">{location.name}</p>
                  {location.description ? (
                    <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                      {location.description}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4">{location.code}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      location.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {location.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="w-72 px-5 py-4">
                  <details className="group rounded-md border border-zinc-200">
                    <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-zinc-950">
                      Manage
                    </summary>
                    <div className="space-y-5 border-t border-zinc-200 p-3">
                      <InventoryLocationForm location={location} mode="edit" />
                      <div className="border-t border-zinc-200 pt-4">
                        <InventoryLocationDeleteForm
                          locationId={location.id}
                          locationName={location.name}
                        />
                      </div>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
