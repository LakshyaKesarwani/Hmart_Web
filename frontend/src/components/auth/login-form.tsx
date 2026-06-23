"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/src/lib/auth/actions";
import { initialAuthActionState } from "@/src/lib/auth/types";
import { AuthMessage } from "./auth-message";
import { SubmitButton } from "./submit-button";

type LoginFormProps = {
  nextPath: string;
  notice?: string;
};

export function LoginForm({ nextPath, notice }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      {notice ? <AuthMessage message={notice} tone="success" /> : null}
      <AuthMessage state={state} />
      <input name="next" type="hidden" value={nextPath} />

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
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-950"
          name="password"
          required
          type="password"
        />
      </label>

      <div className="flex justify-end">
        <Link
          className="text-sm font-medium text-zinc-950 underline"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>

      <SubmitButton pendingText="Signing in...">Sign in</SubmitButton>
    </form>
  );
}
