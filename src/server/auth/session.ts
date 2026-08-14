import { cookies } from "next/headers";
import { UserStatus } from "@prisma/client";
import {
  createSessionToken,
  sessionCookieName,
  type SessionPayload,
  verifySessionToken,
} from "@/lib/auth/session-token";
import { prisma } from "@/server/db/prisma";

const sessionDurationMs = 1000 * 60 * 60 * 8;

export async function createSessionCookie(
  payload: Omit<SessionPayload, "expiresAt">,
) {
  const expiresAt = Date.now() + sessionDurationMs;
  const token = await createSessionToken(
    { ...payload, expiresAt },
    getAuthSecret(),
  );
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    path: "/",
  });
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token, getAuthSecret());
}

export async function getCurrentActiveSession() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      sessionVersion: true,
    },
  });

  if (
    !user ||
    user.status !== UserStatus.ACTIVE ||
    user.sessionVersion !== session.sessionVersion
  ) {
    return null;
  }

  return {
    ...session,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(sessionCookieName);
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required.");
  }

  return secret;
}
