"use server";

import { revalidatePath } from "next/cache";
import type { InventoryMovementType } from "@/src/lib/admin/inventory";
import { createClient } from "@/src/lib/supabase/server";

export type InventoryActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialInventoryActionState: InventoryActionState = {
  status: "idle",
  message: "",
};

type InventoryRow = {
  location_id: string;
  variant_id: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number | null;
  reorder_level: number;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalStringValue(formData: FormData, key: string) {
  const value = getStringValue(formData, key);

  return value.length > 0 ? value : null;
}

function validateUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function validateQuantity(value: string):
  | { ok: true; quantity: number }
  | { ok: false; error: string } {
  const quantity = Number.parseInt(value, 10);

  if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 1000000) {
    return {
      ok: false,
      error: "Quantity must be a whole number between 1 and 1,000,000.",
    };
  }

  return { ok: true, quantity };
}

function validateNotes(notes: string | null):
  | { ok: true }
  | { ok: false; error: string } {
  if (notes && notes.length > 500) {
    return { ok: false, error: "Notes must be 500 characters or fewer." };
  }

  return { ok: true };
}

function revalidateInventoryPaths() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/admin/inventory");
}

async function getCurrentUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { userId: null, error: error?.message ?? "Authentication required." };
  }

  return { userId: data.user.id, error: null };
}

