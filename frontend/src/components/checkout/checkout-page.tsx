"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  createAddressAction,
  deleteAddressAction,
  placeOrderAction,
  updateAddressAction,
} from "@/src/lib/checkout/actions";
import {
  initialCheckoutActionState,
  type CheckoutActionState,
  type CheckoutAddress,
  type CheckoutData,
} from "@/src/lib/checkout/types";
import { formatCurrency } from "@/src/lib/storefront/format";

function SubmitButton({
  children,
  disabled = false,
  pendingText,
  variant = "primary",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  pendingText: string;
  variant?: "primary" | "secondary" | "danger";
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 disabled:bg-zinc-300 disabled:text-white",
    secondary:
      "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:text-zinc-400",
    danger:
      "border border-red-200 text-red-700 hover:bg-red-50 disabled:border-zinc-200 disabled:text-zinc-400",
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed ${styles[variant]}`}
      disabled={pending || disabled}
      type="submit"
    >
      {pending ? pendingText : children}
    </button>
  );
}

function ActionMessage({ state }: { state: CheckoutActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <p
      className={`rounded-md px-3 py-2 text-sm ${
        state.status === "success"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {state.message}
      {state.orderId ? (
        <span className="mt-1 block text-xs">Order ID: {state.orderId}</span>
      ) : null}
    </p>
  );
}

function AddressFields({ address }: { address?: CheckoutAddress }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Full name</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={address?.recipientName ?? ""}
          name="fullName"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Phone</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={address?.phone ?? ""}
          name="phone"
          required
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-zinc-800">Address line 1</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={address?.line1 ?? ""}
          name="line1"
          required
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-zinc-800">Address line 2</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={address?.line2 ?? ""}
          name="line2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">City</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={address?.city ?? ""}
          name="city"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">State</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={address?.state ?? ""}
          name="state"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Postal code</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={address?.postalCode ?? ""}
          name="postalCode"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Country</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-green-600"
          defaultValue={address?.country ?? "India"}
          name="country"
          required
        />
      </label>
      <label className="flex items-center gap-2 sm:col-span-2">
        <input
          className="size-4 rounded border-zinc-300"
          defaultChecked={address?.isDefault ?? false}
          name="isDefault"
          type="checkbox"
        />
        <span className="text-sm text-zinc-700">Use as default address</span>
      </label>
    </div>
  );
}

function CreateAddressForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(
    createAddressAction,
    initialCheckoutActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-950">Add shipping address</h2>
      <div className="mt-4">
        <AddressFields />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton pendingText="Saving...">Save address</SubmitButton>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

function AddressCard({
  address,
  isSelected,
  onSelect,
}: {
  address: CheckoutAddress;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const router = useRouter();
  const [updateState, updateAction] = useActionState(
    updateAddressAction,
    initialCheckoutActionState,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteAddressAction,
    initialCheckoutActionState,
  );

  useEffect(() => {
    if (updateState.status === "success" || deleteState.status === "success") {
      router.refresh();
    }
  }, [deleteState.status, router, updateState.status]);

  return (
    <article
      className={`rounded-lg border bg-white p-5 ${
        isSelected ? "border-green-600 ring-1 ring-green-600" : "border-zinc-200"
      }`}
    >
      <label className="flex gap-3">
        <input
          checked={isSelected}
          className="mt-1 size-4"
          name="selectedAddress"
          onChange={onSelect}
          type="radio"
          value={address.id}
        />
        <span>
          <span className="block font-medium text-zinc-950">
            {address.recipientName}
            {address.isDefault ? (
              <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                Default
              </span>
            ) : null}
          </span>
          <span className="mt-2 block text-sm leading-6 text-zinc-600">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country} · {address.phone}
          </span>
        </span>
      </label>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-950 underline">
          Edit address
        </summary>
        <form action={updateAction} className="mt-4 space-y-4">
          <input name="addressId" type="hidden" value={address.id} />
          <AddressFields address={address} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SubmitButton pendingText="Updating..." variant="secondary">
              Update address
            </SubmitButton>
            <ActionMessage state={updateState} />
          </div>
        </form>
      </details>

      <form action={deleteAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input name="addressId" type="hidden" value={address.id} />
        <SubmitButton pendingText="Deleting..." variant="danger">
          Delete address
        </SubmitButton>
        <ActionMessage state={deleteState} />
      </form>
    </article>
  );
}

function OrderSummary({
  checkout,
  selectedAddressId,
}: {
  checkout: CheckoutData;
  selectedAddressId: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    placeOrderAction,
    initialCheckoutActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-950">Order summary</h2>
      <div className="mt-5 space-y-4">
        {checkout.cart.items.map((item) => (
          <div className="flex gap-3" key={item.variantId}>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-950">
                {item.productName}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {item.sku} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium text-zinc-950">
              {formatCurrency(item.lineSubtotal)}
            </p>
          </div>
        ))}
      </div>

      <dl className="mt-5 space-y-3 border-t border-zinc-200 pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600">Subtotal</dt>
          <dd className="font-medium text-zinc-950">
            {formatCurrency(checkout.totals.subtotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600">Shipping</dt>
          <dd className="font-medium text-zinc-950">
            {formatCurrency(checkout.totals.shipping)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600">Tax</dt>
          <dd className="font-medium text-zinc-950">
            {formatCurrency(checkout.totals.tax)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3">
          <dt className="font-semibold text-zinc-950">Grand total</dt>
          <dd className="font-semibold text-zinc-950">
            {formatCurrency(checkout.totals.grandTotal)}
          </dd>
        </div>
      </dl>

      <form action={formAction} className="mt-6 space-y-3">
        <input name="addressId" type="hidden" value={selectedAddressId} />
        <SubmitButton disabled={!selectedAddressId} pendingText="Placing order...">
          Place Order
        </SubmitButton>
        <ActionMessage state={state} />
      </form>
    </aside>
  );
}

export function CheckoutPageClient({ checkout }: { checkout: CheckoutData }) {
  const defaultAddressId = useMemo(
    () =>
      checkout.addresses.find((address) => address.isDefault)?.id ??
      checkout.addresses[0]?.id ??
      "",
    [checkout.addresses],
  );
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddressId);

  useEffect(() => {
    void Promise.resolve().then(() => setSelectedAddressId(defaultAddressId));
  }, [defaultAddressId]);

  if (checkout.cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-zinc-950">Your cart is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
          Add items to your cart before starting checkout.
        </p>
        <Link
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-5 text-sm font-medium text-white transition-colors hover:bg-green-700"
          href="/products"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        {checkout.error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {checkout.error}
          </p>
        ) : null}

        <div>
          <h2 className="text-xl font-semibold text-zinc-950">
            Shipping address
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Choose an address for this order or add a new one.
          </p>
        </div>

        {checkout.addresses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
            No saved addresses yet.
          </div>
        ) : (
          <div className="space-y-4">
            {checkout.addresses.map((address) => (
              <AddressCard
                address={address}
                isSelected={selectedAddressId === address.id}
                key={address.id}
                onSelect={() => setSelectedAddressId(address.id)}
              />
            ))}
          </div>
        )}

        <CreateAddressForm />
      </section>

      <OrderSummary
        checkout={checkout}
        selectedAddressId={selectedAddressId}
      />
    </div>
  );
}
