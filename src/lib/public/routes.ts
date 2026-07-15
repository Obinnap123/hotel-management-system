const defaultReservationBasePath = "/demo";

export const publicReservationBasePath = normalizeBasePath(
  process.env.NEXT_PUBLIC_RESERVATION_BASE_PATH ?? defaultReservationBasePath,
);

export function publicReservationPath(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullPath = `${publicReservationBasePath}${normalizedPath}`;

  return fullPath || "/";
}

function normalizeBasePath(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue === "/") {
    return "";
  }

  const withoutTrailingSlash = trimmedValue.replace(/\/$/, "");

  if (
    withoutTrailingSlash.startsWith("/") ||
    withoutTrailingSlash.startsWith("http://") ||
    withoutTrailingSlash.startsWith("https://")
  ) {
    return withoutTrailingSlash;
  }

  return `/${withoutTrailingSlash}`;
}
