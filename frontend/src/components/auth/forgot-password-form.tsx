"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/src/lib/auth/actions";
import { initialAuthActionState } from "@/src/lib/auth/types";
import { AuthMessage } from "./auth-message";
import { SubmitButton } from "./submit-button";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    forgotPasswordAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <AuthMessage state={state} />

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Email</span>
        <input
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="email"
          required
          type="email"
        />
      </label>

      <SubmitButton pendingText="Sending link...">Send reset link</SubmitButton>
    </form>
  );
}
