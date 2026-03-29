/**
 * AI 服务层 - 阿里云 DashScope（通义千问，OpenAI 兼容接口）
 * 实现 PRD 第11章「AI 能力架构与 Prompt」
 *
 * MVP 阶段 AI 不直接面向用户，只在后台辅助内容生产：
 * 1. 路线草稿生成（PRD 11.3 输入 → 11.4 输出）
 * 2. 遛娃适配补充（PRD 11.6 额外 Prompt）
 */
import OpenAI from "openai";

// ─────────────────────────────────────────────
// 客户端单例（DashScope OpenAI 兼容接口）
// ─────────────────────────────────────────────
const globalForAI = globalThis as unknown as {
  dashscope: OpenAI | undefined;
};

export function getAIClient(): OpenAI {
  if (!globalForAI.dashscope) {
    globalForAI.dashscope = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL:
        process.env.DASHSCOPE_BASE_URL ||
        "https://coding.dashscope.aliyuncs.com/v1",
    });
  }
  return globalForAI.dashscope;
}

function getModel(): string {
  return process.env.AI_MODEL || "qwen3-max-2026-01-23";
}

// ─────────────────────────────────────────────
// PRD 11.3 - 运营输入 Schema
// ─────────────────────────────────────────────
export interface RouteInput {
  city: string;
  scenario: "date" | "kids" | "citywalk";
  target_user: string;
  time_span: "short" | "half_day" | "full_day";
  budget_range: string;
  weather: "sunny" | "rainy" | "both";
  indoor_outdoor: "indoor" | "outdoor" | "both";
  start_area: string;
  constraints: string[];
  poi_candidates: PoiCandidate[];
  kid_age?: string;
  stroller_needed?: boolean;
}

export interface PoiCandidate {
  name: string;
  category: string;
  stay_minutes: number;
  notes?: string;
}

// ─────────────────────────────────────────────
// PRD 11.4 - AI 输出 Schema
// ─────────────────────────────────────────────
export interface RouteOutput {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  tips: string[];
  rainy_alternative: string;
  fit_for: string[];
  not_fit_for: string[];
  risk_notes: string[];
  tags: string[];
  suggested_start_time: string;
  route_steps: RouteStepOutput[];
}

export interface RouteStepOutput {
  step_no: number;
  poi_name: string;
  title: string;
  activity_tips: string;
  photo_spots: string;
  stay_minutes: number;
  transport_mode: "walk" | "bus" | "drive" | "subway";
  transport_minutes: number;
  transport_tips: string;
}

// ─────────────────────────────────────────────
// PRD 11.5 - System Prompt（路线草稿生成）
// ─────────────────────────────────────────────
const ROUTE_DRAFT_SYSTEM_PROMPT = `你是「走地」App 的本地路线编辑。你的任务是基于结构化输入，生成可直接执行的周末路线文案草稿。

核心要求：
1. 输出严格按照指定 JSON Schema，不要输出解释性文字，直接返回 JSON
2. 文案要真实、克制、实用，像靠谱的朋友在分享，不要小红书体、不要过度感叹号和emoji
3. 约会场景：温暖浪漫但不腻
4. 遛娃场景：实用靠谱，关注孩子体验和家长省心度
5. Tips 必须真正实用（如"这家店周一休息""停车场最多20个位"），不要写"记得带好心情"这种废话
6. 必须给出 fit_for / not_fit_for / risk_notes，帮用户做预期管理
7. 不要编造不存在的地名或商铺。若信息不足，明确标记"【需人工补充】"
8. 步骤顺序要考虑实际地理位置，避免走回头路
9. 预算数字要合理，不要凭空编造
10. title ≤16字，subtitle ≤40字，description 200-300字`;

// ─────────────────────────────────────────────
// PRD 11.6 - 遛娃适配补充 Prompt
// ─────────────────────────────────────────────
const KIDS_ADAPT_SYSTEM_PROMPT = `你是一位经验丰富的亲子出行顾问。请根据以下路线信息，生成针对不同年龄段的适配评估。

要求：
1. 严格按 JSON 格式输出，不要有解释性文字
2. 评估要客观真实，不适合的年龄段要明确说不适合并给出原因
3. 厕所、母婴室、休息点信息尽量具体（如"第2站入口右侧有公厕"）
4. 安全警告要具体（如"第1站有台阶，需大人抱着婴儿"）`;

