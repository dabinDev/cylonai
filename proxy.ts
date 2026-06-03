import { NextRequest, NextResponse } from "next/server";
import { verifyToken, verifyUserToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const needsUserAuth = pathname.startsWith("/api/aigc");
  if (needsUserAuth) {
    const token = request.cookies.get("user_token")?.value;
    if (!token || !(await verifyUserToken(token))) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "请先登录后再使用 AIGC 功能" }, { status: 401 });
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/aigc/:path*"],
};
