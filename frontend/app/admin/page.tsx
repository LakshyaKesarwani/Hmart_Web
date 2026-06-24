import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import {
  LowStockProductsTable,
  QuickActionsPanel,
  RecentOrdersTable,
} from "@/src/components/admin/dashboard-tables";
import { adminMetrics } from "@/src/lib/admin/placeholder-data";

export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        description="A focused overview of HMART catalog health, order activity, revenue, and inventory exceptions."
        title="Dashboard"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {adminMetrics.map((metric) => (
          <article
            className="rounded-lg border border-zinc-200 bg-white p-5"
            key={metric.label}
          >
            <p className="text-sm font-medium text-zinc-500">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-zinc-600">{metric.detail}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <RecentOrdersTable />
        <LowStockProductsTable />
      </div>

      <div className="mt-6">
        <QuickActionsPanel />
      </div>
    </>
  );
}
