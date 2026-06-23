"use client";

import { useActionState } from "react";
import {
  deleteInventoryLocationAction,
  initialInventoryActionState,
} from "@/src/lib/admin/inventory-location-actions";
import { InventoryActionMessage } from "./inventory-action-message";
import { InventorySubmitButton } from "./inventory-submit-button";

export function InventoryLocationDeleteForm({
  locationId,
  locationName,
}: {
  locationId: string;
  locationName: string;
}) {
  const [state, formAction] = useActionState(
    deleteInventoryLocationAction,
    initialInventoryActionState,
  );

  return (
    <form
      action={formAction}
      className="space-y-3"
      onSubmit={(event) => {
        if (!confirm(`Delete ${locationName}?`)) {
          event.preventDefault();
        }
      }}
    >
      <InventoryActionMessage state={state} />
      <input name="id" type="hidden" value={locationId} />
      <InventorySubmitButton
        label="Delete location"
        pendingLabel="Deleting..."
        variant="danger"
      />
    </form>
  );
}
