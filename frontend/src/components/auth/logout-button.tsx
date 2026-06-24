import { logoutAction } from "@/src/lib/auth/actions";

type LogoutButtonProps = {
  className?: string;
  label?: string;
};

export function LogoutButton({
  className = "rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50",
  label = "Log out",
}: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button
        className={className}
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}
