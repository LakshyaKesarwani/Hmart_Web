import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { InventoryLocationForm } from "@/src/components/admin/inventory/inventory-location-form";
import { InventoryLocationsPagination } from "@/src/components/admin/inventory/inventory-locations-pagination";
import { InventoryLocationsSearch } from "@/src/components/admin/inventory/inventory-locations-search";
import { InventoryLocationsTable } from "@/src/components/admin/inventory/inventory-locations-table";
import {
  InventoryMovementsFilter,
  InventoryMovementsTable,
} from "@/src/components/admin/inventory/inventory-movements-table";
import {
  InventoryLowStockPagination,
  InventoryMovementsPagination,
  InventoryStockPagination,
} from "@/src/components/admin/inventory/inventory-pagination";
import {
  InventoryAddStockForm,
  InventoryAdjustStockForm,
  InventoryRemoveStockForm,
  InventoryTransferStockForm,
} from "@/src/components/admin/inventory/inventory-stock-forms";
import {
  InventoryLowStockTable,
  InventoryStockFilters,
  InventoryStockTable,
} from "@/src/components/admin/inventory/inventory-stock-table";
import {
  getInventoryLocationOptions,
  getInventoryLocations,
  getInventoryMovements,
  getInventoryStock,
  getInventoryVariantOptions,
  getLowStockItems,
} from "@/src/lib/admin/inventory";

export const dynamic = "force-dynamic";

type InventoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getPageParam(value: string) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function AdminInventoryPage({
  searchParams,
}: InventoryPageProps) {
  const params = await searchParams;
  const locQ = getSearchParam(params, "locQ").trim();
  const stockQ = getSearchParam(params, "stockQ").trim();
  const stockLocation = getSearchParam(params, "stockLocation").trim();
  const moveType = getSearchParam(params, "moveType").trim();
  const locPage = getPageParam(getSearchParam(params, "locPage"));
  const stockPage = getPageParam(getSearchParam(params, "stockPage"));
  const movePage = getPageParam(getSearchParam(params, "movePage"));
  const lowPage = getPageParam(getSearchParam(params, "lowPage"));

  const queryState = {
    locPage,
    locQ,
    lowPage,
    movePage,
    moveType,
    stockLocation,
    stockPage,
    stockQ,
  };

  const [
    locationList,
    locationOptions,
    variantOptions,
    stockList,
    movementList,
    lowStockList,
  ] = await Promise.all([
    getInventoryLocations({ page: locPage, search: locQ }),
    getInventoryLocationOptions(),
    getInventoryVariantOptions(),
    getInventoryStock({ page: stockPage, search: stockQ, locationId: stockLocation }),
    getInventoryMovements({ page: movePage, movementType: moveType }),
    getLowStockItems({ page: lowPage }),
  ]);

  const loadError =
    locationList.error ??
    locationOptions.error ??
    variantOptions.error ??
    stockList.error ??
    movementList.error ??
    lowStockList.error;

  return (
    <>
      <AdminPageHeader
        description="Manage warehouse locations, stock levels, transfers, and inventory audit history."
        title="Inventory"
      />

      {loadError ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
          <h2 className="text-base font-semibold">Unable to load inventory</h2>
          <p className="mt-2 text-sm leading-6">{loadError}</p>
        </div>
      ) : null}

      <section className="mb-8 space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Low Stock Dashboard</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Variants at or below their reorder threshold across all locations.
          </p>
        </div>
        <InventoryLowStockTable items={lowStockList.items} />
        <InventoryLowStockPagination
          locPage={locPage}
          locQ={locQ}
          movePage={movePage}
          moveType={moveType}
          page={lowStockList.page}
          pageSize={lowStockList.pageSize}
          stockLocation={stockLocation}
          stockPage={stockPage}
          stockQ={stockQ}
          totalCount={lowStockList.totalCount}
        />
      </section>

      <section className="mb-8 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Create Location</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Add a warehouse or store used for stock tracking.
          </p>
          <div className="mt-5">
            <InventoryLocationForm mode="create" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-950">
                  Inventory Locations
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  {locationList.totalCount} total locations
                </p>
              </div>
              <InventoryLocationsSearch {...queryState} />
            </div>
          </div>
          <InventoryLocationsTable locations={locationList.locations} />
          <InventoryLocationsPagination
            locPage={locPage}
            locQ={locQ}
            lowPage={lowPage}
            movePage={movePage}
            moveType={moveType}
            pageSize={locationList.pageSize}
            stockLocation={stockLocation}
            stockPage={stockPage}
            stockQ={stockQ}
            totalCount={locationList.totalCount}
          />
        </div>
      </section>

      <section className="mb-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Add Stock</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Record incoming inventory at a location.
          </p>
          <div className="mt-5">
            {locationOptions.locations.length === 0 || variantOptions.variants.length === 0 ? (
              <p className="text-sm text-zinc-600">
                Create locations and product variants before adding stock.
              </p>
            ) : (
              <InventoryAddStockForm
                locations={locationOptions.locations}
                variants={variantOptions.variants}
              />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Remove Stock</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Record outgoing inventory from a location.
          </p>
          <div className="mt-5">
            {locationOptions.locations.length === 0 || variantOptions.variants.length === 0 ? (
              <p className="text-sm text-zinc-600">
                Create locations and product variants before removing stock.
              </p>
            ) : (
              <InventoryRemoveStockForm
                locations={locationOptions.locations}
                variants={variantOptions.variants}
              />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Transfer Stock</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Move units between two active locations.
          </p>
          <div className="mt-5">
            {locationOptions.locations.length < 2 || variantOptions.variants.length === 0 ? (
              <p className="text-sm text-zinc-600">
                At least two locations and one variant are required for transfers.
              </p>
            ) : (
              <InventoryTransferStockForm
                locations={locationOptions.locations}
                variants={variantOptions.variants}
              />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Adjust Stock</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Correct on-hand counts with an audited adjustment entry.
          </p>
          <div className="mt-5">
            {locationOptions.locations.length === 0 || variantOptions.variants.length === 0 ? (
              <p className="text-sm text-zinc-600">
                Create locations and product variants before adjusting stock.
              </p>
            ) : (
              <InventoryAdjustStockForm
                locations={locationOptions.locations}
                variants={variantOptions.variants}
              />
            )}
          </div>
        </div>
      </section>

      <section className="mb-8 space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">Stock by Variant</h2>
              <p className="mt-1 text-sm text-zinc-600">
                {stockList.totalCount} stock records
              </p>
            </div>
            <InventoryStockFilters
              {...queryState}
              locations={locationOptions.locations}
            />
          </div>
        </div>
        <InventoryStockTable stock={stockList.stock} />
        <InventoryStockPagination
          locPage={locPage}
          locQ={locQ}
          lowPage={lowPage}
          movePage={movePage}
          moveType={moveType}
          page={stockList.page}
          pageSize={stockList.pageSize}
          stockLocation={stockLocation}
          stockQ={stockQ}
          totalCount={stockList.totalCount}
        />
      </section>

      <section className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">
                Movement History
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {movementList.totalCount} audit entries
              </p>
            </div>
            <InventoryMovementsFilter {...queryState} />
          </div>
        </div>
        <InventoryMovementsTable movements={movementList.movements} />
        <InventoryMovementsPagination
          locPage={locPage}
          locQ={locQ}
          lowPage={lowPage}
          moveType={moveType}
          page={movementList.page}
          pageSize={movementList.pageSize}
          stockLocation={stockLocation}
          stockPage={stockPage}
          stockQ={stockQ}
          totalCount={movementList.totalCount}
        />
      </section>
    </>
  );
}
