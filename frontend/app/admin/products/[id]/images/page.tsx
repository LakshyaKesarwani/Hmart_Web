import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { ProductImageGallery } from "@/src/components/admin/products/product-image-gallery";
import { ProductImageUploadForm } from "@/src/components/admin/products/product-image-upload-form";
import { getProductImagePageContext } from "@/src/lib/admin/product-images";

export const dynamic = "force-dynamic";

type ProductImagesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductImagesPage({ params }: ProductImagesPageProps) {
  const { id } = await params;
  const context = await getProductImagePageContext(id);

  if (context.error) {
    return (
      <>
        <AdminPageHeader
          description="Upload, preview, reorder, and manage product images."
          title="Product Images"
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
          <h2 className="text-base font-semibold">Unable to load product images</h2>
          <p className="mt-2 text-sm leading-6">{context.error}</p>
        </div>
      </>
    );
  }

  if (!context.productName) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        description="Upload, preview, reorder, and manage product images."
        title="Product Images"
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            {context.productName}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {context.images.length}{" "}
            {context.images.length === 1 ? "image" : "images"} attached
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            href={`/admin/products/${id}`}
          >
            Back to product
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            href="/admin/products"
          >
            All products
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold text-zinc-950">Upload Image</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Add another image to this product catalog entry.
          </p>
          <div className="mt-5">
            <ProductImageUploadForm productId={id} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-950">Image Gallery</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Preview images, set the primary image, reorder, or delete records.
            </p>
          </div>
          <ProductImageGallery images={context.images} productId={id} />
        </section>
      </div>
    </>
  );
}
