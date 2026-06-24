"use server";

import { revalidatePath } from "next/cache";
import type { ProductStatus } from "@/src/lib/admin/products";
import { createClient } from "@/src/lib/supabase/server";

export type ProductActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialProductActionState: ProductActionState = {
  status: "idle",
  message: "",
};

export const PRODUCT_STATUS_OPTIONS: ProductStatus[] = [
  "draft",
  "active",
  "inactive",
  "archived",
];

type ProductMutationInput = {
  name: string;
  slug: string;
  description: string | null;
  primary_category_id: string;
  brand: string | null;
  status: ProductStatus;
  featured: boolean;
  sku: string;
  basePrice: number;
};

type ProductValidationResult =
  | {
      data: ProductMutationInput;
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

function getOptionalStringValue(formData: FormData, key: string) {
  const value = getStringValue(formData, key);

  return value.length > 0 ? value : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function validateProductStatus(value: string): value is ProductStatus {
  return PRODUCT_STATUS_OPTIONS.includes(value as ProductStatus);
}

function validateProductForm(formData: FormData): ProductValidationResult {
  const name = getStringValue(formData, "name");
  const submittedSlug = getStringValue(formData, "slug");
  const slug = submittedSlug || slugify(name);
  const description = getOptionalStringValue(formData, "description");
  const categoryId = getStringValue(formData, "categoryId");
  const brand = getOptionalStringValue(formData, "brand");
  const statusValue = getStringValue(formData, "status") || "draft";
  const featured = formData.get("featured") === "on";
  const sku = getStringValue(formData, "sku").toUpperCase();
  const basePriceValue = getStringValue(formData, "basePrice");
  const basePrice = Number.parseFloat(basePriceValue);

  if (name.length < 2 || name.length > 200) {
    return {
      error: "Product name must be between 2 and 200 characters.",
    };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      error:
        "Slug must use lowercase letters, numbers, and single hyphens only.",
    };
  }

  if (description && description.length > 5000) {
    return {
      error: "Description must be 5000 characters or fewer.",
    };
  }

  if (!validateUuid(categoryId)) {
    return {
      error: "Select a valid category.",
    };
  }

  if (brand && brand.length > 120) {
    return {
      error: "Brand must be 120 characters or fewer.",
    };
  }

  if (!validateProductStatus(statusValue)) {
    return {
      error: "Select a valid product status.",
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

  if (!Number.isFinite(basePrice) || basePrice < 0 || basePrice > 10000000) {
    return {
      error: "Base price must be a number between 0 and 10,000,000.",
    };
  }

  return {
    data: {
      name,
      slug,
      description,
      primary_category_id: categoryId,
      brand,
      status: statusValue,
      featured,
      sku,
      basePrice,
    },
  };
}

async function validateCategoryExists(categoryId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    return { ok: false as const, message: error.message };
  }

  if (!data) {
    return { ok: false as const, message: "Selected category was not found." };
  }

  return { ok: true as const };
}

async function getBaseVariantId(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId)
    .order("price", { ascending: true })
    .limit(1)
    .maybeSingle()
    .returns<{ id: string } | null>();

  if (error) {
    return { variantId: null, error: error.message };
  }

  return { variantId: data?.id ?? null, error: null };
}

async function getProductMetadata(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("metadata")
    .eq("id", productId)
    .maybeSingle()
    .returns<{ metadata: Record<string, unknown> | null } | null>();

  if (error) {
    return { metadata: null, error: error.message };
  }

  return { metadata: data?.metadata ?? {}, error: null };
}

function revalidateProductPaths(productId?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");

  if (productId) {
    revalidatePath("/products/[slug]", "page");
    revalidatePath(`/admin/products/${productId}`);
  }
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const validation = validateProductForm(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const categoryCheck = await validateCategoryExists(
    validation.data.primary_category_id,
  );

  if (!categoryCheck.ok) {
    return { status: "error", message: categoryCheck.message };
  }

  const supabase = await createClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name: validation.data.name,
      slug: validation.data.slug,
      description: validation.data.description,
      primary_category_id: validation.data.primary_category_id,
      brand: validation.data.brand,
      status: validation.data.status,
      metadata: { featured: validation.data.featured },
    })
    .select("id")
    .single()
    .returns<{ id: string }>();

  if (productError || !product) {
    return {
      status: "error",
      message: productError?.message ?? "Unable to create product.",
    };
  }

  const { error: variantError } = await supabase.from("product_variants").insert({
    product_id: product.id,
    sku: validation.data.sku,
    price: validation.data.basePrice,
    is_active: validation.data.status === "active",
  });

  if (variantError) {
    await supabase.from("products").delete().eq("id", product.id);

    return { status: "error", message: variantError.message };
  }

  revalidateProductPaths(product.id);

  return { status: "success", message: "Product created." };
}

