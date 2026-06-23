import type { CategoryOption, CategoryRow } from "@/src/lib/admin/categories";
import { CategoryDeleteForm } from "./category-delete-form";
import { CategoryForm } from "./category-form";

export function CategoriesTable({
  categories,
  parentOptions,
}: {
  categories: CategoryRow[];
  parentOptions: CategoryOption[];
}) {
  const parentNameById = new Map(
    parentOptions.map((category) => [category.id, category.name]),
  );

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-base font-semibold text-zinc-950">
          No categories found
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Create a category or adjust the current search.
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
              <th className="px-5 py-3" scope="col">Category</th>
              <th className="px-5 py-3" scope="col">Parent</th>
              <th className="px-5 py-3" scope="col">Sort</th>
              <th className="px-5 py-3" scope="col">Status</th>
              <th className="px-5 py-3" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {categories.map((category) => (
              <tr className="align-top text-zinc-700" key={category.id}>
                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-950">{category.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">{category.slug}</p>
                  {category.description ? (
                    <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                      {category.description}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  {category.parent_id
                    ? (parentNameById.get(category.parent_id) ?? "Unknown")
                    : "Root"}
                </td>
                <td className="px-5 py-4">{category.sort_order}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      category.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="w-72 px-5 py-4">
                  <details className="group rounded-md border border-zinc-200">
                    <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-zinc-950">
                      Manage
                    </summary>
                    <div className="space-y-5 border-t border-zinc-200 p-3">
                      <CategoryForm
                        category={category}
                        mode="edit"
                        parentOptions={parentOptions}
                      />
                      <div className="border-t border-zinc-200 pt-4">
                        <CategoryDeleteForm
                          categoryId={category.id}
                          categoryName={category.name}
                        />
                      </div>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
