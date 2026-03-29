/**
 * GET /api/routes
 * 路线列表（支持筛选 + 分页）
 * Query params: scene, duration, budget, weather, kidAge, tags, page, pageSize, sortBy
 *
 * Demo 模式：在内存中过滤 MOCK_ROUTES
 * 真实模式 TODO：Prisma 查询 + Redis 缓存
 */
import { ok } from "@/lib/response";
import { parsePaginationParams, calcPagination } from "@/lib/response";
import { isDemoMode, MOCK_ROUTES, toRouteCard } from "@/lib/demo-data";
import type { RouteDetail } from "@/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scene = url.searchParams.get("scene");
  const duration = url.searchParams.get("duration");
  const budget = url.searchParams.get("budget");
  const weather = url.searchParams.get("weather");
  const kidAge = url.searchParams.get("kidAge");
  const sortBy = url.searchParams.get("sortBy") || "newest";
  const { page, pageSize, skip } = parsePaginationParams(url);

  if (isDemoMode()) {
    let routes = MOCK_ROUTES.filter((r) => r.status !== "archived" && r.published_at);

    // 场景筛选
    if (scene) routes = routes.filter((r) => r.scene === scene);

    // 时长筛选
    if (duration) routes = routes.filter((r) => r.duration_type === duration);

    // 天气筛选
    if (weather && weather !== "both") {
      routes = routes.filter((r) => r.weather_type === weather || r.weather_type === "both");
    }

    // 预算筛选（人均）
    if (budget && budget !== "unlimited") {
      const maxBudget = parseInt(budget);
      routes = routes.filter(
        (r) => r.budget_per_person === null || r.budget_per_person <= maxBudget
      );
    }

    // 孩子年龄筛选（遛娃场景）
    if (kidAge) {
      const [minAge, maxAge] = kidAge.split("-").map(Number);
      routes = routes.filter(
        (r) =>
          r.kid_age_min === null ||
          (r.kid_age_min <= maxAge && (r.kid_age_max ?? 99) >= minAge)
      );
    }

    // 排序
    if (sortBy === "rating") routes.sort((a, b) => b.avg_rating - a.avg_rating);
    else if (sortBy === "favorites") routes.sort((a, b) => b.favorite_count - a.favorite_count);
    else routes.sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());

    const total = routes.length;
    const paged = routes.slice(skip, skip + pageSize).map(toRouteCard);

    return ok(paged, { pagination: calcPagination(page, pageSize, total) });
  }

  // TODO: 真实模式
  // const where = buildWhereClause({ scene, duration, budget, weather, kidAge });
  // const [routes, total] = await Promise.all([
  //   prisma.route.findMany({ where, skip, take: pageSize, include: { tags: { include: { tag: true } } }, orderBy: ... }),
  //   prisma.route.count({ where }),
  // ]);
  // return ok(routes.map(toRouteCard), { pagination: calcPagination(page, pageSize, total) });

  return ok([], { pagination: calcPagination(1, 10, 0) });
}
