import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin and /api/admin
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;
  // If no password set, allow (dev convenience)
  if (!password) return NextResponse.next();

  // Check cookie
  const cookie = req.cookies.get("admin_auth")?.value;
  if (cookie === password) return NextResponse.next();

  // Check basic auth header (for API calls)
  const auth = req.headers.get("authorization");
  if (auth) {
    const [, encoded] = auth.split(" ");
    const decoded = Buffer.from(encoded ?? "", "base64").toString();
    const [, pass] = decoded.split(":");
    if (pass === password) return NextResponse.next();
  }

  // Redirect to login for page routes, 401 for API
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
