/**
 * GET  /api/admin/routes  → 路线列表（含草稿）
 * POST /api/admin/routes  → 创建路线
 * 需要管理员权限
 *
 * Demo 模式：GET 返回所有 mock 路线，POST 返回模拟创建成功
 * 真实模式 TODO：Prisma 读写
 */
import { ok, err, forbidden, unauthorized } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import { parsePaginationParams, calcPagination } from "@/lib/response";
import { isDemoMode, MOCK_ROUTES, toRouteCard } from "@/lib/demo-data";

async function requireAdmin(request: Request) {
  const user = await getAuthUser(request);
  if (!user) return { user: null, error: unauthorized() };
  if (!user.isAdmin) return { user: null, error: forbidden() };
  return { user, error: null };
}

export async function GET(request: Request) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const url = new URL(request.url);
  const { page, pageSize, skip } = parsePaginationParams(url);
  const status = url.searchParams.get("status");

  if (isDemoMode()) {
    let routes = [...MOCK_ROUTES];
    if (status) routes = routes.filter((r) => (r as any).status === status);
    const total = routes.length;
    const paged = routes.slice(skip, skip + pageSize).map(toRouteCard);
    return ok(paged, { pagination: calcPagination(page, pageSize, total) });
  }

  // TODO: 真实模式
  // const where = status ? { status } : {};
  // const [routes, total] = await Promise.all([prisma.route.findMany({ where, skip, take: pageSize }), prisma.route.count({ where })]);
  // return ok(routes, { pagination: calcPagination(page, pageSize, total) });

  return ok([], { pagination: calcPagination(1, 10, 0) });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json().catch(() => null);
  if (!body || !body.title) return err("缺少必填字段 title");

  if (isDemoMode()) {
    const mockRoute = {
      id: `route-demo-${Date.now()}`,
      ...body,
      status: "draft",
      created_at: new Date().toISOString(),
    };
    return ok(mockRoute, { status: 201, message: "路线已创建（演示模式，不持久化）" });
  }

  // TODO: 真实模式
  // const route = await prisma.route.create({ data: { ...body, status: "draft" } });
  // return ok(route, { status: 201 });

  return err("当前为演示模式", 501);
}
