import type { ProductImageActionState } from "@/src/lib/admin/product-image-actions";

export function ProductImageActionMessage({
  state,
}: {
  state: ProductImageActionState;
}) {
  if (!state.message || state.status === "idle") {
    return null;
  }

  const className =
    state.status === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-red-200 bg-red-50 text-red-900";

  return (
    <div className={`rounded-md border px-3 py-2 text-sm ${className}`}>
      {state.message}
    </div>
  );
}
