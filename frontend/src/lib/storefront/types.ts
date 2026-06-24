export const STOREFRONT_PRODUCTS_PAGE_SIZE = 12;
export const STOREFRONT_FEATURED_PRODUCTS_LIMIT = 8;
export const STOREFRONT_FEATURED_CATEGORIES_LIMIT = 6;
export const STOREFRONT_RELATED_PRODUCTS_LIMIT = 4;

export type StorefrontCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export type StorefrontProductCard = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  categoryId: string | null;
  categoryName: string;
  categorySlug: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  imageUrl: string | null;
  imageAlt: string | null;
  inStock: boolean;
};

export type StorefrontProductImage = {
  id: string;
  publicUrl: string;
  altText: string | null;
  isPrimary: boolean;
};

export type StorefrontProductVariant = {
  id: string;
  sku: string;
  price: number;
  unit: string | null;
  isActive: boolean;
  availableStock: number;
  inStock: boolean;
};

export type StorefrontProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  categoryId: string | null;
  categoryName: string;
  categorySlug: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  images: StorefrontProductImage[];
  variants: StorefrontProductVariant[];
  inStock: boolean;
};

export type StorefrontCatalogResult = {
  products: StorefrontProductCard[];
  totalCount: number;
  page: number;
  pageSize: number;
  error: string | null;
};
