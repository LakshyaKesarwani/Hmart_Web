import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

export const PRODUCT_IMAGES_BUCKET = "product-images";

export function getProductImagePublicUrl(storagePath: string) {
  const { supabaseUrl } = getSupabaseEnv();
  const encodedPath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${encodedPath}`;
}

export function getProductImagePublicUrlFromClient(
  supabase: SupabaseClient,
  storagePath: string,
) {
  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}
