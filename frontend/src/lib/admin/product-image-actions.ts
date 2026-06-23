"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { PRODUCT_IMAGES_BUCKET } from "@/src/lib/supabase/storage";

export type ProductImageActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialProductImageActionState: ProductImageActionState = {
  status: "idle",
  message: "",
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

type ProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  sort_order: number;
  is_primary: boolean;
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

function revalidateProductImagePaths(productId: string) {
  revalidatePath(`/admin/products/${productId}/images`);
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

async function getProductImages(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("id, product_id, storage_path, sort_order, is_primary")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .returns<ProductImageRow[]>();

  if (error) {
    return { images: null, error: error.message };
  }

  return { images: data ?? [], error: null };
}

async function getProductImage(productId: string, imageId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("id, product_id, storage_path, sort_order, is_primary")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle()
    .returns<ProductImageRow | null>();

  if (error) {
    return { image: null, error: error.message };
  }

  if (!data) {
    return { image: null, error: "Image was not found for this product." };
  }

  return { image: data, error: null };
}

async function promoteNextPrimaryImage(productId: string, excludedImageId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("product_images")
    .select("id")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (excludedImageId) {
    query = query.neq("id", excludedImageId);
  }

  const { data, error } = await query.maybeSingle().returns<{ id: string } | null>();

  if (error) {
    return { ok: false as const, message: error.message };
  }

  if (!data) {
    return { ok: true as const };
  }

  const { error: updateError } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", data.id);

  if (updateError) {
    return { ok: false as const, message: updateError.message };
  }

  return { ok: true as const };
}

function validateUploadInput(formData: FormData) {
  const productId = getStringValue(formData, "productId");
  const altText = getOptionalStringValue(formData, "altText");
  const file = formData.get("file");

  if (!validateUuid(productId)) {
    return { error: "Invalid product id." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Select an image file to upload." };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: "Image must be 5 MB or smaller." };
  }

  const extension = ALLOWED_IMAGE_TYPES.get(file.type);

  if (!extension) {
    return {
      error: "Only JPEG, PNG, WebP, and GIF images are supported.",
    };
  }

  if (altText && altText.length > 200) {
    return { error: "Alt text must be 200 characters or fewer." };
  }

  return {
    data: {
      productId,
      altText,
      file,
      extension,
    },
  };
}

export async function uploadProductImageAction(
  _previousState: ProductImageActionState,
  formData: FormData,
): Promise<ProductImageActionState> {
  const validation = validateUploadInput(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const productCheck = await assertProductExists(validation.data.productId);

  if (!productCheck.ok) {
    return { status: "error", message: productCheck.message };
  }

  const { images, error: imagesError } = await getProductImages(
    validation.data.productId,
  );

  if (imagesError || !images) {
    return { status: "error", message: imagesError ?? "Unable to load images." };
  }

  const supabase = await createClient();
  const imageId = crypto.randomUUID();
  const storagePath = `${validation.data.productId}/${imageId}.${validation.data.extension}`;
  const nextSortOrder =
    images.length > 0
      ? Math.max(...images.map((image) => image.sort_order)) + 1
      : 0;
  const isPrimary = images.length === 0;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(storagePath, validation.data.file, {
      contentType: validation.data.file.type,
      upsert: false,
    });

  if (uploadError) {
    return { status: "error", message: uploadError.message };
  }

  const { error: insertError } = await supabase.from("product_images").insert({
    id: imageId,
    product_id: validation.data.productId,
    storage_path: storagePath,
    alt_text: validation.data.altText,
    sort_order: nextSortOrder,
    is_primary: isPrimary,
    variant_id: null,
  });

  if (insertError) {
    await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([storagePath]);

    return { status: "error", message: insertError.message };
  }

  revalidateProductImagePaths(validation.data.productId);

  return { status: "success", message: "Image uploaded." };
}

export async function deleteProductImageAction(
  _previousState: ProductImageActionState,
  formData: FormData,
): Promise<ProductImageActionState> {
  const productId = getStringValue(formData, "productId");
  const imageId = getStringValue(formData, "imageId");

  if (!validateUuid(productId) || !validateUuid(imageId)) {
    return { status: "error", message: "Invalid product or image id." };
  }

  const { image, error } = await getProductImage(productId, imageId);

  if (error || !image) {
    return { status: "error", message: error ?? "Image was not found." };
  }

  const supabase = await createClient();
  const { error: storageError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([image.storage_path]);

  if (storageError) {
    return { status: "error", message: storageError.message };
  }

  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId);

  if (deleteError) {
    return { status: "error", message: deleteError.message };
  }

  if (image.is_primary) {
    const promoteResult = await promoteNextPrimaryImage(productId);

    if (!promoteResult.ok) {
      return { status: "error", message: promoteResult.message };
    }
  }

  revalidateProductImagePaths(productId);

  return { status: "success", message: "Image deleted." };
}

export async function setPrimaryProductImageAction(
  _previousState: ProductImageActionState,
  formData: FormData,
): Promise<ProductImageActionState> {
  const productId = getStringValue(formData, "productId");
  const imageId = getStringValue(formData, "imageId");

  if (!validateUuid(productId) || !validateUuid(imageId)) {
    return { status: "error", message: "Invalid product or image id." };
  }

  const imageCheck = await getProductImage(productId, imageId);

  if (imageCheck.error || !imageCheck.image) {
    return {
      status: "error",
      message: imageCheck.error ?? "Image was not found.",
    };
  }

  const supabase = await createClient();
  const { error: clearError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  if (clearError) {
    return { status: "error", message: clearError.message };
  }

  const { error: setError } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId)
    .eq("product_id", productId);

  if (setError) {
    return { status: "error", message: setError.message };
  }

  revalidateProductImagePaths(productId);

  return { status: "success", message: "Primary image updated." };
}

export async function reorderProductImageAction(
  _previousState: ProductImageActionState,
  formData: FormData,
): Promise<ProductImageActionState> {
  const productId = getStringValue(formData, "productId");
  const imageId = getStringValue(formData, "imageId");
  const direction = getStringValue(formData, "direction");

  if (!validateUuid(productId) || !validateUuid(imageId)) {
    return { status: "error", message: "Invalid product or image id." };
  }

  if (direction !== "up" && direction !== "down") {
    return { status: "error", message: "Invalid reorder direction." };
  }

  const { images, error } = await getProductImages(productId);

  if (error || !images) {
    return { status: "error", message: error ?? "Unable to load images." };
  }

  const currentIndex = images.findIndex((image) => image.id === imageId);

  if (currentIndex === -1) {
    return { status: "error", message: "Image was not found for this product." };
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= images.length) {
    return { status: "error", message: "Image cannot move further in that direction." };
  }

  const currentImage = images[currentIndex];
  const targetImage = images[targetIndex];
  const supabase = await createClient();

  const { error: currentError } = await supabase
    .from("product_images")
    .update({ sort_order: targetImage.sort_order })
    .eq("id", currentImage.id)
    .eq("product_id", productId);

  if (currentError) {
    return { status: "error", message: currentError.message };
  }

  const { error: targetError } = await supabase
    .from("product_images")
    .update({ sort_order: currentImage.sort_order })
    .eq("id", targetImage.id)
    .eq("product_id", productId);

  if (targetError) {
    return { status: "error", message: targetError.message };
  }

  revalidateProductImagePaths(productId);

  return { status: "success", message: "Image order updated." };
}
