"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export type ProductVariantActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialProductVariantActionState: ProductVariantActionState = {
  status: "idle",
  message: "",
};

type ProductVariantRow = {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  unit: string | null;
  weight_grams: number | null;
  attributes: Record<string, unknown> | null;
  is_active: boolean | null;
};

type VariantMutationInput = {
  name: string | null;
  sku: string;
  price: number;
  unit: string;
  weightGrams: number | null;
  isActive: boolean;
};

type VariantValidationResult =
  | {
      data: VariantMutationInput;
      error?: never;
    }
  | {
      data?: never;
      error: string;
    };

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function validateUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function validateVariantForm(formData: FormData): VariantValidationResult {
  const name = getStringValue(formData, "name");
  const sku = getStringValue(formData, "sku").toUpperCase();
  const priceValue = getStringValue(formData, "price");
  const price = Number.parseFloat(priceValue);
  const unit = getStringValue(formData, "unit");
  const weightValue = getStringValue(formData, "weightGrams");
  const weightGrams = weightValue ? Number.parseInt(weightValue, 10) : null;
  const isActive = formData.get("isActive") === "on";

  if (name && name.length > 120) {
    return {
      error: "Variant name must be 120 characters or fewer.",
    };
  }

  if (sku.length < 2 || sku.length > 64) {
    return {
      error: "SKU must be between 2 and 64 characters.",
    };
  }

  if (!/^[A-Z0-9][A-Z0-9._-]*$/.test(sku)) {
    return {
      error:
        "SKU must use uppercase letters, numbers, dots, underscores, or hyphens.",
    };
  }

  if (!Number.isFinite(price) || price < 0 || price > 10000000) {
    return {
      error: "Price must be a number between 0 and 10,000,000.",
    };
  }

  if (unit.length < 1 || unit.length > 32) {
    return {
      error: "Unit must be between 1 and 32 characters.",
    };
  }

  if (!/^[A-Za-z0-9][A-Za-z0-9 ./-]*$/.test(unit)) {
    return {
      error:
        "Unit must start with a letter or number and use letters, numbers, spaces, dots, slashes, or hyphens.",
    };
  }

  if (
    weightGrams !== null &&
    (!Number.isInteger(weightGrams) || weightGrams < 0 || weightGrams > 1000000)
  ) {
    return {
      error: "Weight must be a whole gram value between 0 and 1,000,000.",
    };
  }

  return {
    data: {
      name: name || null,
      sku,
      price,
      unit,
      weightGrams,
      isActive,
    },
  };
}

function revalidateProductVariantPaths(productId: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath(`/admin/products/${productId}/variants`);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin/products");
}

async function assertProductExists(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .is("deleted_at", null)
    .maybeSingle()
    .returns<{ id: string } | null>();

  if (error) {
    return { ok: false as const, message: error.message };
  }

  if (!data) {
    return { ok: false as const, message: "Product was not found." };
  }

  return { ok: true as const };
}

async function getProductVariant(productId: string, variantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("id, product_id, sku, price, unit, weight_grams, attributes, is_active")
    .eq("id", variantId)
    .eq("product_id", productId)
    .maybeSingle()
    .returns<ProductVariantRow | null>();

  if (error) {
    return { variant: null, error: error.message };
  }

  if (!data) {
    return { variant: null, error: "Variant was not found for this product." };
  }

  return { variant: data, error: null };
}

async function getProductVariantCount(productId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("product_variants")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (error) {
    return { count: null, error: error.message };
  }

  return { count: count ?? 0, error: null };
}

