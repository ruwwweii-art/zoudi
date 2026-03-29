/**
 * POST /api/auth/logout
 * 退出登录（清除 Cookie）
 */
import { ok } from "@/lib/response";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return ok(null, { message: "已退出登录" });
}
