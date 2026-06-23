import { createClient } from "@/src/lib/supabase/server";

export const PRODUCTS_PAGE_SIZE = 10;

export type ProductStatus = "draft" | "active" | "inactive" | "archived";

export type ProductCategoryOption = {
  id: string;
  name: string;
};

export type ProductVariantSummary = {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  is_active: boolean | null;
};

export type ProductImageSummary = {
  id: string;
  product_id: string;
  variant_id: string | null;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type ProductRecord = {
  id: string;
  primary_category_id: string | null;
  name: string;
  slug: string | null;
  description: string | null;
  brand: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};

export type ProductListItem = ProductRecord & {
  categoryName: string;
  basePrice: number | null;
  sku: string;
};

export type ProductDetail = ProductRecord & {
  categoryName: string;
  images: ProductImageSummary[];
  variants: ProductVariantSummary[];
};

export type ProductListResult = {
  products: ProductListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  error: string | null;
};

function normalizeSearch(value: string) {
  return value.trim().replace(/[,%()]/g, " ").replace(/\s+/g, " ");
}

function buildProductSearchFilter(search: string, productIds: string[]) {
  const filters = [
    `name.ilike.%${search}%`,
    `slug.ilike.%${search}%`,
    `brand.ilike.%${search}%`,
  ];

  if (productIds.length > 0) {
    filters.push(`id.in.(${productIds.join(",")})`);
  }

  return filters.join(",");
}

async function getProductIdsBySku(search: string) {
  if (!search) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("product_id")
    .ilike("sku", `%${search}%`)
    .limit(100)
    .returns<Array<{ product_id: string }>>();

  if (error) {
    return [];
  }

  return Array.from(new Set((data ?? []).map((row) => row.product_id)));
}

export async function getProductCategoryOptions(): Promise<{
  categories: ProductCategoryOption[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(500)
    .returns<ProductCategoryOption[]>();

  if (error) {
    return {
      categories: [],
      error: error.message,
    };
  }

  return {
    categories: data ?? [],
    error: null,
  };
}

export async function getProducts({
  categoryId,
  page,
  search,
}: {
  categoryId: string;
  page: number;
  search: string;
}): Promise<ProductListResult> {
  const supabase = await createClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const from = (safePage - 1) * PRODUCTS_PAGE_SIZE;
  const to = from + PRODUCTS_PAGE_SIZE - 1;
  const normalizedSearch = normalizeSearch(search);
  const skuProductIds = await getProductIdsBySku(normalizedSearch);

  let query = supabase
    .from("products")
    .select(
      "id, primary_category_id, name, slug, description, brand, status, created_at, updated_at",
      { count: "exact" },
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (categoryId) {
    query = query.eq("primary_category_id", categoryId);
  }

  if (normalizedSearch) {
    query = query.or(buildProductSearchFilter(normalizedSearch, skuProductIds));
  }

  const { data, count, error } = await query.returns<ProductRecord[]>();

  if (error) {
    return {
      products: [],
      totalCount: 0,
      page: safePage,
      pageSize: PRODUCTS_PAGE_SIZE,
      error: error.message,
    };
  }

  const products = data ?? [];
  const productIds = products.map((product) => product.id);
  const categoryIds = products
    .map((product) => product.primary_category_id)
    .filter((id): id is string => Boolean(id));

  const [variantsResult, categoriesResult] = await Promise.all([
    productIds.length
      ? supabase
          .from("product_variants")
          .select("id, product_id, sku, price, is_active")
          .in("product_id", productIds)
          .order("price", { ascending: true })
          .returns<ProductVariantSummary[]>()
      : Promise.resolve({ data: [], error: null }),
    categoryIds.length
      ? supabase
          .from("categories")
          .select("id, name")
          .in("id", categoryIds)
          .returns<ProductCategoryOption[]>()
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (variantsResult.error || categoriesResult.error) {
    return {
      products: [],
      totalCount: 0,
      page: safePage,
      pageSize: PRODUCTS_PAGE_SIZE,
      error: variantsResult.error?.message ?? categoriesResult.error?.message ?? null,
    };
  }

  const categoryNameById = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category.name]),
  );
  const variantsByProductId = new Map<string, ProductVariantSummary[]>();

  for (const variant of variantsResult.data ?? []) {
    const existing = variantsByProductId.get(variant.product_id) ?? [];
    existing.push(variant);
    variantsByProductId.set(variant.product_id, existing);
  }

  return {
    products: products.map((product) => {
      const variants = variantsByProductId.get(product.id) ?? [];
      const baseVariant = variants[0];

      return {
        ...product,
        categoryName: product.primary_category_id
          ? (categoryNameById.get(product.primary_category_id) ?? "Unassigned")
          : "Unassigned",
        basePrice: baseVariant?.price ?? null,
        sku: baseVariant?.sku ?? "No SKU",
      };
    }),
    totalCount: count ?? 0,
    page: safePage,
    pageSize: PRODUCTS_PAGE_SIZE,
    error: null,
  };
}

export async function getProductById(
  productId: string,
): Promise<{ product: ProductDetail | null; error: string | null }> {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, primary_category_id, name, slug, description, brand, status, created_at, updated_at",
    )
    .eq("id", productId)
    .is("deleted_at", null)
    .maybeSingle()
    .returns<ProductRecord | null>();

  if (error) {
    return {
      product: null,
      error: error.message,
    };
  }

  if (!product) {
    return {
      product: null,
      error: null,
    };
  }

  const [variantsResult, imagesResult, categoryResult] = await Promise.all([
    supabase
      .from("product_variants")
      .select("id, product_id, sku, price, is_active")
      .eq("product_id", product.id)
      .order("price", { ascending: true })
      .returns<ProductVariantSummary[]>(),
    supabase
      .from("product_images")
      .select("id, product_id, variant_id, alt_text, sort_order, is_primary")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true })
      .returns<ProductImageSummary[]>(),
    product.primary_category_id
      ? supabase
          .from("categories")
          .select("id, name")
          .eq("id", product.primary_category_id)
          .maybeSingle()
          .returns<ProductCategoryOption | null>()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (variantsResult.error || imagesResult.error || categoryResult.error) {
    return {
      product: null,
      error:
        variantsResult.error?.message ??
        imagesResult.error?.message ??
        categoryResult.error?.message ??
        null,
    };
  }

  return {
    product: {
      ...product,
      categoryName: categoryResult.data?.name ?? "Unassigned",
      images: imagesResult.data ?? [],
      variants: variantsResult.data ?? [],
    },
    error: null,
  };
}
