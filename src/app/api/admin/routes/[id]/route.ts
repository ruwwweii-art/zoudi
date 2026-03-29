/**
 * GET    /api/admin/routes/[id]  → 路线详情（含草稿）
 * PUT    /api/admin/routes/[id]  → 更新路线
 * DELETE /api/admin/routes/[id]  → 删除路线
 * 需要管理员权限
 */
import { ok, err, notFound, forbidden, unauthorized } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import { isDemoMode, MOCK_ROUTES } from "@/lib/demo-data";

async function requireAdmin(request: Request) {
  const user = await getAuthUser(request);
  if (!user) return { user: null, error: unauthorized() };
  if (!user.isAdmin) return { user: null, error: forbidden() };
  return { user, error: null };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;
  const { id } = await params;

  if (isDemoMode()) {
    const route = MOCK_ROUTES.find((r) => r.id === id);
    if (!route) return notFound("路线");
    return ok(route);
  }

  // TODO: 真实模式
  return notFound("路线");
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;
  const { id } = await params;

  const body = await request.json().catch(() => null);
  if (!body) return err("请求体格式错误");

  if (isDemoMode()) {
    return ok({ id, ...body, updated_at: new Date().toISOString() }, { message: "已更新（演示模式，不持久化）" });
  }

  // TODO: 真实模式
  // const route = await prisma.route.update({ where: { id }, data: body });
  // return ok(route);

  return err("当前为演示模式", 501);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;
  const { id } = await params;

  if (isDemoMode()) {
    return ok({ id }, { message: "已删除（演示模式，不持久化）" });
  }

  // TODO: 真实模式
  // await prisma.route.delete({ where: { id } });
  // return ok({ id });

  return err("当前为演示模式", 501);
}
