import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/src/lib/auth/session";
import { getBuyerOrders } from "@/src/lib/orders/orders";
import { formatCurrency } from "@/src/lib/storefront/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders | HMART",
  description: "View your HMART order history.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function OrdersPage() {
  const user = await requireUser("/orders");
  const { orders, error } = await getBuyerOrders(user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Orders
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Track your HMART order history and review order details.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
          <h2 className="text-base font-semibold">Unable to load orders</h2>
          <p className="mt-2 text-sm leading-6">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-zinc-950">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            Orders you place from checkout will appear here.
          </p>
          <Link
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            href="/products"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3" scope="col">Order</th>
                  <th className="px-5 py-3" scope="col">Status</th>
                  <th className="px-5 py-3" scope="col">Total</th>
                  <th className="px-5 py-3" scope="col">Created</th>
                  <th className="px-5 py-3" scope="col">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orders.map((order) => (
                  <tr className="text-zinc-700" key={order.id}>
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      {formatCurrency(order.grandTotal)}
                    </td>
                    <td className="px-5 py-4">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <Link
                        className="font-medium text-zinc-950 underline"
                        href={`/orders/${order.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
