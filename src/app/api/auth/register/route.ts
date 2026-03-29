/**
 * POST /api/auth/register
 * 邮箱注册
 * Demo 模式：直接返回 mock 用户 token，不写 DB
 * 真实模式 TODO：写入 users 表，hash 密码
 */
import { ok, err } from "@/lib/response";
import { signToken, setAuthCookie } from "@/lib/auth";
import { isDemoMode, MOCK_USER } from "@/lib/demo-data";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少8位"),
  nickname: z.string().min(1).max(20).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return err("请求体格式错误");

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message);
  }

  const { email, nickname } = parsed.data;

  if (isDemoMode()) {
    // ── DEMO 模式：直接签发 token ──
    const user = { ...MOCK_USER, email, nickname: nickname || "新用户" };
    const token = await signToken({ userId: user.id, email, isAdmin: false });
    await setAuthCookie(token);
    return ok({ user, token }, { status: 201, message: "注册成功（演示模式）" });
  }

  // TODO: 真实模式
  // const existing = await prisma.user.findUnique({ where: { email } });
  // if (existing) return err("该邮箱已注册", 409);
  // const hashed = await hashPassword(parsed.data.password);
  // const user = await prisma.user.create({ data: { email, password: hashed, nickname } });
  // const token = await signToken({ userId: user.id, email, isAdmin: false });
  // await setAuthCookie(token);
  // return ok({ user, token }, { status: 201 });

  return err("当前为演示模式", 501);
}
