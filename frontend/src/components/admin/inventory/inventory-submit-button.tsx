"use client";

import { useFormStatus } from "react-dom";

export function InventorySubmitButton({
  label,
  pendingLabel,
  variant = "primary",
}: {
  label: string;
  pendingLabel: string;
  variant?: "primary" | "danger";
}) {
  const { pending } = useFormStatus();
  const className =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
      : "bg-zinc-950 text-white hover:bg-zinc-800 disabled:bg-zinc-400";

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed ${className}`}
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
