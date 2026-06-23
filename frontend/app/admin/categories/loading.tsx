import { AdminPageHeader } from "@/src/components/admin/admin-page-header";

export default function CategoriesLoading() {
  return (
    <>
      <AdminPageHeader
        description="Organize HMART departments and subcategories for buyer browsing and product discovery."
        title="Categories"
      />
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
          <div className="mt-5 space-y-4">
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
            <div className="h-10 animate-pulse rounded bg-zinc-100" />
            <div className="h-24 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="h-10 animate-pulse rounded bg-zinc-100" />
          <div className="mt-5 space-y-3">
            <div className="h-16 animate-pulse rounded bg-zinc-100" />
            <div className="h-16 animate-pulse rounded bg-zinc-100" />
            <div className="h-16 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      </div>
    </>
  );
}
