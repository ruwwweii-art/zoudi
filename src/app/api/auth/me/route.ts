/**
 * GET /api/auth/me
 * 获取当前登录用户信息
 * Demo 模式：从 JWT 读取，返回对应 mock 用户
 * 真实模式 TODO：查 DB 获取完整用户信息
 */
import { ok, unauthorized } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import { isDemoMode, MOCK_USER, MOCK_ADMIN_USER } from "@/lib/demo-data";

export async function GET(request: Request) {
  const authUser = await getAuthUser(request);
  if (!authUser) return unauthorized();

  if (isDemoMode()) {
    const user = authUser.isAdmin
      ? MOCK_ADMIN_USER
      : { ...MOCK_USER, email: authUser.email };
    return ok(user);
  }

  // TODO: 真实模式
  // const user = await prisma.user.findUnique({
  //   where: { id: authUser.userId },
  //   include: { preferences: true },
  // });
  // if (!user) return unauthorized();
  // return ok(user);

  return unauthorized();
}
