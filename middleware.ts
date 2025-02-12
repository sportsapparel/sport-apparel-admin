import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Incoming request to: ${pathname}`);

  // Get token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log(`[Middleware] Token retrieved: ${token ? "Yes" : "No"}`);

  // If user is authenticated, prevent access to "/"
  if (token && pathname === "/") {
    console.log(
      "[Middleware] Authenticated user, redirecting from '/' to '/dashboard'"
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is NOT authenticated, allow only "/"
  if (!token && pathname !== "/") {
    console.log("[Middleware] Unauthenticated user, redirecting to '/'");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("[Middleware] Allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
