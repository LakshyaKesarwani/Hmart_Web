import { redirect } from "next/navigation";
import { AuthCard } from "@/src/components/auth/auth-card";
import { LoginForm } from "@/src/components/auth/login-form";
import { getSafeRedirectPath } from "@/src/lib/auth/redirects";
import { getCurrentUser } from "@/src/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getNotice(searchParams: Record<string, string | string[] | undefined>) {
  if (searchParams.verified === "1") {
    return "Email verified. You can now sign in.";
  }

  if (searchParams.reset === "1") {
    return "Password updated. Sign in with your new password.";
  }

  if (searchParams.loggedOut === "1") {
    return "You have been logged out.";
  }

  return undefined;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const nextPath = getSafeRedirectPath(params.next);

  if (user) {
    redirect(nextPath);
  }

  return (
    <AuthCard
      footer={{
        text: "New to HMART?",
        label: "Create an account",
        href: "/signup",
      }}
      subtitle="Sign in to continue purchasing, tracking orders, and managing your HMART account."
      title="Sign in"
    >
      <LoginForm nextPath={nextPath} notice={getNotice(params)} />
    </AuthCard>
  );
}
