"use client";

import { useActionState } from "react";
import {
  createInventoryLocationAction,
  initialInventoryActionState,
  updateInventoryLocationAction,
} from "@/src/lib/admin/inventory-location-actions";
import type { InventoryLocationRow } from "@/src/lib/admin/inventory";
import { InventoryActionMessage } from "./inventory-action-message";
import { InventorySubmitButton } from "./inventory-submit-button";

export function InventoryLocationForm({
  location,
  mode,
}: {
  location?: InventoryLocationRow;
  mode: "create" | "edit";
}) {
  const action =
    mode === "create"
      ? createInventoryLocationAction
      : updateInventoryLocationAction;
  const [state, formAction] = useActionState(action, initialInventoryActionState);

  return (
    <form action={formAction} className="space-y-4">
      <InventoryActionMessage state={state} />
      {location ? <input name="id" type="hidden" value={location.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Name</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
            defaultValue={location?.name}
            maxLength={120}
            minLength={2}
            name="name"
            required
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Code</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm uppercase outline-none transition-colors focus:border-zinc-950"
            defaultValue={location?.code}
            name="code"
            pattern="[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*"
            placeholder="auto-generated if blank"
            type="text"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Description</span>
        <textarea
          className="mt-2 min-h-20 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-950"
          defaultValue={location?.description ?? ""}
          maxLength={500}
          name="description"
        />
      </label>

      <label className="flex items-center gap-3 text-sm font-medium text-zinc-800">
        <input
          className="size-4 rounded border-zinc-300"
          defaultChecked={location?.is_active ?? true}
          name="isActive"
          type="checkbox"
        />
        Active location
      </label>

      <InventorySubmitButton
        label={mode === "create" ? "Create location" : "Save changes"}
        pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
      />
    </form>
  );
}
