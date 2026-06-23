import Link from "next/link";
import type { ProductDetail } from "@/src/lib/admin/products";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 2,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function ProductDetailSummary({ product }: { product: ProductDetail }) {
  const baseVariant = product.variants[0];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Product Details
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {product.brand ?? "No brand assigned"}
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            href="/admin/products"
          >
            Back to products
          </Link>
        </div>

        {product.description ? (
          <p className="mt-5 max-w-3xl text-sm leading-6 text-zinc-600">
            {product.description}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Primary SKU</p>
          <p className="mt-3 text-lg font-semibold text-zinc-950">
            {baseVariant?.sku ?? "No SKU"}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Category</p>
          <p className="mt-3 text-lg font-semibold text-zinc-950">
            {product.categoryName}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Base Price</p>
          <p className="mt-3 text-lg font-semibold text-zinc-950">
            {baseVariant ? currencyFormatter.format(baseVariant.price) : "Not priced"}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Created</p>
          <p className="mt-3 text-lg font-semibold text-zinc-950">
            {dateFormatter.format(new Date(product.created_at))}
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-950">
            Variant Snapshot
          </h2>
        </div>
        {product.variants.length === 0 ? (
          <div className="p-5 text-sm text-zinc-600">
            No variants are attached to this product yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3" scope="col">SKU</th>
                  <th className="px-5 py-3" scope="col">Price</th>
                  <th className="px-5 py-3" scope="col">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {product.variants.map((variant) => (
                  <tr className="text-zinc-700" key={variant.id}>
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      {variant.sku}
                    </td>
                    <td className="px-5 py-4">
                      {currencyFormatter.format(variant.price)}
                    </td>
                    <td className="px-5 py-4">
                      {variant.is_active === false ? "Inactive" : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-950">
            Image Records
          </h2>
        </div>
        {product.images.length === 0 ? (
          <div className="p-5 text-sm text-zinc-600">
            No product image records are attached yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3" scope="col">Alt Text</th>
                  <th className="px-5 py-3" scope="col">Sort</th>
                  <th className="px-5 py-3" scope="col">Primary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {product.images.map((image) => (
                  <tr className="text-zinc-700" key={image.id}>
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      {image.alt_text ?? "No alt text"}
                    </td>
                    <td className="px-5 py-4">{image.sort_order}</td>
                    <td className="px-5 py-4">
                      {image.is_primary ? "Primary" : "Secondary"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
