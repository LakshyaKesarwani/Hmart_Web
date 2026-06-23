import { AuthCard } from "@/src/components/auth/auth-card";
import { ResetPasswordForm } from "@/src/components/auth/reset-password-form";
import { getCurrentUser } from "@/src/lib/auth/session";

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  return (
    <AuthCard
      subtitle="Choose a new password for your HMART account."
      title="Set a new password"
    >
      <ResetPasswordForm canReset={Boolean(user)} />
    </AuthCard>
  );
}
