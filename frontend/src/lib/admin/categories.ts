import { createClient } from "@/src/lib/supabase/server";

export const CATEGORIES_PAGE_SIZE = 10;

export type CategoryRow = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryOption = {
  id: string;
  parent_id: string | null;
  name: string;
};

export type CategoryListResult = {
  categories: CategoryRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  error: string | null;
};

function normalizeSearch(value: string) {
  return value.trim().replace(/[,%()]/g, " ").replace(/\s+/g, " ");
}

export async function getCategories({
  page,
  search,
}: {
  page: number;
  search: string;
}): Promise<CategoryListResult> {
  const supabase = await createClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const from = (safePage - 1) * CATEGORIES_PAGE_SIZE;
  const to = from + CATEGORIES_PAGE_SIZE - 1;
  const normalizedSearch = normalizeSearch(search);

  let query = supabase
    .from("categories")
    .select(
      "id, parent_id, name, slug, description, image_url, sort_order, is_active, created_at, updated_at",
      { count: "exact" },
    )
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to);

  if (normalizedSearch) {
    query = query.or(
      `name.ilike.%${normalizedSearch}%,slug.ilike.%${normalizedSearch}%`,
    );
  }

  const { data, count, error } = await query.returns<CategoryRow[]>();

  if (error) {
    return {
      categories: [],
      totalCount: 0,
      page: safePage,
      pageSize: CATEGORIES_PAGE_SIZE,
      error: error.message,
    };
  }

  return {
    categories: data ?? [],
    totalCount: count ?? 0,
    page: safePage,
    pageSize: CATEGORIES_PAGE_SIZE,
    error: null,
  };
}

export async function getCategoryOptions(): Promise<{
  categories: CategoryOption[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, parent_id, name")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .limit(500)
    .returns<CategoryOption[]>();

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
