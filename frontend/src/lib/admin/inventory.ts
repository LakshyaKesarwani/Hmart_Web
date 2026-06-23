import { createClient } from "@/src/lib/supabase/server";

export const INVENTORY_PAGE_SIZE = 10;
export const LOW_STOCK_PAGE_SIZE = 10;

export type InventoryMovementType =
  | "incoming"
  | "outgoing"
  | "transfer"
  | "adjustment";

export const INVENTORY_MOVEMENT_TYPES: InventoryMovementType[] = [
  "incoming",
  "outgoing",
  "transfer",
  "adjustment",
];

export type InventoryLocationRow = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type InventoryLocationListResult = {
  locations: InventoryLocationRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type InventoryLocationOption = {
  id: string;
  name: string;
  code: string;
};

export type InventoryVariantOption = {
  id: string;
  sku: string;
  productName: string;
};

type InventoryRecord = {
  id: string;
  location_id: string;
  variant_id: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  reorder_threshold: number;
};

export type InventoryStockItem = InventoryRecord & {
  locationName: string;
  locationCode: string;
  sku: string;
  productName: string;
  availableQuantity: number;
  isLowStock: boolean;
};

export type InventoryStockListResult = {
  stock: InventoryStockItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type InventoryMovementRecord = {
  id: string;
  movement_type: InventoryMovementType;
  variant_id: string;
  location_id: string;
  to_location_id: string | null;
  quantity: number;
  quantity_before: number;
  quantity_after: number;
  notes: string | null;
  created_at: string;
};

export type InventoryMovementItem = InventoryMovementRecord & {
  sku: string;
  productName: string;
  locationName: string;
  toLocationName: string | null;
};

export type InventoryMovementListResult = {
  movements: InventoryMovementItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type LowStockItem = InventoryStockItem;

export type LowStockListResult = {
  items: LowStockItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  error: string | null;
};

function normalizeSearch(value: string) {
  return value.trim().replace(/[,%()]/g, " ").replace(/\s+/g, " ");
}

function validateMovementType(value: string): value is InventoryMovementType {
  return INVENTORY_MOVEMENT_TYPES.includes(value as InventoryMovementType);
}

export async function getInventoryLocations({
  page,
  search,
}: {
  page: number;
  search: string;
}): Promise<InventoryLocationListResult> {
  const supabase = await createClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const from = (safePage - 1) * INVENTORY_PAGE_SIZE;
  const to = from + INVENTORY_PAGE_SIZE - 1;
  const normalizedSearch = normalizeSearch(search);

  let query = supabase
    .from("inventory_locations")
    .select(
      "id, name, code, description, is_active, created_at, updated_at",
      { count: "exact" },
    )
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .range(from, to);

  if (normalizedSearch) {
    query = query.or(
      `name.ilike.%${normalizedSearch}%,code.ilike.%${normalizedSearch}%`,
    );
  }

  const { data, count, error } = await query.returns<InventoryLocationRow[]>();

  if (error) {
    return {
      locations: [],
      totalCount: 0,
      page: safePage,
      pageSize: INVENTORY_PAGE_SIZE,
      error: error.message,
    };
  }

  return {
    locations: data ?? [],
    totalCount: count ?? 0,
    page: safePage,
    pageSize: INVENTORY_PAGE_SIZE,
    error: null,
  };
}

export async function getInventoryLocationOptions(): Promise<{
  locations: InventoryLocationOption[];
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory_locations")
    .select("id, name, code")
    .is("deleted_at", null)
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(500)
    .returns<InventoryLocationOption[]>();

  if (error) {
    return { locations: [], error: error.message };
  }

  return { locations: data ?? [], error: null };
}

export async function getInventoryVariantOptions(): Promise<{
  variants: InventoryVariantOption[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, sku, product_id")
    .order("sku", { ascending: true })
    .limit(1000)
    .returns<Array<{ id: string; sku: string; product_id: string }>>();

  if (variantsError) {
    return { variants: [], error: variantsError.message };
  }

  const productIds = Array.from(
    new Set((variants ?? []).map((variant) => variant.product_id)),
  );

  const { data: products, error: productsError } = productIds.length
    ? await supabase
        .from("products")
        .select("id, name")
        .in("id", productIds)
        .is("deleted_at", null)
        .returns<Array<{ id: string; name: string }>>()
    : { data: [], error: null };

  if (productsError) {
    return { variants: [], error: productsError.message };
  }

  const productNameById = new Map(
    (products ?? []).map((product) => [product.id, product.name]),
  );

  return {
    variants: (variants ?? []).map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      productName: productNameById.get(variant.product_id) ?? "Unknown product",
    })),
    error: null,
  };
}

async function enrichInventoryRows(rows: InventoryRecord[]) {
  if (rows.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const locationIds = Array.from(new Set(rows.map((row) => row.location_id)));
  const variantIds = Array.from(new Set(rows.map((row) => row.variant_id)));

  const [locationsResult, variantsResult] = await Promise.all([
    supabase
      .from("inventory_locations")
      .select("id, name, code")
      .in("id", locationIds)
      .returns<InventoryLocationOption[]>(),
    supabase
      .from("product_variants")
      .select("id, sku, product_id")
      .in("id", variantIds)
      .returns<Array<{ id: string; sku: string; product_id: string }>>(),
  ]);

  if (locationsResult.error || variantsResult.error) {
    return null;
  }

  const productIds = Array.from(
    new Set((variantsResult.data ?? []).map((variant) => variant.product_id)),
  );

  const { data: products, error: productsError } = productIds.length
    ? await supabase
        .from("products")
        .select("id, name")
        .in("id", productIds)
        .returns<Array<{ id: string; name: string }>>()
    : { data: [], error: null };

  if (productsError) {
    return null;
  }

  const locationById = new Map(
    (locationsResult.data ?? []).map((location) => [location.id, location]),
  );
  const variantById = new Map(
    (variantsResult.data ?? []).map((variant) => [variant.id, variant]),
  );
  const productNameById = new Map(
    (products ?? []).map((product) => [product.id, product.name]),
  );

  return rows.map((row) => {
    const location = locationById.get(row.location_id);
    const variant = variantById.get(row.variant_id);
    const availableQuantity = row.quantity_on_hand - row.quantity_reserved;

    return {
      ...row,
      locationName: location?.name ?? "Unknown location",
      locationCode: location?.code ?? "—",
      sku: variant?.sku ?? "Unknown SKU",
      productName: variant
        ? (productNameById.get(variant.product_id) ?? "Unknown product")
        : "Unknown product",
      availableQuantity,
      isLowStock: row.quantity_on_hand <= row.reorder_threshold,
    } satisfies InventoryStockItem;
  });
}

export async function getInventoryStock({
  locationId,
  page,
  search,
}: {
  locationId: string;
  page: number;
  search: string;
}): Promise<InventoryStockListResult> {
  const supabase = await createClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const from = (safePage - 1) * INVENTORY_PAGE_SIZE;
  const to = from + INVENTORY_PAGE_SIZE - 1;
  const normalizedSearch = normalizeSearch(search);

  let variantIds: string[] = [];

  if (normalizedSearch) {
    const { data: variants, error: variantSearchError } = await supabase
      .from("product_variants")
      .select("id")
      .ilike("sku", `%${normalizedSearch}%`)
      .limit(200)
      .returns<Array<{ id: string }>>();

    if (variantSearchError) {
      return {
        stock: [],
        totalCount: 0,
        page: safePage,
        pageSize: INVENTORY_PAGE_SIZE,
        error: variantSearchError.message,
      };
    }

    variantIds = (variants ?? []).map((variant) => variant.id);
  }

  let query = supabase
    .from("inventory")
    .select(
      "id, location_id, variant_id, quantity_on_hand, quantity_reserved, reorder_threshold",
      { count: "exact" },
    )
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (locationId) {
    query = query.eq("location_id", locationId);
  }

  if (normalizedSearch && variantIds.length > 0) {
    query = query.in("variant_id", variantIds);
  } else if (normalizedSearch) {
    return {
      stock: [],
      totalCount: 0,
      page: safePage,
      pageSize: INVENTORY_PAGE_SIZE,
      error: null,
    };
  }

  const { data, count, error } = await query.returns<InventoryRecord[]>();

  if (error) {
    return {
      stock: [],
      totalCount: 0,
      page: safePage,
      pageSize: INVENTORY_PAGE_SIZE,
      error: error.message,
    };
  }

  const enriched = await enrichInventoryRows(data ?? []);

  if (!enriched) {
    return {
      stock: [],
      totalCount: 0,
      page: safePage,
      pageSize: INVENTORY_PAGE_SIZE,
      error: "Unable to load stock details.",
    };
  }

  return {
    stock: enriched,
    totalCount: count ?? 0,
    page: safePage,
    pageSize: INVENTORY_PAGE_SIZE,
    error: null,
  };
}

export async function getLowStockItems({
  page,
}: {
  page: number;
}): Promise<LowStockListResult> {
  const supabase = await createClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const { data: allRows, error } = await supabase
    .from("inventory")
    .select(
      "id, location_id, variant_id, quantity_on_hand, quantity_reserved, reorder_threshold",
    )
    .order("quantity_on_hand", { ascending: true })
    .returns<InventoryRecord[]>();

  if (error) {
    return {
      items: [],
      totalCount: 0,
      page: safePage,
      pageSize: LOW_STOCK_PAGE_SIZE,
      error: error.message,
    };
  }

  const lowStockRows = (allRows ?? []).filter(
    (row) => row.quantity_on_hand <= row.reorder_threshold,
  );
  const totalCount = lowStockRows.length;
  const from = (safePage - 1) * LOW_STOCK_PAGE_SIZE;
  const pageRows = lowStockRows.slice(from, from + LOW_STOCK_PAGE_SIZE);
  const enriched = await enrichInventoryRows(pageRows);

  if (!enriched) {
    return {
      items: [],
      totalCount: 0,
      page: safePage,
      pageSize: LOW_STOCK_PAGE_SIZE,
      error: "Unable to load low stock details.",
    };
  }

  return {
    items: enriched,
    totalCount,
    page: safePage,
    pageSize: LOW_STOCK_PAGE_SIZE,
    error: null,
  };
}

export async function getInventoryMovements({
  movementType,
  page,
}: {
  movementType: string;
  page: number;
}): Promise<InventoryMovementListResult> {
  const supabase = await createClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const from = (safePage - 1) * INVENTORY_PAGE_SIZE;
  const to = from + INVENTORY_PAGE_SIZE - 1;

  let query = supabase
    .from("inventory_movements")
    .select(
      "id, movement_type, variant_id, location_id, to_location_id, quantity, quantity_before, quantity_after, notes, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (movementType && validateMovementType(movementType)) {
    query = query.eq("movement_type", movementType);
  }

  const { data, count, error } = await query.returns<InventoryMovementRecord[]>();

  if (error) {
    return {
      movements: [],
      totalCount: 0,
      page: safePage,
      pageSize: INVENTORY_PAGE_SIZE,
      error: error.message,
    };
  }

  const movements = data ?? [];

  if (movements.length === 0) {
    return {
      movements: [],
      totalCount: count ?? 0,
      page: safePage,
      pageSize: INVENTORY_PAGE_SIZE,
      error: null,
    };
  }

  const locationIds = Array.from(
    new Set(
      movements.flatMap((movement) =>
        [movement.location_id, movement.to_location_id].filter(Boolean),
      ),
    ),
  ) as string[];
  const variantIds = Array.from(new Set(movements.map((m) => m.variant_id)));

  const [locationsResult, variantsResult] = await Promise.all([
    supabase
      .from("inventory_locations")
      .select("id, name")
      .in("id", locationIds)
      .returns<Array<{ id: string; name: string }>>(),
    supabase
      .from("product_variants")
      .select("id, sku, product_id")
      .in("id", variantIds)
      .returns<Array<{ id: string; sku: string; product_id: string }>>(),
  ]);

  if (locationsResult.error || variantsResult.error) {
    return {
      movements: [],
      totalCount: 0,
      page: safePage,
      pageSize: INVENTORY_PAGE_SIZE,
      error:
        locationsResult.error?.message ??
        variantsResult.error?.message ??
        "Unable to load movement details.",
    };
  }

  const productIds = Array.from(
    new Set((variantsResult.data ?? []).map((variant) => variant.product_id)),
  );

  const { data: products, error: productsError } = productIds.length
    ? await supabase
        .from("products")
        .select("id, name")
        .in("id", productIds)
        .returns<Array<{ id: string; name: string }>>()
    : { data: [], error: null };

  if (productsError) {
    return {
      movements: [],
      totalCount: 0,
      page: safePage,
      pageSize: INVENTORY_PAGE_SIZE,
      error: productsError.message,
    };
  }

  const locationNameById = new Map(
    (locationsResult.data ?? []).map((location) => [location.id, location.name]),
  );
  const variantById = new Map(
    (variantsResult.data ?? []).map((variant) => [variant.id, variant]),
  );
  const productNameById = new Map(
    (products ?? []).map((product) => [product.id, product.name]),
  );

  return {
    movements: movements.map((movement) => {
      const variant = variantById.get(movement.variant_id);

      return {
        ...movement,
        sku: variant?.sku ?? "Unknown SKU",
        productName: variant
          ? (productNameById.get(variant.product_id) ?? "Unknown product")
          : "Unknown product",
        locationName:
          locationNameById.get(movement.location_id) ?? "Unknown location",
        toLocationName: movement.to_location_id
          ? (locationNameById.get(movement.to_location_id) ?? "Unknown location")
          : null,
      };
    }),
    totalCount: count ?? 0,
    page: safePage,
    pageSize: INVENTORY_PAGE_SIZE,
    error: null,
  };
}
