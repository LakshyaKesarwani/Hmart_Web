"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction } from "@/src/lib/auth/actions";
import { initialAuthActionState } from "@/src/lib/auth/types";
import { AuthMessage } from "./auth-message";
import { SubmitButton } from "./submit-button";

type ResetPasswordFormProps = {
  canReset: boolean;
};

export function ResetPasswordForm({ canReset }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(
    resetPasswordAction,
    initialAuthActionState,
  );

  if (!canReset) {
    return (
      <div className="space-y-5">
        <AuthMessage
          message="Your reset link is invalid or has expired. Request a new reset link."
          tone="error"
        />
        <Link
          className="flex h-11 w-full items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          href="/forgot-password"
        >
          Request reset link
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <AuthMessage state={state} />

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">New password</span>
        <input
          autoComplete="new-password"
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          minLength={8}
          name="password"
          required
          type="password"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">
          Confirm new password
        </span>
        <input
          autoComplete="new-password"
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          minLength={8}
          name="confirmPassword"
          required
          type="password"
        />
      </label>

      <SubmitButton pendingText="Updating password...">
        Update password
      </SubmitButton>
    </form>
  );
}
