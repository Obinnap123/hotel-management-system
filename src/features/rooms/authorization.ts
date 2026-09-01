import { redirect } from "next/navigation";
import { assertAdminRole } from "@/lib/auth/permissions";
import { getCurrentActiveSession } from "@/server/auth/session";

export async function requireAuthenticatedStaff() {
  const session = await getCurrentActiveSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuthenticatedStaff();
  assertAdminRole(session.role);

  return session;
}

export function isAdminRole(role: string) {
  return role === "ADMIN";
}
