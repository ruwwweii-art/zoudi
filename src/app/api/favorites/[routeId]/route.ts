/**
 * POST   /api/favorites/[routeId]  → 收藏
 * DELETE /api/favorites/[routeId]  → 取消收藏
 *
 * Demo 模式：返回操作成功（状态不持久化）
 * 真实模式 TODO：写 DB
 */
import { ok, unauthorized, notFound } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import { isDemoMode, MOCK_ROUTES } from "@/lib/demo-data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ routeId: string }> }
) {
  const { routeId } = await params;
  const authUser = await getAuthUser(request);
  if (!authUser) return unauthorized();

  if (isDemoMode()) {
    const exists = MOCK_ROUTES.find((r) => r.id === routeId);
    if (!exists) return notFound("路线");
    return ok({ routeId, favorited: true }, { message: "收藏成功（演示模式）" });
  }

  // TODO: 真实模式
  // await prisma.favorite.upsert({ where: { user_id_route_id: { user_id: authUser.userId, route_id: routeId } }, create: { user_id: authUser.userId, route_id: routeId }, update: {} });
  // await prisma.route.update({ where: { id: routeId }, data: { favorite_count: { increment: 1 } } });
  // return ok({ routeId, favorited: true });

  return unauthorized();
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ routeId: string }> }
) {
  const { routeId } = await params;
  const authUser = await getAuthUser(request);
  if (!authUser) return unauthorized();

  if (isDemoMode()) {
    return ok({ routeId, favorited: false }, { message: "已取消收藏（演示模式）" });
  }

  // TODO: 真实模式
  // await prisma.favorite.deleteMany({ where: { user_id: authUser.userId, route_id: routeId } });
  // await prisma.route.update({ where: { id: routeId }, data: { favorite_count: { decrement: 1 } } });
  // return ok({ routeId, favorited: false });

  return unauthorized();
}
