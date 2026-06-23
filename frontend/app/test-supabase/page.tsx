import { Suspense } from "react";
import { createClient } from "@/src/lib/supabase/server";

type Category = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  is_active: boolean | null;
  sort_order: number | null;
};

async function CategoriesList() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, is_active, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .returns<Category[]>();

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
        <h2 className="text-base font-semibold">Supabase connection failed</h2>
        <p className="mt-2 text-sm leading-6">{error.message}</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-5 text-zinc-700">
        <h2 className="text-base font-semibold text-zinc-950">
          Connected to Supabase
        </h2>
        <p className="mt-2 text-sm leading-6">
          The categories table is reachable, but no categories were found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Categories from Supabase
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Showing {data.length} {data.length === 1 ? "category" : "categories"}.
        </p>
      </div>
      <ul className="divide-y divide-zinc-200">
        {data.map((category) => (
          <li key={category.id} className="px-5 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-medium text-zinc-950">{category.name}</h3>
                {category.description ? (
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {category.description}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs text-zinc-500">
                {category.slug ? <span>{category.slug}</span> : null}
                <span>{category.is_active === false ? "Inactive" : "Active"}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoriesLoading() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
      <div className="mt-4 space-y-3">
        <div className="h-4 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}

export default function TestSupabasePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            HMART database check
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Supabase connectivity
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            This page verifies that the Next.js App Router can connect to
            Supabase and read the categories table.
          </p>
        </header>

        <Suspense fallback={<CategoriesLoading />}>
          <CategoriesList />
        </Suspense>
      </div>
    </main>
  );
}
