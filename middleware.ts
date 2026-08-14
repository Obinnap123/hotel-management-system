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
  const isHotelDeployment =
    process.env.NEXT_PUBLIC_DEPLOYMENT_MODE === "hotel";

  if (isHotelDeployment) {
    const reservationPath = getReservationRewritePath(pathname);

    if (reservationPath) {
      const reservationUrl = request.nextUrl.clone();
      reservationUrl.pathname = reservationPath;

      return NextResponse.rewrite(reservationUrl);
    }

    if (isMarketingPath(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const secret = process.env.AUTH_SECRET;
  const token = request.cookies.get(sessionCookieName)?.value;
  const session = token && secret ? await verifySessionToken(token, secret) : null;

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
    "/",
    "/about",
    "/book",
    "/booking-success",
    "/contact",
    "/faq",
    "/features",
    "/login",
    "/pricing",
    "/request-demo/:path*",
    "/rooms/:path*",
    "/solutions",
    "/dashboard/:path*",
  ],
};

function getReservationRewritePath(pathname: string) {
  if (pathname === "/") {
    return "/demo";
  }

  if (
    pathname === "/book" ||
    pathname === "/booking-success" ||
    pathname === "/rooms" ||
    pathname.startsWith("/rooms/")
  ) {
    return `/demo${pathname}`;
  }

  return null;
}

function isMarketingPath(pathname: string) {
  return (
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/faq" ||
    pathname === "/features" ||
    pathname === "/pricing" ||
    pathname === "/request-demo" ||
    pathname.startsWith("/request-demo/") ||
    pathname === "/solutions"
  );
}
