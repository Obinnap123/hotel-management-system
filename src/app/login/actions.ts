"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { createSessionCookie, clearSessionCookie } from "@/server/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { getFailedLoginState, isLoginLocked } from "./security";

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

  const now = new Date();

  if (isLoginLocked(user.lockedUntil, now)) {
    redirect("/login?error=locked");
  }

  const passwordIsValid = await verifyPassword(password, user.passwordHash);

  if (!passwordIsValid) {
    const failedLoginState = getFailedLoginState({
      currentAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil,
      now,
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: failedLoginState,
    });

    redirect(
      failedLoginState.lockedUntil
        ? "/login?error=locked"
        : "/login?error=invalid",
    );
  }

  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  await createSessionCookie({
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    sessionVersion: user.sessionVersion,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
