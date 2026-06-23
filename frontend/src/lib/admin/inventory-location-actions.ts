"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export type InventoryActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialInventoryActionState: InventoryActionState = {
  status: "idle",
  message: "",
};

type LocationMutationInput = {
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
};

type LocationValidationResult =
  | { data: LocationMutationInput; error?: never }
  | { data?: never; error: string };

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalStringValue(formData: FormData, key: string) {
  const value = getStringValue(formData, key);

  return value.length > 0 ? value : null;
}

function slugify(value: string) {
  return value
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function validateLocationForm(formData: FormData): LocationValidationResult {
  const name = getStringValue(formData, "name");
  const submittedCode = getStringValue(formData, "code");
  const code = (submittedCode || slugify(name)).toUpperCase();
  const description = getOptionalStringValue(formData, "description");
  const isActive = formData.get("isActive") === "on";

  if (name.length < 2 || name.length > 120) {
    return { error: "Location name must be between 2 and 120 characters." };
  }

  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(code)) {
    return {
      error:
        "Location code must use uppercase letters, numbers, and single hyphens only.",
    };
  }

  if (description && description.length > 500) {
    return { error: "Description must be 500 characters or fewer." };
  }

  return {
    data: {
      name,
      code,
      description,
      is_active: isActive,
    },
  };
}

function revalidateInventoryPaths() {
  revalidatePath("/admin/inventory");
}

export async function createInventoryLocationAction(
  _previousState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const validation = validateLocationForm(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inventory_locations").insert(validation.data);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateInventoryPaths();

  return { status: "success", message: "Location created." };
}

export async function updateInventoryLocationAction(
  _previousState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const id = getStringValue(formData, "id");

  if (!validateUuid(id)) {
    return { status: "error", message: "Invalid location id." };
  }

  const validation = validateLocationForm(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("inventory_locations")
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateInventoryPaths();

  return { status: "success", message: "Location updated." };
}

export async function deleteInventoryLocationAction(
  _previousState: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const id = getStringValue(formData, "id");

  if (!validateUuid(id)) {
    return { status: "error", message: "Invalid location id." };
  }

  const supabase = await createClient();
  const { count, error: stockError } = await supabase
    .from("inventory")
    .select("id", { count: "exact", head: true })
    .eq("location_id", id)
    .gt("quantity_on_hand", 0);

  if (stockError) {
    return { status: "error", message: stockError.message };
  }

  if ((count ?? 0) > 0) {
    return {
      status: "error",
      message: "Move or remove stock before deleting this location.",
    };
  }

  const { error } = await supabase
    .from("inventory_locations")
    .update({
      deleted_at: new Date().toISOString(),
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateInventoryPaths();

  return { status: "success", message: "Location deleted." };
}
