import { redirect } from "next/navigation";
import { AuthCard } from "@/src/components/auth/auth-card";
import { ForgotPasswordForm } from "@/src/components/auth/forgot-password-form";
import { getCurrentUser } from "@/src/lib/auth/session";

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthCard
      footer={{
        text: "Remembered your password?",
        label: "Sign in",
        href: "/login",
      }}
      subtitle="Enter your account email and HMART will send you a secure password reset link."
      title="Reset your password"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
