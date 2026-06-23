import { createClient } from "@/src/lib/supabase/server";

export type ProductVariantRecord = {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  unit: string | null;
  is_active: boolean | null;
};

export type ProductVariantPageContext = {
  productId: string;
  productName: string;
  variants: ProductVariantRecord[];
  error: string | null;
};

function validateUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function getProductVariantPageContext(
  productId: string,
): Promise<ProductVariantPageContext> {
  if (!validateUuid(productId)) {
    return {
      productId,
      productName: "",
      variants: [],
      error: "Invalid product id.",
    };
  }

  const supabase = await createClient();

  const [productResult, variantsResult] = await Promise.all([
    supabase
      .from("products")
      .select("id, name")
      .eq("id", productId)
      .is("deleted_at", null)
      .maybeSingle()
      .returns<{ id: string; name: string } | null>(),
    supabase
      .from("product_variants")
      .select("id, product_id, sku, price, unit, is_active")
      .eq("product_id", productId)
      .order("price", { ascending: true })
      .order("sku", { ascending: true })
      .returns<ProductVariantRecord[]>(),
  ]);

  if (productResult.error) {
    return {
      productId,
      productName: "",
      variants: [],
      error: productResult.error.message,
    };
  }

  if (!productResult.data) {
    return {
      productId,
      productName: "",
      variants: [],
      error: null,
    };
  }

  if (variantsResult.error) {
    return {
      productId,
      productName: productResult.data.name,
      variants: [],
      error: variantsResult.error.message,
    };
  }

  return {
    productId,
    productName: productResult.data.name,
    variants: variantsResult.data ?? [],
    error: null,
  };
}
