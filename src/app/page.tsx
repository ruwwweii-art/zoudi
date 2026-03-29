import Link from "next/link";
import Image from "next/image";
import { BottomNav } from "@/components/layout/BottomNav";
import { RouteCard } from "@/components/ui/RouteCard";
import { MOCK_ROUTES, toRouteCard } from "@/lib/demo-data";

const SCENES = [
  { key: "date",     label: "约会",      emoji: "💕", desc: "情侣 · 纪念日",      color: "var(--scene-date)",  bg: "var(--scene-date-bg)", border: "var(--scene-date-tag)" },
  { key: "kids",     label: "遛娃",      emoji: "👶", desc: "0-8岁 · 推车友好",    color: "var(--scene-kids)",  bg: "var(--scene-kids-bg)", border: "var(--scene-kids-tag)" },
  { key: "citywalk", label: "Citywalk", emoji: "🚶", desc: "市井 · 随便逛逛",     color: "var(--scene-walk)",  bg: "var(--scene-walk-bg)", border: "var(--scene-walk-tag)" },
];

const weekly  = MOCK_ROUTES.filter((r) => r.is_featured).slice(0, 3).map(toRouteCard);
const popular = MOCK_ROUTES.slice(0, 4).map(toRouteCard);

export default function HomePage() {
  return (
    <div className="mobile-container pb-nav">

      {/* ─── 顶部栏 ─── */}
      <header className="page-px flex items-center justify-between pt-14 pb-3">
        <div className="flex items-center gap-2.5">
          <span style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 720, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>走地</span>
          <span className="pill-muted pill" style={{ fontSize: 11, fontWeight: 450 }}>杭州</span>
        </div>
        <Link href="/routes" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#f0ece6" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </Link>
      </header>

      {/* ─── Hero ─── */}
      <section className="page-px mt-2">
        <div className="relative overflow-hidden" style={{ borderRadius: "var(--radius-xl)", minHeight: 240 }}>
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80"
            alt="周末出行"
            fill
            className="object-cover"
            sizes="430px"
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, rgba(26,23,20,0.75) 0%, rgba(26,23,20,0.4) 45%, rgba(26,23,20,0.72) 100%)" }} />

          <div className="relative flex flex-col justify-end p-7" style={{ minHeight: 240 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 720, lineHeight: 1.25, letterSpacing: "-0.03em", color: "#fffdf8" }}>
              周末去哪<br />
              <span style={{ color: "var(--accent)" }}>3 分钟搞定</span>
            </h1>
            <p className="mt-2.5" style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,253,248,0.65)", maxWidth: 240, fontWeight: 400, letterSpacing: "0.01em" }}>
              选场景，挑路线，直接出发
            </p>
            <Link href="/routes" className="btn-primary mt-5" style={{ alignSelf: "flex-start", borderRadius: "var(--radius-full)", padding: "11px 22px", fontSize: 13.5 }}>
              立即找路线
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 12h14M13 5l6 7-6 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 场景入口 ─── */}
      <section style={{ marginTop: "var(--space-section)" }}>
        <div className="page-px flex items-center justify-between mb-4">
          <span className="section-title">选场景</span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
          {SCENES.map((s) => (
            <Link key={s.key} href={`/routes?scene=${s.key}`} className="flex-none rounded-2xl p-4" style={{ minWidth: 125, background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ fontSize: 24 }}>{s.emoji}</span>
              <p className="mt-2.5" style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 650, color: s.color, letterSpacing: "-0.01em" }}>{s.label}</p>
              <p style={{ fontSize: 11, marginTop: 3, color: s.color, opacity: 0.55, fontWeight: 400, letterSpacing: "0.01em" }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 本周推荐 ─── */}
      <section style={{ marginTop: "var(--space-section)" }}>
        <div className="page-px flex items-center justify-between mb-4">
          <span className="section-title">本周推荐</span>
          <Link href="/routes" className="section-link">查看全部 →</Link>
        </div>
        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 scrollbar-none">
          {weekly.map((r) => (
            <div key={r.id} className="flex-none" style={{ width: 272 }}>
              <RouteCard route={r} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── AI 入口 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-section)" }}>
        <Link href="/admin/ai-generate" className="flex items-center gap-4 p-5" style={{ borderRadius: "var(--radius-lg)", background: "linear-gradient(135deg, var(--text-primary), #3d3530)" }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-none" style={{ background: "rgba(200,169,126,0.18)" }}>
            <span style={{ fontSize: 22 }}>✨</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 14, fontWeight: 580, color: "#fffdf8", letterSpacing: "0.01em" }}>AI 生成路线</p>
            <p style={{ fontSize: 12, marginTop: 3, color: "rgba(160,153,144,0.85)", fontWeight: 400 }}>输入场景和地点，自动规划完整路线</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(160,153,144,0.6)" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14M13 5l6 7-6 7"/></svg>
        </Link>
      </section>

      {/* ─── 为你推荐 ─── */}
      <section style={{ marginTop: "var(--space-section)" }}>
        <div className="page-px flex items-center justify-between mb-4">
          <span className="section-title">为你推荐</span>
          <Link href="/routes" className="section-link">更多 →</Link>
        </div>
        <div className="page-px flex flex-col gap-4">
          {popular.map((r) => <RouteCard key={r.id} route={r} />)}
        </div>
      </section>

      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  );
}
