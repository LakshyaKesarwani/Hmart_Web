"use client";

import {
  CART_MAX_QUANTITY,
  LOCAL_CART_STORAGE_KEY,
  type CartStorageItem,
} from "@/src/lib/storefront/cart-types";

const CART_CHANGE_EVENT = "hmart-cart-change";
const CART_COUNT_EVENT = "hmart-cart-count";

function dispatchCartChange() {
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

export function broadcastCartCount(count: number) {
  window.dispatchEvent(new CustomEvent<number>(CART_COUNT_EVENT, { detail: count }));
}

export function subscribeToCartCount(callback: (count: number) => void) {
  const handler = (e: Event) => callback((e as CustomEvent<number>).detail);
  window.addEventListener(CART_COUNT_EVENT, handler);
  return () => window.removeEventListener(CART_COUNT_EVENT, handler);
}

function normalizeQuantity(value: number) {
  const quantity = Math.floor(Number(value));

  if (!Number.isFinite(quantity)) {
    return 0;
  }

  return Math.min(Math.max(quantity, 0), CART_MAX_QUANTITY);
}

function normalizeItems(items: CartStorageItem[]) {
  const quantityByVariantId = new Map<string, number>();

  for (const item of items) {
    const quantity = normalizeQuantity(item.quantity);

    if (!item.variantId || quantity < 1) {
      continue;
    }

    const current = quantityByVariantId.get(item.variantId) ?? 0;
    quantityByVariantId.set(
      item.variantId,
      Math.min(current + quantity, CART_MAX_QUANTITY),
    );
  }

  return Array.from(quantityByVariantId, ([variantId, quantity]) => ({
    variantId,
    quantity,
  }));
}

export function readLocalCart() {
  try {
    const raw = window.localStorage.getItem(LOCAL_CART_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return normalizeItems(parsed as CartStorageItem[]);
  } catch {
    return [];
  }
}

export function writeLocalCart(items: CartStorageItem[]) {
  const normalized = normalizeItems(items);

  if (normalized.length === 0) {
    window.localStorage.removeItem(LOCAL_CART_STORAGE_KEY);
  } else {
    window.localStorage.setItem(LOCAL_CART_STORAGE_KEY, JSON.stringify(normalized));
  }

  dispatchCartChange();
  broadcastCartCount(normalized.reduce((sum, item) => sum + item.quantity, 0));
}

export function addLocalCartItem({
  availableStock,
  quantity,
  variantId,
}: {
  availableStock: number;
  quantity: number;
  variantId: string;
}) {
  const currentItems = readLocalCart();
  const existing = currentItems.find((item) => item.variantId === variantId);
  const requestedQuantity = (existing?.quantity ?? 0) + normalizeQuantity(quantity);

  if (requestedQuantity < 1) {
    return { status: "error" as const, message: "Choose a valid quantity." };
  }

  if (requestedQuantity > availableStock) {
    return {
      status: "error" as const,
      message: `Only ${availableStock} item(s) are available for this variant.`,
    };
  }

  writeLocalCart([
    ...currentItems.filter((item) => item.variantId !== variantId),
    { variantId, quantity: requestedQuantity },
  ]);

  return { status: "success" as const, message: "Added to cart." };
}

export function updateLocalCartItem({
  availableStock,
  quantity,
  variantId,
}: {
  availableStock: number;
  quantity: number;
  variantId: string;
}) {
  const resolvedQuantity = normalizeQuantity(quantity);
  const currentItems = readLocalCart();

  if (resolvedQuantity < 1) {
    writeLocalCart(currentItems.filter((item) => item.variantId !== variantId));
    return { status: "success" as const, message: "Item removed." };
  }

  if (resolvedQuantity > availableStock) {
    return {
      status: "error" as const,
      message: `Only ${availableStock} item(s) are available for this variant.`,
    };
  }

  writeLocalCart([
    ...currentItems.filter((item) => item.variantId !== variantId),
    { variantId, quantity: resolvedQuantity },
  ]);

  return { status: "success" as const, message: "Cart updated." };
}

export function removeLocalCartItem(variantId: string) {
  writeLocalCart(readLocalCart().filter((item) => item.variantId !== variantId));
}

export function emptyLocalCart() {
  writeLocalCart([]);
}

export function subscribeToLocalCart(callback: () => void) {
  window.addEventListener(CART_CHANGE_EVENT, callback);

  return () => window.removeEventListener(CART_CHANGE_EVENT, callback);
}
