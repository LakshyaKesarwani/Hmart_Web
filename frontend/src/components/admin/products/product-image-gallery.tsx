"use client";

import { useActionState, type FormEvent, type ReactNode } from "react";
import type { ProductImageWithUrl } from "@/src/lib/admin/product-images";
import {
  deleteProductImageAction,
  initialProductImageActionState,
  reorderProductImageAction,
  setPrimaryProductImageAction,
  type ProductImageActionState,
} from "@/src/lib/admin/product-image-actions";
import { ProductImageActionMessage } from "./product-image-action-message";
import { ProductSubmitButton } from "./product-submit-button";

type ProductImageFormAction = (
  previousState: ProductImageActionState,
  formData: FormData,
) => Promise<ProductImageActionState>;

function ImageActionForm({
  action,
  children,
  className,
  onSubmit,
}: {
  action: ProductImageFormAction;
  children: ReactNode;
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [state, formAction] = useActionState(action, initialProductImageActionState);

  return (
    <form action={formAction} className={className} onSubmit={onSubmit}>
      <ProductImageActionMessage state={state} />
      {children}
    </form>
  );
}

function ProductImageCard({
  image,
  index,
  imageCount,
  productId,
}: {
  image: ProductImageWithUrl;
  index: number;
  imageCount: number;
  productId: string;
}) {
  const canMoveUp = index > 0;
  const canMoveDown = index < imageCount - 1;

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="relative aspect-square bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={image.alt_text ?? image.product_id}
          className="h-full w-full object-cover"
          src={image.publicUrl}
        />
        {image.is_primary ? (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white">
            Primary
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-sm font-medium text-zinc-950">
            {image.alt_text ?? "No alt text"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Order {image.sort_order + 1}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!image.is_primary ? (
            <ImageActionForm action={setPrimaryProductImageAction}>
              <input name="productId" type="hidden" value={productId} />
              <input name="imageId" type="hidden" value={image.id} />
              <ProductSubmitButton
                label="Set primary"
                pendingLabel="Saving..."
              />
            </ImageActionForm>
          ) : null}

          {canMoveUp ? (
            <ImageActionForm action={reorderProductImageAction}>
              <input name="productId" type="hidden" value={productId} />
              <input name="imageId" type="hidden" value={image.id} />
              <input name="direction" type="hidden" value="up" />
              <ProductSubmitButton label="Move up" pendingLabel="Moving..." />
            </ImageActionForm>
          ) : null}

          {canMoveDown ? (
            <ImageActionForm action={reorderProductImageAction}>
              <input name="productId" type="hidden" value={productId} />
              <input name="imageId" type="hidden" value={image.id} />
              <input name="direction" type="hidden" value="down" />
              <ProductSubmitButton label="Move down" pendingLabel="Moving..." />
            </ImageActionForm>
          ) : null}
        </div>

        <ImageActionForm
          action={deleteProductImageAction}
          onSubmit={(event) => {
            if (!confirm("Delete this image?")) {
              event.preventDefault();
            }
          }}
        >
          <input name="productId" type="hidden" value={productId} />
          <input name="imageId" type="hidden" value={image.id} />
          <ProductSubmitButton
            label="Delete image"
            pendingLabel="Deleting..."
            variant="danger"
          />
        </ImageActionForm>
      </div>
    </article>
  );
}

export function ProductImageGallery({
  images,
  productId,
}: {
  images: ProductImageWithUrl[];
  productId: string;
}) {
  if (images.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-base font-semibold text-zinc-950">No images yet</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Upload the first product image to enable previews and ordering.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image, index) => (
        <ProductImageCard
          image={image}
          imageCount={images.length}
          index={index}
          key={image.id}
          productId={productId}
        />
      ))}
    </div>
  );
}
