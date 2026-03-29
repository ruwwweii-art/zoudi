import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import { RouteCard } from "@/components/ui/RouteCard";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { MOCK_ROUTES, toRouteCard } from "@/lib/demo-data";

const SCENES = [
  { key: "date",     label: "约会",      emoji: "💕", desc: "情侣 · 纪念日"    },
  { key: "kids",     label: "遛娃",      emoji: "👶", desc: "0-8岁 · 推车友好" },
  { key: "citywalk", label: "Citywalk", emoji: "🚶", desc: "市井 · 随便逛逛"  },
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
        <Link href="/routes" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </Link>
      </header>

      {/* ─── Hero 轮播 ─── */}
      <HeroCarousel />

      {/* ─── 场景入口 ─── */}
      <section style={{ marginTop: "var(--space-section)" }}>
        <div className="page-px flex items-center justify-between mb-4">
          <span className="section-title">选场景</span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
          {SCENES.map((s) => (
            <Link key={s.key} href={`/routes?scene=${s.key}`} className="flex-none p-4" style={{
              minWidth: 125, borderRadius: 22,
              background: "#fff",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
            }}>
              <span style={{ fontSize: 26 }}>{s.emoji}</span>
              <p className="mt-3" style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 660, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{s.label}</p>
              <p style={{ fontSize: 11, marginTop: 3, color: "var(--text-muted)", fontWeight: 400, letterSpacing: "0.01em" }}>{s.desc}</p>
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
        <Link href="/admin/ai-generate" className="flex items-center gap-4 p-5" style={{
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(135deg, #4f7ef8 0%, #7c5ce8 100%)",
          boxShadow: "0 8px 28px rgba(79,126,248,0.28)"
        }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-none" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
            <span style={{ fontSize: 22 }}>✨</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 14, fontWeight: 620, color: "#fff", letterSpacing: "0.01em" }}>AI 生成路线</p>
            <p style={{ fontSize: 12, marginTop: 3, color: "rgba(255,255,255,0.68)", fontWeight: 400 }}>输入场景和地点，自动规划完整路线</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14M13 5l6 7-6 7"/></svg>
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
