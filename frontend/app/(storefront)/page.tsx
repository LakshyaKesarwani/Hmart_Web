import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCards } from "@/src/components/storefront/category-cards";
import { ProductGrid } from "@/src/components/storefront/product-card";
import { StorefrontEmptyState } from "@/src/components/storefront/product-card";
import { getFeaturedCategories } from "@/src/lib/storefront/categories";
import { getFeaturedProducts } from "@/src/lib/storefront/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HMART | Shop Groceries & Essentials",
  description:
    "Browse HMART categories and discover everyday groceries, household essentials, and featured products.",
  openGraph: {
    title: "HMART | Shop Groceries & Essentials",
    description:
      "Browse HMART categories and discover everyday groceries, household essentials, and featured products.",
    type: "website",
  },
};

export default async function HomePage() {
  const [featuredCategories, featuredProducts] = await Promise.all([
    getFeaturedCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="overflow-hidden rounded-lg bg-zinc-950 text-white">
        <div className="grid min-h-[420px] gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-center lg:px-14 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-400">
              Grocery and essentials
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Shop daily essentials without the detour
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Browse groceries, household supplies, pantry staples, safety gear,
              and office essentials from one clean HMART catalog.
            </p>
            <form action="/products" className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                className="h-12 flex-1 rounded-md border border-white/15 bg-white px-4 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-white"
                name="q"
                placeholder="Search products, brands, or SKUs"
                type="search"
              />
              <button
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
                type="submit"
              >
                Search catalog
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Housekeeping", "Pantry", "Stationery", "Safety"].map((item) => (
                <Link
                  className="rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white hover:text-zinc-950"
                  href={`/products?q=${encodeURIComponent(item)}`}
                  key={item}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <div className="grid gap-3">
              {[
                ["Fresh picks", "Groceries and pantry items"],
                ["Workplace ready", "Office and housekeeping supplies"],
                ["Stock aware", "Availability checked from inventory"],
              ].map(([title, description]) => (
                <div className="rounded-md bg-white px-4 py-4 text-zinc-950" key={title}>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-zinc-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 sm:mt-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              Featured categories
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Explore popular departments across the store.
            </p>
          </div>
          <Link
            className="w-fit text-sm font-medium text-zinc-950 underline"
            href="/products"
          >
            View all products
          </Link>
        </div>

        {featuredCategories.error ? (
          <p className="text-sm text-red-700">{featuredCategories.error}</p>
        ) : featuredCategories.categories.length === 0 ? (
          <StorefrontEmptyState
            description="Categories will appear here once they are published in the catalog."
            title="No categories yet"
          />
        ) : (
          <CategoryCards categories={featuredCategories.categories} />
        )}
      </section>

      <section className="mt-12 sm:mt-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              Featured products
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Recently added items with current pricing and stock visibility.
            </p>
          </div>
          <Link
            className="w-fit text-sm font-medium text-zinc-950 underline"
            href="/products"
          >
            Browse catalog
          </Link>
        </div>

        {featuredProducts.error ? (
          <p className="text-sm text-red-700">{featuredProducts.error}</p>
        ) : featuredProducts.products.length === 0 ? (
          <StorefrontEmptyState
            description="Active products will appear here once they are published."
            title="No products yet"
          />
        ) : (
          <ProductGrid products={featuredProducts.products} />
        )}
      </section>
    </div>
  );
}
