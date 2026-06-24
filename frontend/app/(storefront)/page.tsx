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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-emerald-600 to-teal-700 shadow-xl">
        <div className="relative px-8 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          {/* Decorative organic blobs */}
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 -translate-y-1/3 translate-x-1/4 rounded-full bg-green-400/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 translate-y-1/3 -translate-x-1/4 rounded-full bg-teal-800/15 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-green-100">
              Groceries &amp; Essentials
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Everything you need,{" "}
              <span className="text-amber-300">all in one place</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-green-100 sm:text-lg">
              Groceries, household supplies, pantry staples, and office essentials — curated and stocked, ready for you.
            </p>

            <form action="/products" className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/15 px-6 text-sm text-white outline-none placeholder:text-green-200/60 focus:border-white/40 focus:bg-white/20 transition-all"
                name="q"
                placeholder="Search products, brands, or SKUs…"
                type="search"
              />
              <button
                className="inline-flex h-12 items-center justify-center rounded-full bg-amber-500 px-7 text-sm font-bold text-white transition-colors hover:bg-amber-400"
                type="submit"
              >
                Search catalog
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Housekeeping", "Pantry", "Stationery", "Safety"].map((item) => (
                <Link
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-green-100 transition-colors hover:bg-white/20 hover:text-white"
                  href={`/products?q=${encodeURIComponent(item)}`}
                  key={item}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Feature cards */}
          <div className="relative mt-12 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:absolute lg:right-16 lg:top-1/2 lg:-translate-y-1/2 lg:w-60 lg:grid-cols-1">
            {[
              { icon: "🛒", title: "Fresh picks", desc: "Groceries & pantry" },
              { icon: "🏢", title: "Workplace ready", desc: "Office & housekeeping" },
              { icon: "📦", title: "Stock aware", desc: "Live inventory checked" },
            ].map(({ icon, title, desc }) => (
              <div
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm"
                key={title}
              >
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-green-200/70">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 w-full text-stone-50" preserveAspectRatio="none" viewBox="0 0 1440 60">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Featured categories */}
      <section className="mt-14 sm:mt-16">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              Departments
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              Featured categories
            </h2>
            <p className="mt-1.5 max-w-lg text-sm leading-6 text-zinc-500">
              Explore popular departments across the store.
            </p>
          </div>
          <Link
            className="w-fit text-sm font-semibold text-green-700 underline-offset-2 hover:underline"
            href="/products"
          >
            View all products →
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

      {/* Featured products */}
      <section className="mt-14 sm:mt-16">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              New arrivals
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              Featured products
            </h2>
            <p className="mt-1.5 max-w-lg text-sm leading-6 text-zinc-500">
              Recently added items with current pricing and stock visibility.
            </p>
          </div>
          <Link
            className="w-fit text-sm font-semibold text-green-700 underline-offset-2 hover:underline"
            href="/products"
          >
            Browse catalog →
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

      {/* CTA Banner */}
      <section className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-green-900 px-8 py-10 text-center shadow-lg sm:py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-green-300/60">
          HMART Store
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Ready to stock up?
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-green-200/70">
          Thousands of products across groceries, housekeeping, stationery, and safety essentials.
        </p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-amber-500 px-8 text-sm font-bold text-white transition-colors hover:bg-amber-400"
          href="/products"
        >
          Shop now
        </Link>
      </section>
    </div>
  );
}
