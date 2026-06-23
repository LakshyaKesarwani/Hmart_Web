import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { AUTH_ROLES, type AuthRole } from "./types";
import { requireUser } from "./session";

type UserRoleRow = {
  roles: { code: string } | { code: string }[] | null;
};

export function isAuthRole(value: string): value is AuthRole {
  return Object.values(AUTH_ROLES).includes(value as AuthRole);
}

function normalizeRoleRows(rows: UserRoleRow[] | null): AuthRole[] {
  return (rows ?? []).flatMap((row) => {
    const roles = Array.isArray(row.roles) ? row.roles : [row.roles];

    return roles
      .map((role) => role?.code)
      .filter((role): role is AuthRole =>
        typeof role === "string" && isAuthRole(role),
      );
  });
}

export async function getUserRoles(userId?: string): Promise<AuthRole[]> {
  const supabase = await createClient();
  const resolvedUserId = userId ?? (await requireUser()).id;

  const { data, error } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", resolvedUserId)
    .returns<UserRoleRow[]>();

  if (error) {
    throw new Error(`Unable to load user roles: ${error.message}`);
  }

  return normalizeRoleRows(data);
}

export async function hasRole(allowedRoles: AuthRole | AuthRole[]) {
  const roles = await getUserRoles();
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return roles.some((role) => allowed.includes(role));
}

export async function requireRole(
  allowedRoles: AuthRole | AuthRole[],
  pathname = "/",
) {
  await requireUser(pathname);

  const authorized = await hasRole(allowedRoles);

  if (!authorized) {
    redirect("/unauthorized");
  }
}
