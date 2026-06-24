import Link from "next/link";
import { LogoutButton } from "@/src/components/auth/logout-button";
import type { StorefrontCategory } from "@/src/lib/storefront/types";

export function StorefrontHeader({
  categories,
  userEmail,
}: {
  categories: StorefrontCategory[];
  userEmail: string | null;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link className="flex flex-col" href="/">
            <span className="text-xl font-semibold tracking-tight text-zinc-950">
              HMART
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Shop essentials
            </span>
          </Link>

          <form action="/products" className="flex w-full gap-2 lg:mx-6 lg:max-w-xl">
            <label className="flex-1">
              <span className="sr-only">Search products</span>
              <input
                className="h-11 w-full rounded-md border border-zinc-300 px-4 text-sm outline-none transition-colors focus:border-zinc-950"
                name="q"
                placeholder="Search products, brands, or SKUs"
                type="search"
              />
            </label>
            <button
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              type="submit"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              href="/products"
            >
              Shop all
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              href="/cart"
            >
              Cart
            </Link>
            {userEmail ? (
              <>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  href="/account"
                >
                  Account
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  href="/orders"
                >
                  Orders
                </Link>
                <LogoutButton
                  className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                  label="Logout"
                />
              </>
            ) : (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                href="/login"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {categories.length > 0 ? (
          <nav
            aria-label="Categories"
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Link
              className="inline-flex shrink-0 items-center rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200"
              href="/products"
            >
              All products
            </Link>
            {categories.map((category) => (
              <Link
                className="inline-flex shrink-0 items-center rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950"
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                key={category.id}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}

export function StorefrontFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold tracking-tight">HMART</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Your neighborhood store for groceries, household essentials, and
            everyday needs.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-300">
          <Link className="transition-colors hover:text-white" href="/products">
            Products
          </Link>
          <Link className="transition-colors hover:text-white" href="/cart">
            Cart
          </Link>
          <Link className="transition-colors hover:text-white" href="/login">
            Sign in
          </Link>
          <Link className="transition-colors hover:text-white" href="/signup">
            Create account
          </Link>
        </div>
      </div>
    </footer>
  );
}
