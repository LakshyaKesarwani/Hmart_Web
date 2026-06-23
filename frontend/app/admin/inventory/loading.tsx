import { AdminPageHeader } from "@/src/components/admin/admin-page-header";

export default function InventoryLoading() {
  return (
    <>
      <AdminPageHeader
        description="Manage warehouse locations, stock levels, transfers, and inventory audit history."
        title="Inventory"
      />
      <div className="space-y-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="h-6 w-48 animate-pulse rounded bg-zinc-100" />
          <div className="mt-4 h-24 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="h-6 w-36 animate-pulse rounded bg-zinc-100" />
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="space-y-3">
              <div className="h-16 animate-pulse rounded bg-zinc-100" />
              <div className="h-16 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
