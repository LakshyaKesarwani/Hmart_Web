"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: string;
  pendingText?: string;
};

export function SubmitButton({ children, pendingText }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex h-11 w-full items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      disabled={pending}
      type="submit"
    >
      {pending ? (pendingText ?? "Working...") : children}
    </button>
  );
}
