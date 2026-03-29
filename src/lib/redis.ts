/**
 * Redis 缓存工具层
 * - 阿里云 Redis（ioredis）
 * - 热门路线缓存 TTL 5min
 * - 标签/城市字典长 TTL
 * - 连接不可用时优雅降级（不影响主业务）
 */
import Redis from "ioredis";

// ─────────────────────────────────────────────
// Redis 单例
// ─────────────────────────────────────────────
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const client = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || "0"),
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 3) return null; // 超过3次放弃
      return Math.min(times * 200, 1000);
    },
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });

  client.on("error", (err) => {
    if (process.env.NODE_ENV !== "test") {
      console.warn("[Redis] Connection error:", err.message);
    }
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// ─────────────────────────────────────────────
// 缓存 Key 规范
// ─────────────────────────────────────────────
export const CACHE_KEYS = {
  // 路线列表（含筛选参数 hash）
  routeList: (params: string) => `zoudi:routes:list:${params}`,
  // 路线详情
  routeDetail: (id: string) => `zoudi:routes:detail:${id}`,
  // 本周推荐
  weeklyRoutes: () => `zoudi:routes:weekly`,
  // 搜索结果
  searchResult: (q: string) => `zoudi:search:${q}`,
  // 标签列表
  tags: () => `zoudi:tags:all`,
  // 搜索热词
  hotwords: () => `zoudi:search:hotwords`,
};

// ─────────────────────────────────────────────
// TTL 常量（秒）
// ─────────────────────────────────────────────
export const CACHE_TTL = {
  routeList: 5 * 60,    // 5 分钟
  routeDetail: 5 * 60,  // 5 分钟
  weekly: 10 * 60,      // 10 分钟
  search: 2 * 60,       // 2 分钟
  tags: 60 * 60,        // 1 小时
  hotwords: 30 * 60,    // 30 分钟
};

// ─────────────────────────────────────────────
// 工具函数：GET with fallback
// ─────────────────────────────────────────────
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null; // Redis 不可用时降级
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttl: number
): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {
    // Redis 不可用时静默失败
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    // ignore
  }
}

// 批量删除（前缀匹配）
export async function cacheDelPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // ignore
  }
}
