/**
 * GET /api/routes/[id]
 * 路线详情
 *
 * Demo 模式：从 MOCK_ROUTES 查找
 * 真实模式 TODO：Prisma 查询 + 浏览历史记录 + Redis 缓存
 */
import { ok, notFound } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import { isDemoMode, MOCK_ROUTES } from "@/lib/demo-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authUser = await getAuthUser(request);

  if (isDemoMode()) {
    const route = MOCK_ROUTES.find((r) => r.id === id);
    if (!route) return notFound("路线");

    // 如果已登录，模拟收藏状态
    const result = { ...route, is_favorited: authUser ? route.is_favorited : false };
    return ok(result);
  }

  // TODO: 真实模式
  // const route = await prisma.route.findUnique({
  //   where: { id, status: "published" },
  //   include: { steps: { include: { poi: true }, orderBy: { sequence_order: "asc" } }, tags: { include: { tag: true } }, images: { orderBy: { sort_order: "asc" } } },
  // });
  // if (!route) return notFound("路线");
  // if (authUser) {
  //   const fav = await prisma.favorite.findUnique({ where: { user_id_route_id: { user_id: authUser.userId, route_id: id } } });
  //   await prisma.viewHistory.upsert({ where: { user_id_route_id: { user_id: authUser.userId, route_id: id } }, update: { viewed_at: new Date() }, create: { user_id: authUser.userId, route_id: id } });
  //   return ok({ ...route, is_favorited: !!fav });
  // }
  // await prisma.route.update({ where: { id }, data: { view_count: { increment: 1 } } });
  // return ok({ ...route, is_favorited: false });

  return notFound("路线");
}
