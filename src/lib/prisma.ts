/**
 * Prisma Client 单例
 * 使用 DATABASE_URL 直接连接 MySQL，方便本地免费实例或云数据库切换
 */
import { PrismaClient } from "@/generated/prisma";
import { DEMO_MODE } from "@/lib/demo";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL 未配置。当前如果只想演示页面，请保持 DEMO_MODE=true；如果需要真实数据，请先配置 MySQL。"
    );
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });
}

function createPrismaStub(): PrismaClient {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          "当前处于演示模式，数据库访问已禁用。请先关闭 DEMO_MODE 并配置 MySQL 后再调用 Prisma。"
        );
      },
    }
  ) as PrismaClient;
}

export const prisma =
  DEMO_MODE && !process.env.DATABASE_URL
    ? createPrismaStub()
    : globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