export async function createProductVariantAction(
  _previousState: ProductVariantActionState,
  formData: FormData,
): Promise<ProductVariantActionState> {
  const productId = getStringValue(formData, "productId");

  if (!validateUuid(productId)) {
    return { status: "error", message: "Invalid product id." };
  }

  const validation = validateVariantForm(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const productCheck = await assertProductExists(productId);

  if (!productCheck.ok) {
    return { status: "error", message: productCheck.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    sku: validation.data.sku,
    price: validation.data.price,
    unit: validation.data.unit,
    weight_grams: validation.data.weightGrams,
    attributes: validation.data.name ? { name: validation.data.name } : {},
    is_active: validation.data.isActive,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateProductVariantPaths(productId);

  return { status: "success", message: "Variant created." };
}

export async function updateProductVariantAction(
  _previousState: ProductVariantActionState,
  formData: FormData,
): Promise<ProductVariantActionState> {
  const productId = getStringValue(formData, "productId");
  const variantId = getStringValue(formData, "variantId");

  if (!validateUuid(productId) || !validateUuid(variantId)) {
    return { status: "error", message: "Invalid product or variant id." };
  }

  const validation = validateVariantForm(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const variantCheck = await getProductVariant(productId, variantId);

  if (variantCheck.error || !variantCheck.variant) {
    return {
      status: "error",
      message: variantCheck.error ?? "Variant was not found.",
    };
  }

  const supabase = await createClient();
  const currentAttributes = variantCheck.variant.attributes ?? {};
  const nextAttributes = validation.data.name
    ? { ...currentAttributes, name: validation.data.name }
    : Object.fromEntries(
        Object.entries(currentAttributes).filter(([key]) => key !== "name"),
      );

  const { error } = await supabase
    .from("product_variants")
    .update({
      sku: validation.data.sku,
      price: validation.data.price,
      unit: validation.data.unit,
      weight_grams: validation.data.weightGrams,
      attributes: nextAttributes,
      is_active: validation.data.isActive,
    })
    .eq("id", variantId)
    .eq("product_id", productId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateProductVariantPaths(productId);

  return { status: "success", message: "Variant updated." };
}

export async function deleteProductVariantAction(
  _previousState: ProductVariantActionState,
  formData: FormData,
): Promise<ProductVariantActionState> {
  const productId = getStringValue(formData, "productId");
  const variantId = getStringValue(formData, "variantId");

  if (!validateUuid(productId) || !validateUuid(variantId)) {
    return { status: "error", message: "Invalid product or variant id." };
  }

  const variantCheck = await getProductVariant(productId, variantId);

  if (variantCheck.error || !variantCheck.variant) {
    return {
      status: "error",
      message: variantCheck.error ?? "Variant was not found.",
    };
  }

  const { count, error: countError } = await getProductVariantCount(productId);

  if (countError) {
    return { status: "error", message: countError };
  }

  if ((count ?? 0) <= 1) {
    return {
      status: "error",
      message: "A product must keep at least one variant.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId)
    .eq("product_id", productId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateProductVariantPaths(productId);

  return { status: "success", message: "Variant deleted." };
}

export async function setProductVariantActiveAction(
  _previousState: ProductVariantActionState,
  formData: FormData,
): Promise<ProductVariantActionState> {
  const productId = getStringValue(formData, "productId");
  const variantId = getStringValue(formData, "variantId");
  const isActiveValue = getStringValue(formData, "isActive");

  if (!validateUuid(productId) || !validateUuid(variantId)) {
    return { status: "error", message: "Invalid product or variant id." };
  }

  if (isActiveValue !== "true" && isActiveValue !== "false") {
    return { status: "error", message: "Invalid variant status." };
  }

  const variantCheck = await getProductVariant(productId, variantId);

  if (variantCheck.error || !variantCheck.variant) {
    return {
      status: "error",
      message: variantCheck.error ?? "Variant was not found.",
    };
  }

  const isActive = isActiveValue === "true";
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_variants")
    .update({ is_active: isActive })
    .eq("id", variantId)
    .eq("product_id", productId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateProductVariantPaths(productId);

  return {
    status: "success",
    message: isActive ? "Variant activated." : "Variant deactivated.",
  };
}
