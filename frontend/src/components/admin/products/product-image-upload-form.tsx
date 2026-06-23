"use client";

import { useActionState } from "react";
import {
  initialProductImageActionState,
  uploadProductImageAction,
} from "@/src/lib/admin/product-image-actions";
import { ProductImageActionMessage } from "./product-image-action-message";
import { ProductSubmitButton } from "./product-submit-button";

export function ProductImageUploadForm({ productId }: { productId: string }) {
  const [state, formAction] = useActionState(
    uploadProductImageAction,
    initialProductImageActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <ProductImageActionMessage state={state} />
      <input name="productId" type="hidden" value={productId} />

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Image file</span>
        <input
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-2 block w-full text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800"
          name="file"
          required
          type="file"
        />
        <p className="mt-2 text-xs text-zinc-500">
          JPEG, PNG, WebP, or GIF up to 5 MB.
        </p>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Alt text</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          maxLength={200}
          name="altText"
          placeholder="Describe the image for accessibility"
          type="text"
        />
      </label>

      <ProductSubmitButton label="Upload image" pendingLabel="Uploading..." />
    </form>
  );
}
