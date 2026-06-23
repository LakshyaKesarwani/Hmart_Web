import { AdminPageHeader } from "@/src/components/admin/admin-page-header";

export default function ProductImagesLoading() {
  return (
    <>
      <AdminPageHeader
        description="Upload, preview, reorder, and manage product images."
        title="Product Images"
      />
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="h-6 w-32 animate-pulse rounded bg-zinc-100" />
          <div className="mt-5 space-y-3">
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="h-6 w-40 animate-pulse rounded bg-zinc-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="aspect-square animate-pulse rounded-lg bg-zinc-100" />
            <div className="aspect-square animate-pulse rounded-lg bg-zinc-100" />
            <div className="aspect-square animate-pulse rounded-lg bg-zinc-100" />
          </div>
        </div>
      </div>
    </>
  );
}