// ─────────────────────────────────────────────
// 遛娃适配输出 Schema
// ─────────────────────────────────────────────
export interface KidsAdaptOutput {
  age_suitability: {
    "0-2": { suitable: boolean; reason: string; tips: string };
    "2-4": { suitable: boolean; reason: string; tips: string };
    "4-8": { suitable: boolean; reason: string; tips: string };
  };
  stroller_tips: string;
  rest_points: string[];
  food_options: string[];
  restroom_locations: string[];
  nursing_room: string;
  safety_warnings: string[];
}

// ─────────────────────────────────────────────
// 主函数：生成路线草稿
// ─────────────────────────────────────────────
export async function generateRouteDraft(
  input: RouteInput
): Promise<RouteOutput> {
  const client = getAIClient();
  const model = getModel();

  const userMessage = `请根据以下结构化信息生成路线草稿：

\`\`\`json
${JSON.stringify(input, null, 2)}
\`\`\`

请按以下 JSON Schema 输出（直接输出 JSON，不要有其他文字）：
{
  "title": "路线标题（≤16字）",
  "subtitle": "一句话亮点（≤40字）",
  "description": "路线描述（200-300字）",
  "highlights": ["亮点1", "亮点2", "亮点3"],
  "tips": ["实用提示1", "实用提示2"],
  "rainy_alternative": "雨天备选方案",
  "fit_for": ["适合人群1", "适合人群2"],
  "not_fit_for": ["不适合人群1"],
  "risk_notes": ["风险提示1"],
  "tags": ["标签1", "标签2"],
  "suggested_start_time": "建议出发时间，如10:00",
  "route_steps": [
    {
      "step_no": 1,
      "poi_name": "站点名称",
      "title": "站点小标题",
      "activity_tips": "在这站做什么（具体）",
      "photo_spots": "拍照建议",
      "stay_minutes": 45,
      "transport_mode": "walk|bus|drive|subway",
      "transport_minutes": 15,
      "transport_tips": "到下一站交通说明"
    }
  ]
}`;

  const response = await client.chat.completions.create({
    model,
    max_tokens: 4000,
    messages: [
      { role: "system", content: ROUTE_DRAFT_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI 返回内容为空");
  }

  const jsonText = extractJson(content);
  const result = JSON.parse(jsonText) as RouteOutput;
  return result;
}

// ─────────────────────────────────────────────
// 遛娃适配补充生成
// ─────────────────────────────────────────────
export async function generateKidsAdaptation(
  routeTitle: string,
  steps: RouteStepOutput[],
  totalWalkMinutes: number,
  routeNotes?: string
): Promise<KidsAdaptOutput> {
  const client = getAIClient();
  const model = getModel();

  const inputData = {
    route_title: routeTitle,
    stops: steps.map((s) => ({
      name: s.poi_name,
      stay_minutes: s.stay_minutes,
      transport_to_next: `${s.transport_mode} ${s.transport_minutes}min`,
    })),
    total_walk_minutes: totalWalkMinutes,
    notes: routeNotes || "",
  };

  const userMessage = `请根据以下路线信息生成亲子适配评估：

\`\`\`json
${JSON.stringify(inputData, null, 2)}
\`\`\`

请按以下 JSON Schema 输出（直接输出 JSON）：
{
  "age_suitability": {
    "0-2": {"suitable": true/false, "reason": "原因", "tips": "建议"},
    "2-4": {"suitable": true/false, "reason": "原因", "tips": "建议"},
    "4-8": {"suitable": true/false, "reason": "原因", "tips": "建议"}
  },
  "stroller_tips": "推车使用建议",
  "rest_points": ["休息点1", "休息点2"],
  "food_options": ["餐饮选项1"],
  "restroom_locations": ["厕所位置1"],
  "nursing_room": "最近母婴室位置或无",
  "safety_warnings": ["安全提醒1"]
}`;

  const response = await client.chat.completions.create({
    model,
    max_tokens: 2000,
    messages: [
      { role: "system", content: KIDS_ADAPT_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI 返回内容为空");
  }

  const jsonText = extractJson(content);
  return JSON.parse(jsonText) as KidsAdaptOutput;
}

// ─────────────────────────────────────────────
// 工具：从 AI 响应中提取 JSON（兼容 markdown 包裹）
// ─────────────────────────────────────────────
function extractJson(text: string): string {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text.trim();
}
