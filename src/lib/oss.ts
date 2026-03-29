/**
 * 阿里云 OSS 图片存储工具层
 * - 上传图片（管理后台使用）
 * - 生成图片访问 URL
 * - 文件类型/大小校验（PRD: ≤10MB, jpg/png/webp）
 */
import OSS from "ali-oss";

// ─────────────────────────────────────────────
// OSS 客户端单例
// ─────────────────────────────────────────────
const globalForOss = globalThis as unknown as {
  ossClient: OSS | undefined;
};

function createOssClient(): OSS {
  return new OSS({
    region: process.env.OSS_REGION || "oss-cn-hangzhou",
    accessKeyId: process.env.ALICLOUD_ACCESS_KEY_ID || "",
    accessKeySecret: process.env.ALICLOUD_ACCESS_KEY_SECRET || "",
    bucket: process.env.OSS_BUCKET || "zoudi-assets",
    secure: true, // HTTPS
  });
}

export function getOssClient(): OSS {
  if (!globalForOss.ossClient) {
    globalForOss.ossClient = createOssClient();
  }
  return globalForOss.ossClient;
}

// ─────────────────────────────────────────────
// 常量
// ─────────────────────────────────────────────
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB（PRD 要求）
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// OSS 目录结构
export const OSS_DIRS = {
  routeCovers: "routes/covers/",   // 路线封面
  routeImages: "routes/images/",   // 路线站点图
  poiImages: "pois/",              // POI 点位图
  avatars: "avatars/",             // 用户头像
};

// ─────────────────────────────────────────────
// 文件校验
// ─────────────────────────────────────────────
export function validateImageFile(
  size: number,
  mimeType: string
): { valid: boolean; error?: string } {
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: "图片大小不能超过 10MB" };
  }
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return { valid: false, error: "仅支持 jpg、png、webp 格式" };
  }
  return { valid: true };
}

// ─────────────────────────────────────────────
// 生成 OSS 存储路径
// ─────────────────────────────────────────────
export function generateOssKey(
  dir: string,
  originalName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const ext = originalName.split(".").pop() || "jpg";
  const random = Math.random().toString(36).slice(2, 8);
  const filename = prefix
    ? `${prefix}-${timestamp}-${random}.${ext}`
    : `${timestamp}-${random}.${ext}`;
  return `${dir}${filename}`;
}

// ─────────────────────────────────────────────
// 上传图片（Buffer）
// ─────────────────────────────────────────────
export async function uploadImage(
  buffer: Buffer,
  ossKey: string,
  mimeType: string
): Promise<string> {
  const client = getOssClient();
  await client.put(ossKey, buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000", // 1年缓存
    },
  });
  return getImageUrl(ossKey);
}

// ─────────────────────────────────────────────
// 获取图片访问 URL
// ─────────────────────────────────────────────
export function getImageUrl(ossKey: string): string {
  const cdnDomain = process.env.OSS_CDN_DOMAIN;
  if (cdnDomain) {
    return `${cdnDomain}/${ossKey}`;
  }
  // 降级：直接使用 OSS URL
  const region = process.env.OSS_REGION || "oss-cn-hangzhou";
  const bucket = process.env.OSS_BUCKET || "zoudi-assets";
  return `https://${bucket}.${region}.aliyuncs.com/${ossKey}`;
}

// ─────────────────────────────────────────────
// 删除图片
// ─────────────────────────────────────────────
export async function deleteImage(ossKey: string): Promise<void> {
  try {
    const client = getOssClient();
    await client.delete(ossKey);
  } catch (err) {
    console.warn("[OSS] Delete failed:", ossKey, err);
  }
}

// ─────────────────────────────────────────────
// 从 URL 提取 OSS Key
// ─────────────────────────────────────────────
export function extractOssKey(url: string): string | null {
  const cdnDomain = process.env.OSS_CDN_DOMAIN;
  if (cdnDomain && url.startsWith(cdnDomain)) {
    return url.slice(cdnDomain.length + 1);
  }
  // 尝试从标准 OSS URL 提取
  const match = url.match(/aliyuncs\.com\/(.+)$/);
  return match ? match[1] : null;
}
