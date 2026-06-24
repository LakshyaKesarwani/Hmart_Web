"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/src/hooks/use-auth";
import {
  emptyCartAction,
  getCurrentCartAction,
  hydrateLocalCartAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
} from "@/src/lib/storefront/cart-actions";
import {
  emptyLocalCart,
  readLocalCart,
  removeLocalCartItem,
  subscribeToLocalCart,
  updateLocalCartItem,
} from "@/src/lib/storefront/cart-storage";
import type {
  CartActionResult,
  CartDisplayItem,
  StorefrontCart,
} from "@/src/lib/storefront/cart-types";
import { formatCurrency } from "@/src/lib/storefront/format";

function createEmptyCart(): StorefrontCart {
  return {
    items: [],
    summary: {
      itemCount: 0,
      totalQuantity: 0,
      subtotal: 0,
    },
  };
}

function CartNotice({
  message,
}: {
  message: { status: "success" | "error"; text: string } | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={`rounded-md px-3 py-2 text-sm ${
        message.status === "success"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {message.text}
    </p>
  );
}

function CartLineItem({
  isPending,
  item,
  onRemove,
  onUpdate,
}: {
  isPending: boolean;
  item: CartDisplayItem;
  onRemove: (item: CartDisplayItem) => void;
  onUpdate: (item: CartDisplayItem, quantity: number) => void;
}) {
  return (
    <article className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-[112px_minmax(0,1fr)_170px]">
      <Link
        className="block overflow-hidden rounded-md border border-zinc-200 bg-zinc-100"
        href={`/products/${item.productSlug}`}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={item.imageAlt ?? item.productName}
            className="aspect-square w-full object-cover"
            src={item.imageUrl}
          />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-zinc-500">
            No image
          </div>
        )}
      </Link>

      <div className="min-w-0">
        {item.brand ? (
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {item.brand}
          </p>
        ) : null}
        <Link
          className="mt-1 block text-base font-semibold text-zinc-950 hover:underline"
          href={`/products/${item.productSlug}`}
        >
          {item.productName}
        </Link>
        <p className="mt-1 text-sm text-zinc-600">{item.categoryName}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1">
            SKU {item.sku}
          </span>
          {item.unit ? (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1">
              {item.unit}
            </span>
          ) : null}
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
            {item.availableStock} available
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:items-end">
        <div className="text-left sm:text-right">
          <p className="text-sm text-zinc-600">{formatCurrency(item.price)} each</p>
          <p className="mt-1 text-base font-semibold text-zinc-950">
            {formatCurrency(item.lineSubtotal)}
          </p>
        </div>

        <div className="flex h-10 w-fit items-center rounded-md border border-zinc-300 bg-white">
          <button
            className="h-full w-10 text-lg text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
            disabled={isPending}
            onClick={() => onUpdate(item, item.quantity - 1)}
            type="button"
          >
            -
          </button>
          <input
            className="h-full w-14 border-x border-zinc-300 text-center text-sm outline-none disabled:bg-zinc-50"
            disabled={isPending}
            key={item.quantity}
            min={1}
            onBlur={(event) => {
              const nextQuantity = Number.parseInt(event.target.value, 10);
              onUpdate(item, Number.isFinite(nextQuantity) ? nextQuantity : 1);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            type="number"
            defaultValue={item.quantity}
          />
          <button
            className="h-full w-10 text-lg text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
            disabled={isPending || item.quantity >= item.availableStock}
            onClick={() => onUpdate(item, item.quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>

        <button
          className="text-sm font-medium text-red-700 underline disabled:cursor-not-allowed disabled:text-zinc-400"
          disabled={isPending}
          onClick={() => onRemove(item)}
          type="button"
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export function CartPageClient({
  initialCart,
  initialIsAuthenticated,
}: {
  initialCart: StorefrontCart;
  initialIsAuthenticated: boolean;
}) {
  const [cart, setCart] = useState(initialCart);
  const [isLoading, setIsLoading] = useState(!initialIsAuthenticated);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const initializedRef = useRef(false);

  const applyResult = useCallback((result: CartActionResult) => {
    setMessage({ status: result.status, text: result.message });

    if (result.cart) {
      setCart(result.cart);
    }
  }, []);

  const loadLocalCart = useCallback(async () => {
    setIsLoading(true);
    const result = await hydrateLocalCartAction(readLocalCart());

    if (result.cart) {
      setCart(result.cart);
    } else {
      setCart(createEmptyCart());
    }

    if (result.status === "error") {
      setMessage({ status: "error", text: result.message });
    }

    setIsLoading(false);
  }, []);

  const loadPersistentCart = useCallback(async () => {
    setIsLoading(true);
    const result = await getCurrentCartAction();
    applyResult(result);
    setIsLoading(false);
  }, [applyResult]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    if (isAuthenticated) {
      if (!initialIsAuthenticated) {
        void Promise.resolve().then(loadPersistentCart);
      }
      return;
    }

    void Promise.resolve().then(loadLocalCart);
  }, [
    initialIsAuthenticated,
    isAuthenticated,
    isAuthLoading,
    loadLocalCart,
    loadPersistentCart,
  ]);

  useEffect(() => {
    return subscribeToLocalCart(() => {
      if (isAuthenticated) {
        loadPersistentCart();
      } else {
        loadLocalCart();
      }
    });
  }, [isAuthenticated, loadLocalCart, loadPersistentCart]);

  async function handleUpdate(item: CartDisplayItem, quantity: number) {
    setPendingKey(item.variantId);
    setMessage(null);

    if (isAuthenticated) {
      applyResult(
        await updateCartItemQuantityAction({
          variantId: item.variantId,
          quantity,
        }),
      );
    } else {
      const result = updateLocalCartItem({
        variantId: item.variantId,
        quantity,
        availableStock: item.availableStock,
      });
      setMessage({ status: result.status, text: result.message });
      await loadLocalCart();
    }

    setPendingKey(null);
  }

  async function handleRemove(item: CartDisplayItem) {
    setPendingKey(item.variantId);
    setMessage(null);

    if (isAuthenticated) {
      applyResult(await removeCartItemAction(item.variantId));
    } else {
      removeLocalCartItem(item.variantId);
      setMessage({ status: "success", text: "Item removed." });
      await loadLocalCart();
    }

    setPendingKey(null);
  }

  async function handleEmptyCart() {
    setPendingKey("empty");
    setMessage(null);

    if (isAuthenticated) {
      applyResult(await emptyCartAction());
    } else {
      emptyLocalCart();
      setCart(createEmptyCart());
      setMessage({ status: "success", text: "Cart emptied." });
    }

    setPendingKey(null);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-4">
        <CartNotice message={message} />

        {isLoading ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
            Loading cart...
          </div>
        ) : cart.items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-zinc-950">Your cart is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
              Add products from the catalog and they will appear here.
            </p>
            <Link
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-5 text-sm font-medium text-white transition-colors hover:bg-green-700"
              href="/products"
            >
              Browse products
            </Link>
          </div>
        ) : (
          cart.items.map((item) => (
            <CartLineItem
              isPending={pendingKey === item.variantId}
              item={item}
              key={item.variantId}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </section>

      <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-950">Cart summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-600">Items</dt>
            <dd className="font-medium text-zinc-950">{cart.summary.itemCount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-600">Total quantity</dt>
            <dd className="font-medium text-zinc-950">
              {cart.summary.totalQuantity}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3">
            <dt className="font-medium text-zinc-950">Subtotal</dt>
            <dd className="font-semibold text-zinc-950">
              {formatCurrency(cart.summary.subtotal)}
            </dd>
          </div>
        </dl>

        <button
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md border border-red-200 px-4 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400"
          disabled={cart.items.length === 0 || pendingKey === "empty"}
          onClick={handleEmptyCart}
          type="button"
        >
          {pendingKey === "empty" ? "Emptying..." : "Empty cart"}
        </button>
      </aside>
    </div>
  );
}
