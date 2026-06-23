"use client";

import { useActionState } from "react";
import {
  deleteProductVariantAction,
  initialProductVariantActionState,
} from "@/src/lib/admin/product-variant-actions";
import { ProductVariantActionMessage } from "./product-variant-action-message";
import { ProductSubmitButton } from "./product-submit-button";

export function ProductVariantDeleteForm({
  productId,
  sku,
  variantId,
}: {
  productId: string;
  sku: string;
  variantId: string;
}) {
  const [state, formAction] = useActionState(
    deleteProductVariantAction,
    initialProductVariantActionState,
  );

  return (
    <form
      action={formAction}
      className="space-y-3"
      onSubmit={(event) => {
        if (!confirm(`Delete variant ${sku}?`)) {
          event.preventDefault();
        }
      }}
    >
      <ProductVariantActionMessage state={state} />
      <input name="productId" type="hidden" value={productId} />
      <input name="variantId" type="hidden" value={variantId} />
      <ProductSubmitButton
        label="Delete variant"
        pendingLabel="Deleting..."
        variant="danger"
      />
    </form>
  );
}
