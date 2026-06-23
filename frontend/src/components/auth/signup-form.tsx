"use client";

import { useActionState } from "react";
import { signUpAction } from "@/src/lib/auth/actions";
import { initialAuthActionState } from "@/src/lib/auth/types";
import { AuthMessage } from "./auth-message";
import { SubmitButton } from "./submit-button";

export function SignupForm() {
  const [state, formAction] = useActionState(signUpAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <AuthMessage state={state} />

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Full name</span>
        <input
          autoComplete="name"
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="fullName"
          required
          type="text"
        />
      </label>

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

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Password</span>
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
          Confirm password
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

      <SubmitButton pendingText="Creating account...">Create account</SubmitButton>
    </form>
  );
}
