/**
 * GET /api/search?q=关键词&page=1&pageSize=10
 * 路线搜索
 *
 * Demo 模式：在 MOCK_ROUTES 标题/副标题/描述中做简单文本匹配
 * 真实模式 TODO：PostgreSQL Full Text Search
 */
import { ok, err } from "@/lib/response";
import { parsePaginationParams, calcPagination } from "@/lib/response";
import { isDemoMode, MOCK_ROUTES, MOCK_HOTWORDS, toRouteCard } from "@/lib/demo-data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const { page, pageSize, skip } = parsePaginationParams(url);

  // 返回热词列表（无关键词时）
  if (!q) {
    return ok({ routes: [], total: 0, query: "", hotwords: MOCK_HOTWORDS });
  }

  if (q.length > 50) return err("搜索词过长");

  if (isDemoMode()) {
    const lower = q.toLowerCase();
    const matched = MOCK_ROUTES.filter(
      (r) =>
        r.title.includes(q) ||
        (r.subtitle || "").includes(q) ||
        (r.description || "").includes(q) ||
        r.tags.some((t) => t.name.includes(q)) ||
        r.city.includes(q)
    );
    const total = matched.length;
    const routes = matched.slice(skip, skip + pageSize).map(toRouteCard);
    return ok({ routes, total, query: q }, { pagination: calcPagination(page, pageSize, total) });
  }

  // TODO: 真实模式
  // const [routes, total] = await prisma.$transaction([
  //   prisma.route.findMany({ where: { status: "published", OR: [{ title: { contains: q } }, { subtitle: { contains: q } }, { description: { contains: q } }] }, skip, take: pageSize, include: { tags: { include: { tag: true } } } }),
  //   prisma.route.count({ where: { status: "published", OR: [...] } }),
  // ]);
  // return ok({ routes: routes.map(toRouteCard), total, query: q }, { pagination: calcPagination(page, pageSize, total) });

  return ok({ routes: [], total: 0, query: q });
}
