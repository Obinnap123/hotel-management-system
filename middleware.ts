import { NextResponse, type NextRequest } from "next/server";
import {
  canAccessPath,
  isProtectedPath,
} from "@/lib/auth/permissions";
import {
  sessionCookieName,
  verifySessionToken,
} from "@/lib/auth/session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.AUTH_SECRET;
  const token = request.cookies.get(sessionCookieName)?.value;
  const session = token && secret ? await verifySessionToken(token, secret) : null;

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessPath(session.role, pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
  ],
};
