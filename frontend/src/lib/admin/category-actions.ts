"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export type CategoryActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCategoryActionState: CategoryActionState = {
  status: "idle",
  message: "",
};

type CategoryMutationInput = {
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

type CategoryValidationResult =
  | {
      data: CategoryMutationInput;
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

function validateCategoryForm(
  formData: FormData,
  currentId?: string,
): CategoryValidationResult {
  const name = getStringValue(formData, "name");
  const submittedSlug = getStringValue(formData, "slug");
  const slug = submittedSlug || slugify(name);
  const description = getOptionalStringValue(formData, "description");
  const imageUrl = getOptionalStringValue(formData, "imageUrl");
  const parentId = getOptionalStringValue(formData, "parentId");
  const sortOrderValue = getStringValue(formData, "sortOrder") || "0";
  const sortOrder = Number.parseInt(sortOrderValue, 10);
  const isActive = formData.get("isActive") === "on";

  if (name.length < 2 || name.length > 120) {
    return {
      error: "Category name must be between 2 and 120 characters.",
    };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      error:
        "Slug must use lowercase letters, numbers, and single hyphens only.",
    };
  }

  if (description && description.length > 500) {
    return {
      error: "Description must be 500 characters or fewer.",
    };
  }

  if (imageUrl && imageUrl.length > 2000) {
    return {
      error: "Image URL must be 2000 characters or fewer.",
    };
  }

  if (imageUrl) {
    try {
      const parsed = new URL(imageUrl);

      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return { error: "Image URL must start with http:// or https://." };
      }
    } catch {
      return { error: "Enter a valid image URL." };
    }
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 100000) {
    return {
      error: "Sort order must be a whole number between 0 and 100000.",
    };
  }

  if (parentId && !validateUuid(parentId)) {
    return {
      error: "Select a valid parent category.",
    };
  }

  if (currentId && parentId === currentId) {
    return {
      error: "A category cannot be its own parent.",
    };
  }

  return {
    data: {
      name,
      slug,
      description,
      image_url: imageUrl,
      parent_id: parentId,
      sort_order: sortOrder,
      is_active: isActive,
    },
  };
}

function revalidateCategoryPaths() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export async function createCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const validation = validateCategoryForm(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(validation.data);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateCategoryPaths();

  return { status: "success", message: "Category created." };
}

export async function updateCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const id = getStringValue(formData, "id");

  if (!validateUuid(id)) {
    return { status: "error", message: "Invalid category id." };
  }

  const validation = validateCategoryForm(formData, id);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update(validation.data)
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateCategoryPaths();

  return { status: "success", message: "Category updated." };
}

export async function deleteCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const id = getStringValue(formData, "id");

  if (!validateUuid(id)) {
    return { status: "error", message: "Invalid category id." };
  }

  const supabase = await createClient();
  const { count, error: childCheckError } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", id)
    .is("deleted_at", null);

  if (childCheckError) {
    return { status: "error", message: childCheckError.message };
  }

  if ((count ?? 0) > 0) {
    return {
      status: "error",
      message: "Remove or reassign child categories before deleting.",
    };
  }

  const { error } = await supabase
    .from("categories")
    .update({
      deleted_at: new Date().toISOString(),
      is_active: false,
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateCategoryPaths();

  return { status: "success", message: "Category deleted." };
}
