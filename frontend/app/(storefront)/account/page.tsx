import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/src/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account | HMART",
  description: "View your HMART account profile.",
};

export default async function AccountPage() {
  const user = await requireUser("/account");
  const displayName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "HMART Buyer";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Account
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Review your signed-in HMART profile and continue shopping.
        </p>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-zinc-500">Name</dt>
            <dd className="mt-1 text-base font-semibold text-zinc-950">
              {displayName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-500">Email</dt>
            <dd className="mt-1 text-base font-semibold text-zinc-950">
              {user.email ?? "Not available"}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            href="/orders"
          >
            View orders
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            href="/products"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
