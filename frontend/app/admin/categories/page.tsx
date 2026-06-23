import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { CategoriesPagination } from "@/src/components/admin/categories/categories-pagination";
import { CategoriesSearch } from "@/src/components/admin/categories/categories-search";
import { CategoriesTable } from "@/src/components/admin/categories/categories-table";
import { CategoryForm } from "@/src/components/admin/categories/category-form";
import {
  getCategories,
  getCategoryOptions,
} from "@/src/lib/admin/categories";

export const dynamic = "force-dynamic";

type CategoriesPageProps = {
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

export default async function AdminCategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;
  const search = getSearchParam(params, "q").trim();
  const page = getPageParam(getSearchParam(params, "page"));

  const [categoryList, parentOptions] = await Promise.all([
    getCategories({ page, search }),
    getCategoryOptions(),
  ]);

  return (
    <>
      <AdminPageHeader
        description="Create, organize, search, and maintain HMART departments and subcategories."
        title="Categories"
      />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">
            Create Category
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Add a root category or assign it under an existing parent.
          </p>
          <div className="mt-5">
            <CategoryForm
              mode="create"
              parentOptions={parentOptions.categories}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-950">
                  Category List
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  {categoryList.totalCount} total categories
                </p>
              </div>
              <CategoriesSearch search={search} />
            </div>
          </div>

          {categoryList.error || parentOptions.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
              <h2 className="text-base font-semibold">
                Unable to load categories
              </h2>
              <p className="mt-2 text-sm leading-6">
                {categoryList.error ?? parentOptions.error}
              </p>
            </div>
          ) : (
            <>
              <CategoriesTable
                categories={categoryList.categories}
                parentOptions={parentOptions.categories}
              />
              <CategoriesPagination
                page={categoryList.page}
                pageSize={categoryList.pageSize}
                search={search}
                totalCount={categoryList.totalCount}
              />
            </>
          )}
        </section>
      </div>
    </>
  );
}