async function assertActiveLocation(locationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory_locations")
    .select("id")
    .eq("id", locationId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle()
    .returns<{ id: string } | null>();

  if (error) {
    return { ok: false as const, message: error.message };
  }

  if (!data) {
    return { ok: false as const, message: "Select a valid active location." };
  }

  return { ok: true as const };
}

async function assertVariantExists(variantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("id")
    .eq("id", variantId)
    .maybeSingle()
    .returns<{ id: string } | null>();

  if (error) {
    return { ok: false as const, message: error.message };
  }

  if (!data) {
    return { ok: false as const, message: "Select a valid product variant." };
  }

  return { ok: true as const };
}

async function getInventoryRow(locationId: string, variantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory")
    .select(
      "location_id, variant_id, quantity_on_hand, quantity_reserved, quantity_available, reorder_level",
    )
    .eq("location_id", locationId)
    .eq("variant_id", variantId)
    .maybeSingle()
    .returns<InventoryRow | null>();

  if (error) {
    return { row: null, error: error.message };
  }

  return { row: data, error: null };
}

async function insertMovement({
  createdBy,
  locationId,
  movementType,
  notes,
  quantity,
  quantityAfter,
  quantityBefore,
  toLocationId,
  variantId,
}: {
  createdBy: string | null;
  locationId: string;
  movementType: InventoryMovementType;
  notes: string | null;
  quantity: number;
  quantityAfter: number;
  quantityBefore: number;
  toLocationId?: string | null;
  variantId: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("inventory_movements").insert({
    movement_type: movementType,
    variant_id: variantId,
    location_id: locationId,
    to_location_id: toLocationId ?? null,
    quantity,
    quantity_before: quantityBefore,
    quantity_after: quantityAfter,
    notes,
    created_by: createdBy,
  });

  return { error: error?.message ?? null };
}

async function upsertInventoryQuantity({
  locationId,
  quantityAfter,
  reorderThreshold,
  variantId,
}: {
  locationId: string;
  quantityAfter: number;
  reorderThreshold?: number;
  variantId: string;
}) {
  const supabase = await createClient();
  const existing = await getInventoryRow(locationId, variantId);

  if (existing.error) {
    return { ok: false as const, message: existing.error };
  }

  if (existing.row) {
    const quantityAvailable = Math.max(
      quantityAfter - existing.row.quantity_reserved,
      0,
    );
    const { error } = await supabase
      .from("inventory")
      .update({
        quantity_on_hand: quantityAfter,
        quantity_available: quantityAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq("location_id", locationId)
      .eq("variant_id", variantId);

    if (error) {
      return { ok: false as const, message: error.message };
    }

    return { ok: true as const, quantityBefore: existing.row.quantity_on_hand };
  }

  const { error } = await supabase.from("inventory").insert({
    location_id: locationId,
    variant_id: variantId,
    quantity_on_hand: quantityAfter,
    quantity_reserved: 0,
    quantity_available: quantityAfter,
    reorder_level: reorderThreshold ?? 10,
  });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, quantityBefore: 0 };
}

export async function addInventoryStockAction(
  _previousState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const locationId = getStringValue(formData, "locationId");
  const variantId = getStringValue(formData, "variantId");
  const quantityResult = validateQuantity(getStringValue(formData, "quantity"));
  const notes = getOptionalStringValue(formData, "notes");
  const thresholdValue = getStringValue(formData, "reorderThreshold") || "10";
  const reorderThreshold = Number.parseInt(thresholdValue, 10);

  if (!validateUuid(locationId) || !validateUuid(variantId)) {
    return { status: "error", message: "Select a valid location and variant." };
  }

  if (!quantityResult.ok) {
    return { status: "error", message: quantityResult.error };
  }

  const notesCheck = validateNotes(notes);

  if (!notesCheck.ok) {
    return { status: "error", message: notesCheck.error };
  }

  if (
    !Number.isInteger(reorderThreshold) ||
    reorderThreshold < 0 ||
    reorderThreshold > 1000000
  ) {
    return {
      status: "error",
      message: "Reorder threshold must be a whole number between 0 and 1,000,000.",
    };
  }

  const [locationCheck, variantCheck, userResult, existing] = await Promise.all([
    assertActiveLocation(locationId),
    assertVariantExists(variantId),
    getCurrentUserId(),
    getInventoryRow(locationId, variantId),
  ]);

  if (!locationCheck.ok) {
    return { status: "error", message: locationCheck.message };
  }

  if (!variantCheck.ok) {
    return { status: "error", message: variantCheck.message };
  }

  if (userResult.error) {
    return { status: "error", message: userResult.error };
  }

  if (existing.error) {
    return { status: "error", message: existing.error };
  }

  const quantityBefore = existing.row?.quantity_on_hand ?? 0;
  const quantityAfter = quantityBefore + quantityResult.quantity;

  const updateResult = await upsertInventoryQuantity({
    locationId,
    variantId,
    quantityAfter,
    reorderThreshold: existing.row ? undefined : reorderThreshold,
  });

  if (!updateResult.ok) {
    return { status: "error", message: updateResult.message };
  }

  const movementError = await insertMovement({
    movementType: "incoming",
    variantId,
    locationId,
    quantity: quantityResult.quantity,
    quantityBefore,
    quantityAfter,
    notes,
    createdBy: userResult.userId,
  });

  if (movementError.error) {
    return { status: "error", message: movementError.error };
  }

  revalidateInventoryPaths();

  return { status: "success", message: "Stock added." };
}

export async function removeInventoryStockAction(
  _previousState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const locationId = getStringValue(formData, "locationId");
  const variantId = getStringValue(formData, "variantId");
  const quantityResult = validateQuantity(getStringValue(formData, "quantity"));
  const notes = getOptionalStringValue(formData, "notes");

  if (!validateUuid(locationId) || !validateUuid(variantId)) {
    return { status: "error", message: "Select a valid location and variant." };
  }

  if (!quantityResult.ok) {
    return { status: "error", message: quantityResult.error };
  }

  const notesCheck = validateNotes(notes);

  if (!notesCheck.ok) {
    return { status: "error", message: notesCheck.error };
  }

  const [locationCheck, variantCheck, userResult, existing] = await Promise.all([
    assertActiveLocation(locationId),
    assertVariantExists(variantId),
    getCurrentUserId(),
    getInventoryRow(locationId, variantId),
  ]);

  if (!locationCheck.ok) {
    return { status: "error", message: locationCheck.message };
  }

  if (!variantCheck.ok) {
    return { status: "error", message: variantCheck.message };
  }

  if (userResult.error) {
    return { status: "error", message: userResult.error };
  }

  if (existing.error) {
    return { status: "error", message: existing.error };
  }

  if (!existing.row) {
    return { status: "error", message: "No stock record exists for this variant." };
  }

  const available =
    existing.row.quantity_on_hand - existing.row.quantity_reserved;

  if (quantityResult.quantity > available) {
    return {
      status: "error",
      message: `Only ${available} units are available to remove.`,
    };
  }

  const quantityBefore = existing.row.quantity_on_hand;
  const quantityAfter = quantityBefore - quantityResult.quantity;
  const supabase = await createClient();
  const { error: updateError } = await supabase
    .from("inventory")
    .update({
      quantity_on_hand: quantityAfter,
      quantity_available: Math.max(
        quantityAfter - existing.row.quantity_reserved,
        0,
      ),
      updated_at: new Date().toISOString(),
    })
    .eq("location_id", locationId)
    .eq("variant_id", variantId);

  if (updateError) {
    return { status: "error", message: updateError.message };
  }

  const movementError = await insertMovement({
    movementType: "outgoing",
    variantId,
    locationId,
    quantity: quantityResult.quantity,
    quantityBefore,
    quantityAfter,
    notes,
    createdBy: userResult.userId,
  });

  if (movementError.error) {
    return { status: "error", message: movementError.error };
  }

  revalidateInventoryPaths();

  return { status: "success", message: "Stock removed." };
}

export async function transferInventoryStockAction(
  _previousState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const fromLocationId = getStringValue(formData, "fromLocationId");
  const toLocationId = getStringValue(formData, "toLocationId");
  const variantId = getStringValue(formData, "variantId");
  const quantityResult = validateQuantity(getStringValue(formData, "quantity"));
  const notes = getOptionalStringValue(formData, "notes");

  if (
    !validateUuid(fromLocationId) ||
    !validateUuid(toLocationId) ||
    !validateUuid(variantId)
  ) {
    return { status: "error", message: "Select valid locations and a variant." };
  }

  if (fromLocationId === toLocationId) {
    return {
      status: "error",
      message: "Source and destination locations must be different.",
    };
  }

  if (!quantityResult.ok) {
    return { status: "error", message: quantityResult.error };
  }

  const notesCheck = validateNotes(notes);

  if (!notesCheck.ok) {
    return { status: "error", message: notesCheck.error };
  }

  const [fromCheck, toCheck, variantCheck, userResult, sourceRow, destRow] =
    await Promise.all([
      assertActiveLocation(fromLocationId),
      assertActiveLocation(toLocationId),
      assertVariantExists(variantId),
      getCurrentUserId(),
      getInventoryRow(fromLocationId, variantId),
      getInventoryRow(toLocationId, variantId),
    ]);

  if (!fromCheck.ok) {
    return { status: "error", message: fromCheck.message };
  }

  if (!toCheck.ok) {
    return { status: "error", message: toCheck.message };
  }

  if (!variantCheck.ok) {
    return { status: "error", message: variantCheck.message };
  }

  if (userResult.error) {
    return { status: "error", message: userResult.error };
  }

  if (sourceRow.error || destRow.error) {
    return {
      status: "error",
      message: sourceRow.error ?? destRow.error ?? "Unable to load stock.",
    };
  }

  if (!sourceRow.row) {
    return { status: "error", message: "No stock exists at the source location." };
  }

  const available =
    sourceRow.row.quantity_on_hand - sourceRow.row.quantity_reserved;

  if (quantityResult.quantity > available) {
    return {
      status: "error",
      message: `Only ${available} units are available to transfer.`,
    };
  }

  const sourceBefore = sourceRow.row.quantity_on_hand;
  const sourceAfter = sourceBefore - quantityResult.quantity;
  const destBefore = destRow.row?.quantity_on_hand ?? 0;
  const destAfter = destBefore + quantityResult.quantity;
  const supabase = await createClient();

  const { error: sourceUpdateError } = await supabase
    .from("inventory")
    .update({
      quantity_on_hand: sourceAfter,
      quantity_available: Math.max(
        sourceAfter - sourceRow.row.quantity_reserved,
        0,
      ),
      updated_at: new Date().toISOString(),
    })
    .eq("location_id", fromLocationId)
    .eq("variant_id", variantId);

  if (sourceUpdateError) {
    return { status: "error", message: sourceUpdateError.message };
  }

  const destUpdate = destRow.row
    ? await supabase
        .from("inventory")
        .update({
          quantity_on_hand: destAfter,
          quantity_available: Math.max(
            destAfter - destRow.row.quantity_reserved,
            0,
          ),
          updated_at: new Date().toISOString(),
        })
        .eq("location_id", toLocationId)
        .eq("variant_id", variantId)
    : await supabase.from("inventory").insert({
        location_id: toLocationId,
        variant_id: variantId,
        quantity_on_hand: destAfter,
        quantity_reserved: 0,
        quantity_available: destAfter,
        reorder_level: sourceRow.row.reorder_level,
      });

  if (destUpdate.error) {
    await supabase
      .from("inventory")
      .update({
        quantity_on_hand: sourceBefore,
        quantity_available: Math.max(
          sourceBefore - sourceRow.row.quantity_reserved,
          0,
        ),
        updated_at: new Date().toISOString(),
      })
      .eq("location_id", fromLocationId)
      .eq("variant_id", variantId);

    return { status: "error", message: destUpdate.error.message };
  }

  const movementError = await insertMovement({
    movementType: "transfer",
    variantId,
    locationId: fromLocationId,
    toLocationId,
    quantity: quantityResult.quantity,
    quantityBefore: sourceBefore,
    quantityAfter: sourceAfter,
    notes,
    createdBy: userResult.userId,
  });

  if (movementError.error) {
    return { status: "error", message: movementError.error };
  }

  revalidateInventoryPaths();

  return { status: "success", message: "Stock transferred." };
}

export async function adjustInventoryStockAction(
  _previousState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const locationId = getStringValue(formData, "locationId");
  const variantId = getStringValue(formData, "variantId");
  const quantityResult = validateQuantity(getStringValue(formData, "quantity"));
  const direction = getStringValue(formData, "direction");
  const notes = getOptionalStringValue(formData, "notes");

  if (!validateUuid(locationId) || !validateUuid(variantId)) {
    return { status: "error", message: "Select a valid location and variant." };
  }

  if (direction !== "increase" && direction !== "decrease") {
    return { status: "error", message: "Select a valid adjustment direction." };
  }

  if (!quantityResult.ok) {
    return { status: "error", message: quantityResult.error };
  }

  const notesCheck = validateNotes(notes);

  if (!notesCheck.ok) {
    return { status: "error", message: notesCheck.error };
  }

  const [locationCheck, variantCheck, userResult, existing] = await Promise.all([
    assertActiveLocation(locationId),
    assertVariantExists(variantId),
    getCurrentUserId(),
    getInventoryRow(locationId, variantId),
  ]);

  if (!locationCheck.ok) {
    return { status: "error", message: locationCheck.message };
  }

  if (!variantCheck.ok) {
    return { status: "error", message: variantCheck.message };
  }

  if (userResult.error) {
    return { status: "error", message: userResult.error };
  }

  if (existing.error) {
    return { status: "error", message: existing.error };
  }

  const quantityBefore = existing.row?.quantity_on_hand ?? 0;
  const quantityAfter =
    direction === "increase"
      ? quantityBefore + quantityResult.quantity
      : quantityBefore - quantityResult.quantity;

  if (direction === "decrease") {
    if (!existing.row) {
      return { status: "error", message: "No stock record exists to adjust." };
    }

    const available = existing.row.quantity_on_hand - existing.row.quantity_reserved;

    if (quantityResult.quantity > available) {
      return {
        status: "error",
        message: `Only ${available} units are available to adjust down.`,
      };
    }
  }

  const updateResult = await upsertInventoryQuantity({
    locationId,
    variantId,
    quantityAfter,
    reorderThreshold: existing.row?.reorder_level,
  });

  if (!updateResult.ok) {
    return { status: "error", message: updateResult.message };
  }

  const movementError = await insertMovement({
    movementType: "adjustment",
    variantId,
    locationId,
    quantity: quantityResult.quantity,
    quantityBefore,
    quantityAfter,
    notes,
    createdBy: userResult.userId,
  });

  if (movementError.error) {
    return { status: "error", message: movementError.error };
  }

  revalidateInventoryPaths();

  return { status: "success", message: "Stock adjusted." };
}
