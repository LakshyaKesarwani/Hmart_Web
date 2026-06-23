const DEFAULT_AUTHENTICATED_PATH = "/";
const DEFAULT_UNAUTHENTICATED_PATH = "/login";

export function getSafeRedirectPath(
  value: FormDataEntryValue | string | string[] | undefined | null,
  fallback = DEFAULT_AUTHENTICATED_PATH,
) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (typeof rawValue !== "string") {
    return fallback;
  }

  if (!rawValue.startsWith("/") || rawValue.startsWith("//")) {
    return fallback;
  }

  return rawValue;
}

export function getLoginRedirectPath(pathname: string) {
  const next = encodeURIComponent(pathname);

  return `${DEFAULT_UNAUTHENTICATED_PATH}?next=${next}`;
}
