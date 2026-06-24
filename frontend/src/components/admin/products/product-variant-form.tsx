"use client";

import { useActionState } from "react";
import {
  createProductVariantAction,
  initialProductVariantActionState,
  updateProductVariantAction,
} from "@/src/lib/admin/product-variant-actions";
import type { ProductVariantRecord } from "@/src/lib/admin/product-variants";
import { ProductVariantActionMessage } from "./product-variant-action-message";
import { ProductSubmitButton } from "./product-submit-button";

type ProductVariantFormProps = {
  mode: "create" | "edit";
  productId: string;
  variant?: ProductVariantRecord;
};

export function ProductVariantForm({
  mode,
  productId,
  variant,
}: ProductVariantFormProps) {
  const action =
    mode === "create" ? createProductVariantAction : updateProductVariantAction;
  const [state, formAction] = useActionState(action, initialProductVariantActionState);
  const submitLabel = mode === "create" ? "Create variant" : "Save changes";
  const variantName =
    typeof variant?.attributes?.name === "string" ? variant.attributes.name : "";

  return (
    <form action={formAction} className="space-y-4">
      <ProductVariantActionMessage state={state} />
      <input name="productId" type="hidden" value={productId} />
      {variant ? (
        <input name="variantId" type="hidden" value={variant.id} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Variant name</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={variantName}
            maxLength={120}
            name="name"
            placeholder="e.g. 1 kg pack"
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">SKU</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm uppercase outline-none transition-colors focus:border-zinc-950"
            defaultValue={variant?.sku}
            maxLength={64}
            minLength={2}
            name="sku"
            pattern="[A-Za-z0-9][A-Za-z0-9._-]*"
            required
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Price</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={variant?.price}
            max={10000000}
            min={0}
            name="price"
            required
            step="0.01"
            type="number"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Unit</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={variant?.unit ?? ""}
          maxLength={32}
          minLength={1}
          name="unit"
          placeholder="e.g. kg, piece, pack"
          required
          type="text"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Weight (grams)</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={variant?.weight_grams ?? ""}
          max={1000000}
          min={0}
          name="weightGrams"
          type="number"
        />
      </label>

      <label className="flex items-center gap-3 text-sm font-medium text-zinc-800">
        <input
          className="size-4 rounded border-zinc-300"
          defaultChecked={variant?.is_active ?? true}
          name="isActive"
          type="checkbox"
        />
        Active variant
      </label>

      <ProductSubmitButton
        label={submitLabel}
        pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
      />
    </form>
  );
}
