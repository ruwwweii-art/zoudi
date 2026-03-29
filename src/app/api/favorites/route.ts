/**
 * GET /api/favorites
 * 获取当前用户收藏列表
 *
 * Demo 模式：返回 mock 收藏（前2条路线）
 * 真实模式 TODO：查 DB
 */
import { ok, unauthorized } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import { parsePaginationParams, calcPagination } from "@/lib/response";
import { isDemoMode, MOCK_ROUTES, toRouteCard } from "@/lib/demo-data";

export async function GET(request: Request) {
  const authUser = await getAuthUser(request);
  if (!authUser) return unauthorized();

  const url = new URL(request.url);
  const { page, pageSize, skip } = parsePaginationParams(url);

  if (isDemoMode()) {
    const allFavs = MOCK_ROUTES.slice(0, 2).map((r) => ({
      id: `fav-${r.id}`,
      route: toRouteCard({ ...r, is_favorited: true }),
      created_at: "2026-03-20T00:00:00.000Z",
    }));
    const paged = allFavs.slice(skip, skip + pageSize);
    return ok(paged, { pagination: calcPagination(page, pageSize, allFavs.length) });
  }

  // TODO: 真实模式
  // const [favs, total] = await Promise.all([
  //   prisma.favorite.findMany({ where: { user_id: authUser.userId }, skip, take: pageSize, include: { route: { include: { tags: { include: { tag: true } } } } }, orderBy: { created_at: "desc" } }),
  //   prisma.favorite.count({ where: { user_id: authUser.userId } }),
  // ]);
  // return ok(favs, { pagination: calcPagination(page, pageSize, total) });

  return ok([]);
}
