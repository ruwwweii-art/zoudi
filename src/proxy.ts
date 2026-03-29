/**
 * Next.js 中间件
 * - /api/admin/* 路由要求登录（具体权限在路由内部判断）
 * - 其他路由公开访问
 * Edge Runtime 兼容（使用 jose 而非 jsonwebtoken）
 */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-jwt-secret-change-in-production-32chars"
);

const PROTECTED_PREFIXES = ["/api/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) return NextResponse.next();

  // 尝试从 Cookie 或 Authorization Header 读取 token
  const cookieToken = request.cookies.get("zoudi_token")?.value;
  const headerToken = request.headers.get("authorization")?.replace("Bearer ", "");
  const token = cookieToken || headerToken;

  if (!token) {
    return NextResponse.json({ success: false, error: "未登录或登录已过期" }, { status: 401 });
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ success: false, error: "Token 无效或已过期" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
