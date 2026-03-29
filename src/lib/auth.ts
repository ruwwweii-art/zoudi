/**
 * 认证工具层
 * - JWT 生成与验证（jose 库，Edge Runtime 兼容）
 * - 密码 hash（bcryptjs）
 * - Cookie 操作（Next.js 16 async cookies）
 */
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "zoudi_token";

// ─────────────────────────────────────────────
// JWT Payload 类型
// ─────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

// ─────────────────────────────────────────────
// JWT 生成
// ─────────────────────────────────────────────
export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

// ─────────────────────────────────────────────
// JWT 验证
// ─────────────────────────────────────────────
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// 从请求 Cookie 获取当前用户（Server Component / Route Handler）
// ─────────────────────────────────────────────
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies(); // Next.js 16 async cookies
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─────────────────────────────────────────────
// 设置认证 Cookie（登录时调用）
// ─────────────────────────────────────────────
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 天
    path: "/",
  });
}

// ─────────────────────────────────────────────
// 清除认证 Cookie（登出时调用）
// ─────────────────────────────────────────────
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─────────────────────────────────────────────
// 密码工具
// ─────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─────────────────────────────────────────────
// 从 Request Header 提取 Token（API 路由鉴权用）
// ─────────────────────────────────────────────
export function extractBearerToken(request: Request): string | null {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7);
}

// ─────────────────────────────────────────────
// 通用鉴权：从 Cookie 或 Header 获取当前用户
// 用于 Route Handler 内部
// ─────────────────────────────────────────────
export async function getAuthUser(
  request: Request
): Promise<JwtPayload | null> {
  // 优先从 Header 读取（前端 API 调用）
  const bearerToken = extractBearerToken(request);
  if (bearerToken) {
    return verifyToken(bearerToken);
  }
  // 降级从 Cookie 读取（SSR 页面）
  return getCurrentUser();
}
