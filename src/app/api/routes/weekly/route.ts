/**
 * GET /api/routes/weekly
 * 本周推荐路线（首页横滑区，最多3条 is_featured 路线）
 *
 * Demo 模式：返回 MOCK_ROUTES 中 is_featured=true 的前3条
 * 真实模式 TODO：查 DB + Redis 缓存10分钟
 */
import { ok } from "@/lib/response";
import { isDemoMode, MOCK_ROUTES, toRouteCard } from "@/lib/demo-data";

export async function GET() {
  if (isDemoMode()) {
    const weekly = MOCK_ROUTES
      .filter((r) => r.is_featured && r.published_at)
      .slice(0, 3)
      .map(toRouteCard);
    return ok(weekly);
  }

  // TODO: 真实模式
  // const cached = await cacheGet(CACHE_KEYS.weeklyRoutes());
  // if (cached) return ok(cached);
  // const routes = await prisma.route.findMany({ where: { is_featured: true, status: "published" }, take: 3, orderBy: { published_at: "desc" }, include: { tags: { include: { tag: true } } } });
  // const result = routes.map(toRouteCard);
  // await cacheSet(CACHE_KEYS.weeklyRoutes(), result, CACHE_TTL.weekly);
  // return ok(result);

  return ok([]);
}
