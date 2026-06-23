"use client";

import { useActionState } from "react";
import {
  initialProductVariantActionState,
  setProductVariantActiveAction,
} from "@/src/lib/admin/product-variant-actions";
import { ProductVariantActionMessage } from "./product-variant-action-message";
import { ProductSubmitButton } from "./product-submit-button";

export function ProductVariantActiveForm({
  isActive,
  productId,
  variantId,
}: {
  isActive: boolean;
  productId: string;
  variantId: string;
}) {
  const [state, formAction] = useActionState(
    setProductVariantActiveAction,
    initialProductVariantActionState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <ProductVariantActionMessage state={state} />
      <input name="productId" type="hidden" value={productId} />
      <input name="variantId" type="hidden" value={variantId} />
      <input
        name="isActive"
        type="hidden"
        value={isActive ? "false" : "true"}
      />
      <ProductSubmitButton
        label={isActive ? "Deactivate variant" : "Activate variant"}
        pendingLabel={isActive ? "Deactivating..." : "Activating..."}
        variant={isActive ? "danger" : "primary"}
      />
    </form>
  );
}
