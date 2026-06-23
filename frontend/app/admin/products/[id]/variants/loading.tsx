import { AdminPageHeader } from "@/src/components/admin/admin-page-header";

export default function ProductVariantsLoading() {
  return (
    <>
      <AdminPageHeader
        description="Create, edit, activate, and manage product variants."
        title="Product Variants"
      />
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="h-6 w-36 animate-pulse rounded bg-zinc-100" />
          <div className="mt-5 space-y-3">
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="h-6 w-32 animate-pulse rounded bg-zinc-100" />
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="space-y-3">
              <div className="h-16 animate-pulse rounded bg-zinc-100" />
              <div className="h-16 animate-pulse rounded bg-zinc-100" />
              <div className="h-16 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
