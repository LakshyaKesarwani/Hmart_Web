"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import type { AuthActionState } from "./types";
import { getSafeRedirectPath } from "./redirects";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string) {
  return password.length >= 8;
}

async function getOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return "http://localhost:3000";
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = getStringValue(formData, "fullName");
  const email = getStringValue(formData, "email").toLowerCase();
  const password = getStringValue(formData, "password");
  const confirmPassword = getStringValue(formData, "confirmPassword");

  if (!fullName) {
    return { status: "error", message: "Enter your full name." };
  }

  if (!validateEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  if (!validatePassword(password)) {
    return {
      status: "error",
      message: "Password must be at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        "/login?verified=1",
      )}`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message:
      "Account created. Check your email to verify your HMART account before signing in.",
  };
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getStringValue(formData, "email").toLowerCase();
  const password = getStringValue(formData, "password");
  const next = getSafeRedirectPath(formData.get("next"));

  if (!validateEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  if (!password) {
    return { status: "error", message: "Enter your password." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect(next);
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getStringValue(formData, "email").toLowerCase();

  if (!validateEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
      "/reset-password",
    )}`,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message:
      "If an HMART account exists for that email, a reset link has been sent.",
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = getStringValue(formData, "password");
  const confirmPassword = getStringValue(formData, "confirmPassword");

  if (!validatePassword(password)) {
    return {
      status: "error",
      message: "Password must be at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return {
      status: "error",
      message: "Your reset link is invalid or has expired. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  await supabase.auth.signOut();
  redirect("/login?reset=1");
}

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect("/login?loggedOut=1");
}
