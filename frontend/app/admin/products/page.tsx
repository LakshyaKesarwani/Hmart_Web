import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { ProductsPagination } from "@/src/components/admin/products/products-pagination";
import { ProductsSearch } from "@/src/components/admin/products/products-search";
import { ProductsTable } from "@/src/components/admin/products/products-table";
import {
  getProductCategoryOptions,
  getProducts,
} from "@/src/lib/admin/products";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
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

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const search = getSearchParam(params, "q").trim();
  const categoryId = getSearchParam(params, "category").trim();
  const page = getPageParam(getSearchParam(params, "page"));

  const [productList, categoryOptions] = await Promise.all([
    getProducts({ categoryId, page, search }),
    getProductCategoryOptions(),
  ]);

  return (
    <>
      <AdminPageHeader
        description="Browse HMART products, SKUs, categories, pricing, and product status."
        title="Products"
      />

      <section className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">
                Product Catalog
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {productList.totalCount} total products
              </p>
            </div>
            <ProductsSearch
              categories={categoryOptions.categories}
              categoryId={categoryId}
              search={search}
            />
          </div>
        </div>

        {productList.error || categoryOptions.error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
            <h2 className="text-base font-semibold">Unable to load products</h2>
            <p className="mt-2 text-sm leading-6">
              {productList.error ?? categoryOptions.error}
            </p>
          </div>
        ) : (
          <>
            <ProductsTable products={productList.products} />
            <ProductsPagination
              categoryId={categoryId}
              page={productList.page}
              pageSize={productList.pageSize}
              search={search}
              totalCount={productList.totalCount}
            />
          </>
        )}
      </section>
    </>
  );
}
