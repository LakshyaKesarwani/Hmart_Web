import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { ProductVariantForm } from "@/src/components/admin/products/product-variant-form";
import { ProductVariantsTable } from "@/src/components/admin/products/product-variants-table";
import { getProductVariantPageContext } from "@/src/lib/admin/product-variants";

export const dynamic = "force-dynamic";

type ProductVariantsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductVariantsPage({
  params,
}: ProductVariantsPageProps) {
  const { id } = await params;
  const context = await getProductVariantPageContext(id);

  if (context.error) {
    return (
      <>
        <AdminPageHeader
          description="Create, edit, activate, and manage product variants."
          title="Product Variants"
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
          <h2 className="text-base font-semibold">Unable to load variants</h2>
          <p className="mt-2 text-sm leading-6">{context.error}</p>
        </div>
      </>
    );
  }

  if (!context.productName) {
    notFound();
  }

  const activeCount = context.variants.filter(
    (variant) => variant.is_active !== false,
  ).length;

  return (
    <>
      <AdminPageHeader
        description="Create, edit, activate, and manage product variants."
        title="Product Variants"
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            {context.productName}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {context.variants.length}{" "}
            {context.variants.length === 1 ? "variant" : "variants"} ·{" "}
            {activeCount} active
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            href={`/admin/products/${id}`}
          >
            Back to product
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            href="/admin/products"
          >
            All products
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Create Variant</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Add another purchasable SKU with its own price and unit.
          </p>
          <div className="mt-5">
            <ProductVariantForm mode="create" productId={id} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-950">Variant List</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Review variants and manage SKU details, pricing, and availability.
            </p>
          </div>
          <ProductVariantsTable productId={id} variants={context.variants} />
        </section>
      </div>
    </>
  );
}
