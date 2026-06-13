"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { createSessionCookie, clearSessionCookie } from "@/server/auth/session";
import { verifyPassword } from "@/lib/auth/password";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.status !== "ACTIVE") {
    redirect("/login?error=invalid");
  }

  const passwordIsValid = await verifyPassword(password, user.passwordHash);

  if (!passwordIsValid) {
    redirect("/login?error=invalid");
  }

  await createSessionCookie({
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
