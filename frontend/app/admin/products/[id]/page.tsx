import { notFound } from "next/navigation";
import { ProductDetailSummary } from "@/src/components/admin/products/product-detail-summary";
import { getProductById } from "@/src/lib/admin/products";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const { product, error } = await getProductById(id);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
        <h1 className="text-base font-semibold">Unable to load product</h1>
        <p className="mt-2 text-sm leading-6">{error}</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailSummary product={product} />;
}
