import { cookies } from "next/headers";
import {
  createSessionToken,
  sessionCookieName,
  type SessionPayload,
  verifySessionToken,
} from "@/lib/auth/session-token";

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
