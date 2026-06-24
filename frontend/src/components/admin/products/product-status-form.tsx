"use client";

import { useActionState } from "react";
import {
  initialProductActionState,
  updateProductStatusAction,
} from "@/src/lib/admin/product-actions";
import { PRODUCT_STATUS_OPTIONS } from "@/src/lib/admin/placeholder-data";
import type { ProductStatus } from "@/src/lib/admin/products";
import { ProductActionMessage } from "./product-action-message";
import { ProductSubmitButton } from "./product-submit-button";

export function ProductStatusForm({
  productId,
  currentStatus,
}: {
  productId: string;
  currentStatus: ProductStatus;
}) {
  const [state, formAction] = useActionState(
    updateProductStatusAction,
    initialProductActionState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <ProductActionMessage state={state} />
      <input name="id" type="hidden" value={productId} />
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Product status</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={currentStatus}
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
      <ProductSubmitButton
        label="Update status"
        pendingLabel="Updating..."
      />
    </form>
  );
}
