import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MOCK_ROUTES } from "@/lib/demo-data";
import { RouteVisualization } from "@/components/ui/RouteVisualization";
import type { RouteStepDetail } from "@/types";

const TRANSPORT: Record<string, string> = {
  walk: "🚶 步行", bus: "🚌 公交", drive: "🚗 驾车", subway: "🚇 地铁",
};

const SCENE: Record<string, { color: string; bg: string; label: string }> = {
  date:     { color: "var(--scene-date)",  bg: "var(--scene-date-bg)",  label: "约会" },
  kids:     { color: "var(--scene-kids)",  bg: "var(--scene-kids-bg)",  label: "遛娃" },
  citywalk: { color: "var(--scene-walk)",  bg: "var(--scene-walk-bg)",  label: "Citywalk" },
};

const DUR: Record<string, string> = { short: "2h 内", half: "半日游", full: "全日游" };

interface Props { params: Promise<{ id: string }> }

export default async function RouteDetailPage({ params }: Props) {
  const { id } = await params;
  const route = MOCK_ROUTES.find((r) => r.id === id);
  if (!route) notFound();

  const sc = SCENE[route.scene] ?? SCENE.date;

  return (
    <div className="mobile-container" style={{ background: "var(--card)" }}>

      {/* ══════════════════ 封面 ══════════════════ */}
      <div className="relative w-full" style={{ height: 320 }}>
        {route.cover_image_url ? (
          <Image src={route.cover_image_url} alt={route.title} fill className="object-cover" sizes="430px" priority />
        ) : (
          <div className="w-full h-full" style={{ background: sc.bg }} />
        )}

        {/* 蒙层 */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 35%, rgba(0,0,0,0.55) 100%)" }} />

        {/* 顶部操作栏 */}
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <Link href="/routes" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2.5}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════ 信息卡片（上浮叠加封面） ══════════════════ */}
      <div className="relative px-4" style={{ marginTop: -48 }}>
        <div className="card p-5">
          {/* 标签组 */}
          <div className="flex flex-wrap gap-1.5">
            <span className="pill" style={{ background: sc.bg, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
            <span className="pill pill-muted">{DUR[route.duration_type] ?? route.duration_type}</span>
            {route.weather_type !== "both" && <span className="pill pill-muted">{route.weather_type === "sunny" ? "☀️ 晴天" : "🌧 雨天"}</span>}
            {route.scene === "kids" && route.stroller_friendly && <span className="pill pill-muted">🛻 推车友好</span>}
          </div>

          {/* 标题 */}
          <h1 className="mt-3" style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 720, lineHeight: 1.3, letterSpacing: "-0.025em", color: "var(--text-primary)" }}>
            {route.title}
          </h1>
          {route.subtitle && (
            <p className="mt-2" style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-muted)", fontWeight: 400, letterSpacing: "0.005em" }}>{route.subtitle}</p>
          )}

          {/* 评分行 */}
          <div className="flex items-center gap-1.5 mt-3">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span style={{ fontSize: 14, fontWeight: 650, color: "var(--text-primary)" }}>{route.avg_rating.toFixed(1)}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 400 }}>· {route.favorite_count} 人收藏</span>
          </div>

          {/* 数据格 */}
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {[
              { icon: "💰", label: "人均", value: route.budget_per_person ? `¥${route.budget_per_person}` : "免费" },
              { icon: "⏱", label: "时长", value: `约${(route.duration_minutes / 60).toFixed(1).replace(".0", "")}h` },
              { icon: "📍", label: "站点", value: `${route.stop_count} 站` },
            ].map((d) => (
              <div key={d.label} className="info-block text-center">
                <span style={{ fontSize: 17 }}>{d.icon}</span>
                <p style={{ fontSize: 10.5, marginTop: 5, color: "var(--text-muted)", fontWeight: 450, letterSpacing: "0.02em" }}>{d.label}</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 680, marginTop: 2, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════ 内容区 ══════════════════ */}
      <div className="px-4 pt-7 pb-28">

        {/* 可视化路线图 */}
        <RouteVisualization steps={route.steps} suggestedStartTime={route.suggested_start_time} />

        {/* 路线亮点 */}
        {route.highlights.length > 0 && (
          <section style={{ marginTop: "var(--space-section)" }}>
            <h2 className="section-title mb-3.5">路线亮点</h2>
            <div className="card p-4 flex flex-col gap-2.5">
              {route.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-none w-6 h-6 rounded-full flex items-center justify-center" style={{ fontSize: 11, fontWeight: 700, background: "var(--accent-light)", color: "#8b6914" }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-secondary)", paddingTop: 2 }}>{h}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 路线介绍 */}
        {route.description && (
          <section style={{ marginTop: "var(--space-section)" }}>
            <h2 className="section-title mb-3">路线介绍</h2>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "var(--text-secondary)", fontWeight: 400, letterSpacing: "0.005em" }}>{route.description}</p>
          </section>
        )}

        {/* 出发时间 */}
        {route.suggested_start_time && (
          <div className="info-block flex items-center gap-3" style={{ marginTop: "var(--space-module)" }}>
            <span style={{ fontSize: 20 }}>🕐</span>
            <div>
              <p style={{ fontSize: 10.5, color: "var(--text-muted)", fontWeight: 450, letterSpacing: "0.02em" }}>建议出发</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 680, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{route.suggested_start_time}</p>
            </div>
          </div>
        )}

        {/* 站点详情 */}
        {route.steps.length > 0 && (
          <section style={{ marginTop: "var(--space-section)" }}>
            <h2 className="section-title mb-4">路线站点</h2>
            <div className="flex flex-col">
              {route.steps.map((step, idx) => (
                <StepCard key={step.id} step={step} index={idx} isLast={idx === route.steps.length - 1} />
              ))}
            </div>
          </section>
        )}

        {/* 亲子设施 */}
        {route.scene === "kids" && (
          <section style={{ marginTop: "var(--space-section)" }}>
            <h2 className="section-title mb-3.5">亲子设施</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "has_restroom",    label: "厕所",   icon: "🚻" },
                { key: "has_nursing_room", label: "母婴室", icon: "🍼" },
                { key: "has_parking",     label: "停车场", icon: "🅿️" },
                { key: "has_dining",      label: "餐饮",   icon: "🍜" },
                { key: "stroller_friendly", label: "推车友好", icon: "🛻" },
              ].map((item) => {
                const has = route[item.key as keyof typeof route] as boolean;
                return (
                  <div key={item.key} className="card-flat p-3 flex items-center gap-2" style={{ background: has ? "var(--scene-kids-bg)" : "var(--bg)", borderColor: has ? "var(--scene-kids-tag)" : "var(--border)" }}>
                    <span>{item.icon}</span>
                    <span style={{ fontSize: 13, color: has ? "var(--scene-kids)" : "var(--text-muted)" }}>{item.label}</span>
                    <span className="ml-auto" style={{ fontSize: 12, color: has ? "var(--scene-kids)" : "var(--text-muted)" }}>{has ? "✓" : "—"}</span>
                  </div>
                );
              })}
              {route.kid_age_min != null && (
                <div className="col-span-2 card-flat p-3 flex items-center gap-2" style={{ background: "var(--scene-kids-bg)", borderColor: "var(--scene-kids-tag)" }}>
                  <span>👶</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--scene-kids)" }}>适合 {route.kid_age_min}–{route.kid_age_max} 岁</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tips */}
        {route.tips.length > 0 && (
          <section style={{ marginTop: "var(--space-section)" }}>
            <h2 className="section-title mb-3.5">实用提示</h2>
            <div className="card-flat p-4 flex flex-col gap-2" style={{ background: "var(--scene-walk-bg)", borderColor: "var(--scene-walk-tag)" }}>
              {route.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: "var(--scene-walk)", lineHeight: 1.65 }}>•</span>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)" }}>{tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 适合 / 不适合 */}
        <div className="flex flex-col gap-3" style={{ marginTop: "var(--space-section)" }}>
          {route.fit_for.length > 0 && (
            <div className="card-flat p-4" style={{ background: "var(--scene-kids-bg)", borderColor: "var(--scene-kids-tag)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--scene-kids)", marginBottom: 8 }}>✅ 适合</p>
              <div className="flex flex-wrap gap-1.5">
                {route.fit_for.map((f, i) => (
                  <span key={i} className="pill" style={{ background: "#dcfce7", color: "#15803d" }}>{f}</span>
                ))}
              </div>
            </div>
          )}
          {route.not_fit_for.length > 0 && (
            <div className="card-flat p-4" style={{ background: "var(--scene-date-bg)", borderColor: "var(--scene-date-tag)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--scene-date)", marginBottom: 8 }}>❌ 不适合</p>
              <div className="flex flex-wrap gap-1.5">
                {route.not_fit_for.map((f, i) => (
                  <span key={i} className="pill" style={{ background: "#ffe4e6", color: "#be123c" }}>{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 雨天备选 */}
        {route.rainy_alternative && (
          <div className="card-flat p-4 mt-4 flex items-start gap-3" style={{ background: "#f0f9ff", borderColor: "#bae6fd" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🌧</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 4 }}>雨天备选</p>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)" }}>{route.rainy_alternative}</p>
            </div>
          </div>
        )}

        {/* 风险提示 */}
        {route.risk_notes.length > 0 && (
          <div className="card-flat p-4 mt-4" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", marginBottom: 6 }}>⚠️ 注意事项</p>
            {route.risk_notes.map((n, i) => (
              <p key={i} style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)" }}>• {n}</p>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════ 底部固定 CTA ══════════════════ */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pt-3 glass-bar" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))", borderTop: "1px solid var(--border)" }}>
        <div className="flex gap-2.5">
          <a
            href={route.steps[0]?.poi?.amap_id
              ? `https://uri.amap.com/poi?id=${route.steps[0].poi.amap_id}`
              : `https://uri.amap.com/search?keywords=${encodeURIComponent(route.steps[0]?.poi_name ?? route.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/></svg>
            一键导航
          </a>
          <button className="btn-secondary" style={{ padding: "14px 16px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          <button className="btn-secondary" style={{ padding: "14px 16px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 站点卡片 ── */
function StepCard({ step, index, isLast }: { step: RouteStepDetail; index: number; isLast: boolean }) {
  return (
    <div className="flex gap-3">
      {/* 时间线 */}
      <div className="flex flex-col items-center flex-none" style={{ width: 28 }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center z-10" style={{ fontSize: 12, fontWeight: 700, background: "var(--text-primary)", color: "var(--accent)" }}>
          {index + 1}
        </div>
        {!isLast && <div className="flex-1 w-px mt-1" style={{ background: "var(--border)", minHeight: 32 }} />}
      </div>

      {/* 内容 */}
      <div className="flex-1 pb-3">
        <div className="card-flat p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 640, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{step.poi_name}</h3>
            {step.stay_duration && (
              <span className="pill pill-muted flex-none" style={{ fontSize: 10.5, fontWeight: 450 }}>停留 {step.stay_duration}min</span>
            )}
          </div>

          {step.activity_tips && (
            <p className="mt-2" style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--text-secondary)", fontWeight: 400 }}>{step.activity_tips}</p>
          )}

          {step.photo_spots && (
            <p className="mt-2" style={{ fontSize: 12, color: "var(--text-muted)" }}>📸 {step.photo_spots}</p>
          )}

          {step.poi?.address && (
            <p className="mt-1" style={{ fontSize: 12, color: "var(--text-muted)" }}>📍 {step.poi.address}</p>
          )}
        </div>

        {/* 交通指引 */}
        {!isLast && step.transport_to_next && (
          <div className="mt-1.5 ml-2 flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <span>{TRANSPORT[step.transport_to_next] ?? step.transport_to_next}</span>
            {step.time_to_next != null && <span>{step.time_to_next}min</span>}
            {step.distance_to_next != null && <span>· {step.distance_to_next >= 1000 ? `${(step.distance_to_next / 1000).toFixed(1)}km` : `${step.distance_to_next}m`}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
