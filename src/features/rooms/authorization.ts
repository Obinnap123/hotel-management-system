import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/session";

export async function requireAuthenticatedStaff() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuthenticatedStaff();

  if (session.role !== "ADMIN") {
    throw new Error("You do not have permission to perform this action.");
  }

  return session;
}

export function isAdminRole(role: string) {
  return role === "ADMIN";
}
