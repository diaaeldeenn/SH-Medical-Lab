import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.BETTER_AUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  const authPages = ["/auth/login", "/auth/register"];

  const protectedPages = [
    "/profile",
    "/requests",
    "/requests/new",
    "/specialist/requests",
    "/tests",
  ];

  const isAuthPage = authPages.includes(pathname);
  const isProtectedPage =
    protectedPages.includes(pathname) ||
    pathname.startsWith("/requests/") ||
    pathname.startsWith("/specialist/requests/");

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/login",
    "/auth/register",
    "/profile",
    "/requests",
    "/requests/new",
    "/requests/:id",
    "/specialist/requests",
    "/specialist/requests/:id",
    "/tests",
  ],
};
