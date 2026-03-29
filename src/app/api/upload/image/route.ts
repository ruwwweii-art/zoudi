/**
 * POST /api/upload/image
 * 图片上传（管理后台使用）
 * 需要管理员权限
 *
 * Demo 模式：返回 Unsplash 占位图 URL
 * 真实模式 TODO：上传到阿里云 OSS
 */
import { ok, err, forbidden, unauthorized } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-data";

const DEMO_PLACEHOLDER_URLS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
  "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800",
];

export async function POST(request: Request) {
  const authUser = await getAuthUser(request);
  if (!authUser) return unauthorized();
  if (!authUser.isAdmin) return forbidden();

  if (isDemoMode()) {
    const randomUrl = DEMO_PLACEHOLDER_URLS[Math.floor(Math.random() * DEMO_PLACEHOLDER_URLS.length)];
    return ok({ url: randomUrl, key: `demo/placeholder-${Date.now()}.jpg` }, { message: "演示模式：返回占位图" });
  }

  // TODO: 真实模式
  // const formData = await request.formData();
  // const file = formData.get("file") as File;
  // if (!file) return err("未找到文件");
  // const { valid, error } = validateImageFile(file.size, file.type);
  // if (!valid) return err(error!);
  // const buffer = Buffer.from(await file.arrayBuffer());
  // const ossKey = generateOssKey(OSS_DIRS.routeCovers, file.name);
  // const url = await uploadImage(buffer, ossKey, file.type);
  // return ok({ url, key: ossKey });

  return err("当前为演示模式", 501);
}
