import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getLoginRedirectPath } from "./redirects";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function getCurrentSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return data.session;
}

export async function requireUser(pathname = "/") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(getLoginRedirectPath(pathname));
  }

  return user;
}
