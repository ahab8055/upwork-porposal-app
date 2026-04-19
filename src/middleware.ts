import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_TOKEN_KEY = "auth-token";

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/verify-email", "/accept-invite"];

// Auth routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/knowledge-base",
  "/proposals",
  "/new-proposal",
  "/team",
  "/settings",
  "/onboarding",
  "/analytics",
  "/subscription",
];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.includes(pathname);
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // If user is authenticated and tries to access auth routes, redirect to dashboard
  if (token && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!token && isProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
