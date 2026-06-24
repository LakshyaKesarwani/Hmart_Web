"use client";

import { useActionState } from "react";
import {
  createCategoryAction,
  initialCategoryActionState,
  updateCategoryAction,
} from "@/src/lib/admin/category-actions";
import type { CategoryOption, CategoryRow } from "@/src/lib/admin/categories";
import { CategoryActionMessage } from "./category-action-message";
import { CategorySubmitButton } from "./category-submit-button";

type CategoryFormProps = {
  mode: "create" | "edit";
  category?: CategoryRow;
  parentOptions: CategoryOption[];
};

export function CategoryForm({
  mode,
  category,
  parentOptions,
}: CategoryFormProps) {
  const action = mode === "create" ? createCategoryAction : updateCategoryAction;
  const [state, formAction] = useActionState(action, initialCategoryActionState);
  const submitLabel = mode === "create" ? "Create category" : "Save changes";

  return (
    <form action={formAction} className="space-y-4">
      <CategoryActionMessage state={state} />
      {category ? <input name="id" type="hidden" value={category.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Name</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={category?.name}
            maxLength={120}
            minLength={2}
            name="name"
            required
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Slug</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={category?.slug}
            name="slug"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="auto-generated if blank"
            type="text"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Description</span>
        <textarea
          className="mt-2 min-h-24 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={category?.description ?? ""}
          maxLength={500}
          name="description"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Image URL</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={category?.image_url ?? ""}
          maxLength={2000}
          name="imageUrl"
          placeholder="https://example.com/category.jpg"
          type="url"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">
            Parent category
          </span>
          <select
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={category?.parent_id ?? ""}
            name="parentId"
          >
            <option value="">No parent</option>
            {parentOptions
              .filter((option) => option.id !== category?.id)
              .map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Sort order</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={category?.sort_order ?? 0}
            max={100000}
            min={0}
            name="sortOrder"
            type="number"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-zinc-800">
        <input
          className="size-4 rounded border-zinc-300"
          defaultChecked={category?.is_active ?? true}
          name="isActive"
          type="checkbox"
        />
        Active category
      </label>

      <CategorySubmitButton
        label={submitLabel}
        pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
      />
    </form>
  );
}
