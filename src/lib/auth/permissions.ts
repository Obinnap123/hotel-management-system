export type AppRole = "ADMIN" | "RECEPTIONIST";

export const protectedPaths = [
  "/dashboard",
] as const;

export const adminOnlyPaths = [
  "/dashboard/room-types",
  "/dashboard/users",
  "/dashboard/settings",
] as const;

export function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => matchesPath(pathname, path));
}

export function isAdminOnlyPath(pathname: string) {
  return adminOnlyPaths.some((path) => matchesPath(pathname, path));
}

export function canAccessPath(role: AppRole, pathname: string) {
  if (role === "ADMIN") {
    return true;
  }

  return !isAdminOnlyPath(pathname);
}

export function assertAdminRole(role: AppRole | string) {
  if (role !== "ADMIN") {
    throw new Error("You do not have permission to perform this action.");
  }
}

function matchesPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}
