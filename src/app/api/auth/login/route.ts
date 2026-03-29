/**
 * POST /api/auth/login
 * 邮箱登录
 * Demo 模式：任意邮箱+密码均可登录，返回 mock token
 * 真实模式 TODO：查 DB 验证密码
 */
import { ok, err } from "@/lib/response";
import { signToken, setAuthCookie } from "@/lib/auth";
import { isDemoMode, MOCK_USER, MOCK_ADMIN_USER } from "@/lib/demo-data";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return err("请求体格式错误");

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message);
  }

  const { email } = parsed.data;

  if (isDemoMode()) {
    // ── DEMO 模式：admin@zoudi.app 登录为管理员，其余为普通用户 ──
    const isAdmin = email === "admin@zoudi.app";
    const user = isAdmin
      ? MOCK_ADMIN_USER
      : { ...MOCK_USER, email };
    const token = await signToken({ userId: user.id, email, isAdmin });
    await setAuthCookie(token);
    return ok({ user, token }, { message: "登录成功（演示模式）" });
  }

  // TODO: 真实模式
  // const user = await prisma.user.findUnique({ where: { email } });
  // if (!user || !user.password) return err("邮箱或密码错误", 401);
  // const valid = await comparePassword(parsed.data.password, user.password);
  // if (!valid) return err("邮箱或密码错误", 401);
  // const token = await signToken({ userId: user.id, email, isAdmin: user.is_admin });
  // await setAuthCookie(token);
  // return ok({ user, token });

  return err("当前为演示模式", 501);
}
