import type { AuthActionState } from "@/src/lib/auth/types";

type AuthMessageProps = {
  state?: AuthActionState;
  message?: string;
  tone?: "success" | "error" | "info";
};

export function AuthMessage({ state, message, tone }: AuthMessageProps) {
  const resolvedMessage = message ?? state?.message;
  const resolvedTone = tone ?? state?.status;

  if (!resolvedMessage || resolvedTone === "idle") {
    return null;
  }

  const classes =
    resolvedTone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : resolvedTone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-zinc-200 bg-zinc-50 text-zinc-700";

  return (
    <div className={`rounded-md border px-4 py-3 text-sm leading-6 ${classes}`}>
      {resolvedMessage}
    </div>
  );
}
