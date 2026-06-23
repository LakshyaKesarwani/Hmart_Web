"use client";

import { useActionState } from "react";
import type {
  InventoryLocationOption,
  InventoryVariantOption,
} from "@/src/lib/admin/inventory";
import {
  addInventoryStockAction,
  adjustInventoryStockAction,
  initialInventoryActionState,
  removeInventoryStockAction,
  transferInventoryStockAction,
} from "@/src/lib/admin/inventory-stock-actions";
import { InventoryActionMessage } from "./inventory-action-message";
import { InventorySubmitButton } from "./inventory-submit-button";

function VariantOptions({ variants }: { variants: InventoryVariantOption[] }) {
  return (
    <>
      <option disabled value="">
        Select variant
      </option>
      {variants.map((variant) => (
        <option key={variant.id} value={variant.id}>
          {variant.sku} · {variant.productName}
        </option>
      ))}
    </>
  );
}

function LocationOptions({ locations }: { locations: InventoryLocationOption[] }) {
  return (
    <>
      <option disabled value="">
        Select location
      </option>
      {locations.map((location) => (
        <option key={location.id} value={location.id}>
          {location.name} ({location.code})
        </option>
      ))}
    </>
  );
}

export function InventoryAddStockForm({
  locations,
  variants,
}: {
  locations: InventoryLocationOption[];
  variants: InventoryVariantOption[];
}) {
  const [state, formAction] = useActionState(
    addInventoryStockAction,
    initialInventoryActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <InventoryActionMessage state={state} />
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Location</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="locationId"
          required
        >
          <LocationOptions locations={locations} />
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Variant</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="variantId"
          required
        >
          <VariantOptions variants={variants} />
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Quantity</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            min={1}
            name="quantity"
            required
            type="number"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Reorder threshold</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={10}
            min={0}
            name="reorderThreshold"
            type="number"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Notes</span>
        <textarea
          className="mt-2 min-h-16 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-950"
          maxLength={500}
          name="notes"
          placeholder="Optional incoming note"
        />
      </label>
      <InventorySubmitButton label="Add stock" pendingLabel="Adding..." />
    </form>
  );
}

export function InventoryRemoveStockForm({
  locations,
  variants,
}: {
  locations: InventoryLocationOption[];
  variants: InventoryVariantOption[];
}) {
  const [state, formAction] = useActionState(
    removeInventoryStockAction,
    initialInventoryActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <InventoryActionMessage state={state} />
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Location</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="locationId"
          required
        >
          <LocationOptions locations={locations} />
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Variant</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="variantId"
          required
        >
          <VariantOptions variants={variants} />
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Quantity</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          min={1}
          name="quantity"
          required
          type="number"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Notes</span>
        <textarea
          className="mt-2 min-h-16 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-950"
          maxLength={500}
          name="notes"
          placeholder="Optional outgoing note"
        />
      </label>
      <InventorySubmitButton
        label="Remove stock"
        pendingLabel="Removing..."
        variant="danger"
      />
    </form>
  );
}

export function InventoryTransferStockForm({
  locations,
  variants,
}: {
  locations: InventoryLocationOption[];
  variants: InventoryVariantOption[];
}) {
  const [state, formAction] = useActionState(
    transferInventoryStockAction,
    initialInventoryActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <InventoryActionMessage state={state} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">From location</span>
          <select
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            name="fromLocationId"
            required
          >
            <LocationOptions locations={locations} />
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">To location</span>
          <select
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            name="toLocationId"
            required
          >
            <LocationOptions locations={locations} />
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Variant</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="variantId"
          required
        >
          <VariantOptions variants={variants} />
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Quantity</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          min={1}
          name="quantity"
          required
          type="number"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Notes</span>
        <textarea
          className="mt-2 min-h-16 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-950"
          maxLength={500}
          name="notes"
          placeholder="Optional transfer note"
        />
      </label>
      <InventorySubmitButton label="Transfer stock" pendingLabel="Transferring..." />
    </form>
  );
}

export function InventoryAdjustStockForm({
  locations,
  variants,
}: {
  locations: InventoryLocationOption[];
  variants: InventoryVariantOption[];
}) {
  const [state, formAction] = useActionState(
    adjustInventoryStockAction,
    initialInventoryActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <InventoryActionMessage state={state} />
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Location</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="locationId"
          required
        >
          <LocationOptions locations={locations} />
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Variant</span>
        <select
          className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="variantId"
          required
        >
          <VariantOptions variants={variants} />
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Direction</span>
          <select
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue="increase"
            name="direction"
            required
          >
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Quantity</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            min={1}
            name="quantity"
            required
            type="number"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Notes</span>
        <textarea
          className="mt-2 min-h-16 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-950"
          maxLength={500}
          name="notes"
          placeholder="Reason for adjustment"
          required
        />
      </label>
      <InventorySubmitButton label="Adjust stock" pendingLabel="Adjusting..." />
    </form>
  );
}
