/**
 * POST /api/admin/ai/generate
 * AI 路线草稿生成（PRD 11章）
 * 需要管理员权限
 *
 * Demo 模式：调用真实 DashScope AI 生成草稿，不写 DB
 * 真实模式 TODO：写入 ai_route_drafts 表
 */
import { ok, err, forbidden, unauthorized, serverError } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import { generateRouteDraft, generateKidsAdaptation } from "@/lib/ai";
import type { RouteInput } from "@/lib/ai";

async function requireAdmin(request: Request) {
  const user = await getAuthUser(request);
  if (!user) return { user: null, error: unauthorized() };
  if (!user.isAdmin) return { user: null, error: forbidden() };
  return { user, error: null };
}

export async function POST(request: Request) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json().catch(() => null);
  if (!body) return err("请求体格式错误");

  const input: RouteInput = body;

  // 基本校验
  if (!input.city || !input.scenario || !input.poi_candidates?.length) {
    return err("缺少必填字段：city, scenario, poi_candidates");
  }

  try {
    // 调用 AI 生成路线草稿
    const draft = await generateRouteDraft(input);

    // 遛娃场景额外生成亲子适配
    let kidsAdaptation = null;
    if (input.scenario === "kids") {
      const totalWalk = draft.route_steps.reduce(
        (sum, s) => sum + (s.transport_mode === "walk" ? s.transport_minutes : 0),
        0
      );
      kidsAdaptation = await generateKidsAdaptation(
        draft.title,
        draft.route_steps,
        totalWalk
      );
    }

    const result = {
      id: `ai-draft-${Date.now()}`,
      input_json: input,
      output_json: draft,
      kids_adaptation: kidsAdaptation,
      model_name: process.env.AI_MODEL || "qwen3-max-2026-01-23",
      status: "draft",
      created_at: new Date().toISOString(),
    };

    // TODO: 真实模式写 DB
    // await prisma.aiRouteDraft.create({ data: { input_json: input, output_json: draft, model_name: ..., reviewed_by: user.userId } });

    return ok(result, { status: 201, message: "AI 草稿生成成功" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "未知错误";
    console.error("[AI Generate]", msg);
    return serverError(`AI 生成失败：${msg}`);
  }
}
