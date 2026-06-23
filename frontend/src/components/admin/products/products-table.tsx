import Link from "next/link";
import type { ProductListItem } from "@/src/lib/admin/products";

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

function formatPrice(value: number | null) {
  return value === null ? "Not priced" : currencyFormatter.format(value);
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function ProductsTable({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-base font-semibold text-zinc-950">
          No products found
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Adjust the search or category filter to find products.
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
              <th className="px-5 py-3" scope="col">Product</th>
              <th className="px-5 py-3" scope="col">SKU</th>
              <th className="px-5 py-3" scope="col">Category</th>
              <th className="px-5 py-3" scope="col">Status</th>
              <th className="px-5 py-3" scope="col">Base price</th>
              <th className="px-5 py-3" scope="col">Created</th>
              <th className="px-5 py-3" scope="col">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {products.map((product) => (
              <tr className="text-zinc-700" key={product.id}>
                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-950">{product.name}</p>
                  {product.brand ? (
                    <p className="mt-1 text-xs text-zinc-500">{product.brand}</p>
                  ) : null}
                </td>
                <td className="px-5 py-4">{product.sku}</td>
                <td className="px-5 py-4">{product.categoryName}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-5 py-4">{formatPrice(product.basePrice)}</td>
                <td className="px-5 py-4">{formatDate(product.created_at)}</td>
                <td className="px-5 py-4">
                  <Link
                    className="font-medium text-zinc-950 underline"
                    href={`/admin/products/${product.id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