export async function updateProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const id = getStringValue(formData, "id");

  if (!validateUuid(id)) {
    return { status: "error", message: "Invalid product id." };
  }

  const validation = validateProductForm(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const categoryCheck = await validateCategoryExists(
    validation.data.primary_category_id,
  );

  if (!categoryCheck.ok) {
    return { status: "error", message: categoryCheck.message };
  }

  const supabase = await createClient();
  const metadataResult = await getProductMetadata(id);

  if (metadataResult.error) {
    return { status: "error", message: metadataResult.error };
  }

  const { error: productError } = await supabase
    .from("products")
    .update({
      name: validation.data.name,
      slug: validation.data.slug,
      description: validation.data.description,
      primary_category_id: validation.data.primary_category_id,
      brand: validation.data.brand,
      status: validation.data.status,
      metadata: {
        ...(metadataResult.metadata ?? {}),
        featured: validation.data.featured,
      },
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (productError) {
    return { status: "error", message: productError.message };
  }

  const { variantId, error: variantLookupError } = await getBaseVariantId(id);

  if (variantLookupError) {
    return { status: "error", message: variantLookupError };
  }

  const variantPayload = {
    sku: validation.data.sku,
    price: validation.data.basePrice,
    is_active: validation.data.status === "active",
  };

  const { error: variantError } = variantId
    ? await supabase
        .from("product_variants")
        .update(variantPayload)
        .eq("id", variantId)
    : await supabase.from("product_variants").insert({
        product_id: id,
        ...variantPayload,
      });

  if (variantError) {
    return { status: "error", message: variantError.message };
  }

  revalidateProductPaths(id);

  return { status: "success", message: "Product updated." };
}

export async function updateProductStatusAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const id = getStringValue(formData, "id");
  const statusValue = getStringValue(formData, "status");

  if (!validateUuid(id)) {
    return { status: "error", message: "Invalid product id." };
  }

  if (!validateProductStatus(statusValue)) {
    return { status: "error", message: "Select a valid product status." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ status: statusValue })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { status: "error", message: error.message };
  }

  const { variantId, error: variantLookupError } = await getBaseVariantId(id);

  if (variantLookupError) {
    return { status: "error", message: variantLookupError };
  }

  if (variantId) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .update({ is_active: statusValue === "active" })
      .eq("id", variantId);

    if (variantError) {
      return { status: "error", message: variantError.message };
    }
  }

  revalidateProductPaths(id);

  return { status: "success", message: "Product status updated." };
}

export async function deleteProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const id = getStringValue(formData, "id");

  if (!validateUuid(id)) {
    return { status: "error", message: "Invalid product id." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      deleted_at: new Date().toISOString(),
      status: "archived",
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { status: "error", message: error.message };
  }

  await supabase
    .from("product_variants")
    .update({ is_active: false })
    .eq("product_id", id);

  revalidateProductPaths(id);

  return { status: "success", message: "Product deleted." };
}
