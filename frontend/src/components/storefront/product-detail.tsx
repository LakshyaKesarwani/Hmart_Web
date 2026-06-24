"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/src/hooks/use-auth";
import { addCartItemAction } from "@/src/lib/storefront/cart-actions";
import { addLocalCartItem, broadcastCartCount } from "@/src/lib/storefront/cart-storage";
import type {
  StorefrontProductImage,
  StorefrontProductVariant,
} from "@/src/lib/storefront/types";
import { formatCurrency } from "@/src/lib/storefront/format";

export function ProductImageGallery({
  images,
  productName,
}: {
  images: StorefrontProductImage[];
  productName: string;
}) {
  const [selectedId, setSelectedId] = useState(
    images.find((image) => image.isPrimary)?.id ?? images[0]?.id ?? "",
  );
  const selectedImage =
    images.find((image) => image.id === selectedId) ?? images[0] ?? null;

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-500">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
        {selectedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={selectedImage.altText ?? productName}
            className="aspect-square w-full object-cover"
            src={selectedImage.publicUrl}
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => (
            <button
              className={`overflow-hidden rounded-lg border ${
                image.id === selectedImage?.id
                  ? "border-green-600 ring-2 ring-green-600"
                  : "border-zinc-200"
              }`}
              key={image.id}
              onClick={() => setSelectedId(image.id)}
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={image.altText ?? productName}
                className="aspect-square w-full object-cover"
                src={image.publicUrl}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProductVariantList({
  variants,
}: {
  variants: StorefrontProductVariant[];
}) {
  if (variants.length === 0) {
    return (
      <p className="text-sm text-zinc-600">No purchasable variants are available.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3" scope="col">SKU</th>
            <th className="px-4 py-3" scope="col">Price</th>
            <th className="px-4 py-3" scope="col">Unit</th>
            <th className="px-4 py-3" scope="col">Availability</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {variants.map((variant) => (
            <tr className="text-zinc-700" key={variant.id}>
              <td className="px-4 py-3 font-medium text-zinc-950">{variant.sku}</td>
              <td className="px-4 py-3">{formatCurrency(variant.price)}</td>
              <td className="px-4 py-3">{variant.unit ?? "—"}</td>
              <td className="px-4 py-3">
                {variant.inStock ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {variant.availableStock} available
                  </span>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    Out of stock
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductStockBadge({ inStock }: { inStock: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        inStock
          ? "bg-emerald-50 text-emerald-700"
          : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {inStock ? "In stock" : "Out of stock"}
    </span>
  );
}

export function ProductAddToCartPanel({
  variants,
}: {
  variants: StorefrontProductVariant[];
}) {
  const firstAvailableVariant =
    variants.find((variant) => variant.inStock) ?? variants[0] ?? null;
  const [selectedVariantId, setSelectedVariantId] = useState(
    firstAvailableVariant?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    firstAvailableVariant;
  const maxQuantity = selectedVariant?.availableStock ?? 0;
  const canAdd =
    Boolean(selectedVariant?.inStock) && quantity >= 1 && quantity <= maxQuantity;

  async function handleAddToCart() {
    if (!selectedVariant || !canAdd) {
      setMessage({
        status: "error",
        text: "Choose an in-stock variant before adding to cart.",
      });
      return;
    }

    setIsPending(true);
    setMessage(null);

    try {
      if (isAuthenticated) {
        const result = await addCartItemAction({
          variantId: selectedVariant.id,
          quantity,
        });

        setMessage({ status: result.status, text: result.message });
        if (result.cart) {
          broadcastCartCount(result.cart.summary.totalQuantity);
        }
      } else {
        const result = addLocalCartItem({
          variantId: selectedVariant.id,
          quantity,
          availableStock: selectedVariant.availableStock,
        });

        setMessage({ status: result.status, text: result.message });
      }
    } finally {
      setIsPending(false);
    }
  }

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Variant</span>
          <select
            className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-green-600"
            onChange={(event) => {
              setSelectedVariantId(event.target.value);
              setQuantity(1);
              setMessage(null);
            }}
            value={selectedVariant?.id ?? ""}
          >
            {variants.map((variant) => (
              <option disabled={!variant.inStock} key={variant.id} value={variant.id}>
                {variant.sku} - {formatCurrency(variant.price)}
                {variant.unit ? ` / ${variant.unit}` : ""}
                {variant.inStock ? "" : " - Out of stock"}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Quantity</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600 disabled:bg-zinc-100"
            disabled={!selectedVariant?.inStock}
            max={Math.max(maxQuantity, 1)}
            min={1}
            onChange={(event) => {
              const nextQuantity = Number.parseInt(event.target.value, 10);
              setQuantity(Number.isFinite(nextQuantity) ? nextQuantity : 1);
              setMessage(null);
            }}
            type="number"
            value={quantity}
          />
        </label>
      </div>

      {selectedVariant ? (
        <p className="mt-3 text-sm text-zinc-600">
          {selectedVariant.inStock
            ? `${selectedVariant.availableStock} available for ${selectedVariant.sku}.`
            : "This variant is out of stock."}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex h-11 items-center justify-center rounded-full bg-green-600 px-5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          disabled={isLoading || isPending || !canAdd}
          onClick={handleAddToCart}
          type="button"
        >
          {isPending
            ? "Adding..."
            : isLoading
              ? "Checking session..."
              : "Add to cart"}
        </button>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          href="/cart"
        >
          View cart
        </Link>
      </div>

      {message ? (
        <p
          className={`mt-4 rounded-md px-3 py-2 text-sm ${
            message.status === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
