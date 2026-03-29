/**
 * GET /api/tags
 * 获取所有标签（用于筛选面板）
 *
 * Demo 模式：返回 MOCK_TAGS
 * 真实模式 TODO：查 DB + Redis 缓存1小时
 */
import { ok } from "@/lib/response";
import { isDemoMode, MOCK_TAGS } from "@/lib/demo-data";

export async function GET() {
  if (isDemoMode()) {
    return ok(MOCK_TAGS);
  }

  // TODO: 真实模式
  // const cached = await cacheGet(CACHE_KEYS.tags());
  // if (cached) return ok(cached);
  // const tags = await prisma.tag.findMany({ orderBy: { sort_order: "asc" } });
  // await cacheSet(CACHE_KEYS.tags(), tags, CACHE_TTL.tags);
  // return ok(tags);

  return ok([]);
}
