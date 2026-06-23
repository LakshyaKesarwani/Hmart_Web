import { createClient } from "@/src/lib/supabase/server";
import { getProductImagePublicUrl } from "@/src/lib/supabase/storage";

export type ProductImageRecord = {
  id: string;
  product_id: string;
  variant_id: string | null;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type ProductImageWithUrl = ProductImageRecord & {
  publicUrl: string;
};

export type ProductImagePageContext = {
  productId: string;
  productName: string;
  images: ProductImageWithUrl[];
  error: string | null;
};

function validateUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function getProductImagePageContext(
  productId: string,
): Promise<ProductImagePageContext> {
  if (!validateUuid(productId)) {
    return {
      productId,
      productName: "",
      images: [],
      error: "Invalid product id.",
    };
  }

  const supabase = await createClient();

  const [productResult, imagesResult] = await Promise.all([
    supabase
      .from("products")
      .select("id, name")
      .eq("id", productId)
      .is("deleted_at", null)
      .maybeSingle()
      .returns<{ id: string; name: string } | null>(),
    supabase
      .from("product_images")
      .select(
        "id, product_id, variant_id, storage_path, alt_text, sort_order, is_primary",
      )
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .returns<ProductImageRecord[]>(),
  ]);

  if (productResult.error) {
    return {
      productId,
      productName: "",
      images: [],
      error: productResult.error.message,
    };
  }

  if (!productResult.data) {
    return {
      productId,
      productName: "",
      images: [],
      error: null,
    };
  }

  if (imagesResult.error) {
    return {
      productId,
      productName: productResult.data.name,
      images: [],
      error: imagesResult.error.message,
    };
  }

  return {
    productId,
    productName: productResult.data.name,
    images: (imagesResult.data ?? [])
      .filter((image) => Boolean(image.storage_path))
      .map((image) => ({
        ...image,
        publicUrl: getProductImagePublicUrl(image.storage_path),
      })),
    error: null,
  };
}
