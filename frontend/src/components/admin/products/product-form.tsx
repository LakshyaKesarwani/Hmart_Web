"use client";

import { useActionState } from "react";
import {
  createProductAction,
  initialProductActionState,
  PRODUCT_STATUS_OPTIONS,
  updateProductAction,
} from "@/src/lib/admin/product-actions";
import type {
  ProductCategoryOption,
  ProductDetail,
  ProductListItem,
} from "@/src/lib/admin/products";
import { ProductActionMessage } from "./product-action-message";
import { ProductSubmitButton } from "./product-submit-button";

type ProductFormProduct = Pick<
  ProductListItem | ProductDetail,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "primary_category_id"
  | "brand"
  | "status"
  | "featured"
> & {
  sku?: string;
  basePrice?: number | null;
};

type ProductFormProps = {
  mode: "create" | "edit";
  product?: ProductFormProduct;
  categories: ProductCategoryOption[];
};

export function ProductForm({ mode, product, categories }: ProductFormProps) {
  const action = mode === "create" ? createProductAction : updateProductAction;
  const [state, formAction] = useActionState(action, initialProductActionState);
  const submitLabel = mode === "create" ? "Create product" : "Save changes";

  return (
    <form action={formAction} className="space-y-4">
      <ProductActionMessage state={state} />
      {product ? <input name="id" type="hidden" value={product.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Product name</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={product?.name}
            maxLength={200}
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
            defaultValue={product?.slug ?? ""}
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
          defaultValue={product?.description ?? ""}
          maxLength={5000}
          name="description"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Category</span>
          <select
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={product?.primary_category_id ?? ""}
            name="categoryId"
            required
          >
            <option disabled value="">
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Brand</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={product?.brand ?? ""}
            maxLength={120}
            name="brand"
            type="text"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Status</span>
          <select
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={product?.status ?? "draft"}
            name="status"
            required
          >
            {PRODUCT_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">SKU</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm uppercase outline-none transition-colors focus:border-zinc-950"
            defaultValue={product?.sku ?? ""}
            maxLength={64}
            minLength={2}
            name="sku"
            pattern="[A-Za-z0-9][A-Za-z0-9._-]*"
            required
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Base price</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={
              product?.basePrice === null || product?.basePrice === undefined
                ? ""
                : product.basePrice
            }
            max={10000000}
            min={0}
            name="basePrice"
            required
            step="0.01"
            type="number"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-zinc-800">
        <input
          className="size-4 rounded border-zinc-300"
          defaultChecked={product?.featured ?? false}
          name="featured"
          type="checkbox"
        />
        Featured product
      </label>

      <ProductSubmitButton
        label={submitLabel}
        pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
      />
    </form>
  );
}
