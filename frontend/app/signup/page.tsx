import { AuthCard } from "@/src/components/auth/auth-card";
import { SignupForm } from "@/src/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthCard
      footer={{
        text: "Already have an account?",
        label: "Sign in",
        href: "/login",
      }}
      subtitle="Create a buyer account. Admin and delivery partner access can be assigned by HMART administrators."
      title="Create your account"
    >
      <SignupForm />
    </AuthCard>
  );
}
