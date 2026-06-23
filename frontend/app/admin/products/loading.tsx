import { AdminPageHeader } from "@/src/components/admin/admin-page-header";

export default function ProductsLoading() {
  return (
    <>
      <AdminPageHeader
        description="Browse HMART products, SKUs, categories, pricing, and product status."
        title="Products"
      />
      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="h-10 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded bg-zinc-100" />
            <div className="h-16 animate-pulse rounded bg-zinc-100" />
            <div className="h-16 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      </div>
    </>
  );
}
