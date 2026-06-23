import type { ProductVariantRecord } from "@/src/lib/admin/product-variants";
import { ProductVariantActiveForm } from "./product-variant-active-form";
import { ProductVariantDeleteForm } from "./product-variant-delete-form";
import { ProductVariantForm } from "./product-variant-form";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 2,
  style: "currency",
});

export function ProductVariantsTable({
  productId,
  variants,
}: {
  productId: string;
  variants: ProductVariantRecord[];
}) {
  if (variants.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-base font-semibold text-zinc-950">No variants yet</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Create the first variant using SKU, price, unit, and active status.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3" scope="col">SKU</th>
              <th className="px-5 py-3" scope="col">Price</th>
              <th className="px-5 py-3" scope="col">Unit</th>
              <th className="px-5 py-3" scope="col">Status</th>
              <th className="px-5 py-3" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {variants.map((variant) => {
              const isActive = variant.is_active !== false;

              return (
                <tr className="align-top text-zinc-700" key={variant.id}>
                  <td className="px-5 py-4 font-medium text-zinc-950">
                    {variant.sku}
                  </td>
                  <td className="px-5 py-4">
                    {currencyFormatter.format(variant.price)}
                  </td>
                  <td className="px-5 py-4">{variant.unit ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="w-80 px-5 py-4">
                    <details className="group rounded-md border border-zinc-200">
                      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-zinc-950">
                        Manage
                      </summary>
                      <div className="space-y-5 border-t border-zinc-200 p-3">
                        <ProductVariantActiveForm
                          isActive={isActive}
                          productId={productId}
                          variantId={variant.id}
                        />
                        <div className="border-t border-zinc-200 pt-4">
                          <ProductVariantForm
                            mode="edit"
                            productId={productId}
                            variant={variant}
                          />
                        </div>
                        <div className="border-t border-zinc-200 pt-4">
                          <ProductVariantDeleteForm
                            productId={productId}
                            sku={variant.sku}
                            variantId={variant.id}
                          />
                        </div>
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
