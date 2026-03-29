/**
 * 统一 API 响应格式工具
 * 所有 Route Handler 使用此格式返回
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// 成功响应
// ─────────────────────────────────────────────
export function ok<T>(
  data: T,
  options?: { message?: string; pagination?: Pagination; status?: number }
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(options?.message && { message: options.message }),
    ...(options?.pagination && { pagination: options.pagination }),
  };
  return Response.json(body, { status: options?.status ?? 200 });
}

// ─────────────────────────────────────────────
// 错误响应
// ─────────────────────────────────────────────
export function err(
  error: string,
  status: number = 400
): Response {
  const body: ApiResponse = {
    success: false,
    error,
  };
  return Response.json(body, { status });
}

// 常用错误快捷方式
export const unauthorized = () => err("未登录或登录已过期", 401);
export const forbidden = () => err("权限不足", 403);
export const notFound = (resource = "资源") => err(`${resource}不存在`, 404);
export const serverError = (msg = "服务器内部错误") => err(msg, 500);

// ─────────────────────────────────────────────
// 分页计算工具
// ─────────────────────────────────────────────
export function calcPagination(
  page: number,
  pageSize: number,
  total: number
): Pagination {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─────────────────────────────────────────────
// 解析分页参数
// ─────────────────────────────────────────────
export function parsePaginationParams(url: URL): {
  page: number;
  pageSize: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(url.searchParams.get("pageSize") || "10"))
  );
  return { page, pageSize, skip: (page - 1) * pageSize };
}
