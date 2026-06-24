import Link from "next/link";
import { formatPriceRange } from "@/src/lib/storefront/format";
import type { StorefrontProductCard } from "@/src/lib/storefront/types";

export function StorefrontEmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-green-200 bg-green-50/50 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-100 text-base font-bold text-green-700">
        HM
      </div>
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
        {description}
      </p>
      <Link
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        href="/products"
      >
        Browse products
      </Link>
    </div>
  );
}

export function ProductCard({ product }: { product: StorefrontProductCard }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-md hover:scale-[1.02]">
      <Link className="block" href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={product.imageAlt ?? product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={product.imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-700 to-emerald-800 text-sm font-medium text-white/30">
              No image
            </div>
          )}
          {!product.inStock ? (
            <span className="absolute left-3 top-3 rounded-full bg-zinc-900/85 px-2.5 py-1 text-xs font-semibold text-white">
              Out of stock
            </span>
          ) : null}
        </div>

        <div className="space-y-1.5 p-4">
          {product.brand ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              {product.brand}
            </p>
          ) : null}
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-950">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-500">{product.categoryName}</p>
          <p className="text-sm font-bold text-zinc-950">
            {formatPriceRange(product.minPrice, product.maxPrice)}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({ products }: { products: StorefrontProductCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
