import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import { RouteCard } from "@/components/ui/RouteCard";
import { MOCK_ROUTES, MOCK_TAGS, MOCK_HOTWORDS, toRouteCard } from "@/lib/demo-data";

const SCENES = [
  { key: "date",     label: "约会",      emoji: "💕", desc: "为两个人的时光规划", glow: "rgba(255,80,120,0.22)" },
  { key: "kids",     label: "遛娃",      emoji: "👶", desc: "推车友好 · 0-8岁适龄",  glow: "rgba(40,200,90,0.20)" },
  { key: "citywalk", label: "Citywalk", emoji: "🚶", desc: "市井气息 · 随便逛逛",  glow: "rgba(255,155,40,0.22)" },
];

const featured = MOCK_ROUTES.filter((r) => r.is_featured).slice(0, 2).map(toRouteCard);

export default function DiscoverPage() {
  return (
    <div className="mobile-container pb-nav">

      {/* ─── 顶部标题栏 ─── */}
      <header className="page-px flex items-center justify-between pt-14 pb-3">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 720, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.2 }}>
            发现好路线
          </h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, fontWeight: 400 }}>
            编辑精选 · 每周更新
          </p>
        </div>
        <span className="pill pill-muted" style={{ fontSize: 12, fontWeight: 500 }}>
          📍 杭州
        </span>
      </header>

      {/* ─── 搜索入口 ─── */}
      <section className="page-px mt-3">
        <Link href="/routes" className="flex items-center gap-3 w-full" style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: "var(--radius-full)", padding: "12px 18px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)", textDecoration: "none",
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2} strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 400, flex: 1 }}>
            搜索路线、地点、场景…
          </span>
          <span style={{ fontSize: 12, color: "#5b9cf6", fontWeight: 580 }}>搜索</span>
        </Link>
      </section>

      {/* ─── 热门搜索 ─── */}
      <section style={{ marginTop: "var(--space-module)" }}>
        <div className="page-px mb-3">
          <span className="section-title" style={{ fontSize: 14 }}>热门搜索</span>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
          {MOCK_HOTWORDS.map((word) => (
            <Link key={word} href={`/routes?q=${encodeURIComponent(word)}`} className="flex-none pill" style={{
              background: "rgba(91,156,246,0.1)", color: "#4a7fe8",
              fontWeight: 500, fontSize: 12.5, padding: "6px 14px",
              textDecoration: "none", borderRadius: "var(--radius-full)",
            }}>
              {word}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 场景卡片 ─── */}
      <section style={{ marginTop: "var(--space-section)" }}>
        <div className="page-px flex items-center justify-between mb-4">
          <span className="section-title">按场景找路线</span>
        </div>
        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 scrollbar-none">
          {SCENES.map((s) => (
            <Link key={s.key} href={`/routes?scene=${s.key}`} className="flex-none flex flex-col justify-between" style={{
              minWidth: 148, minHeight: 148, position: "relative", overflow: "hidden",
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)", padding: "20px 18px 18px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)", textDecoration: "none",
            }}>
              {/* Aurora 光晕 */}
              <div style={{ position: "absolute", width: 110, height: 110, borderRadius: "50%", background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`, filter: "blur(22px)", top: -18, right: -18, pointerEvents: "none" }} />
              <span style={{ position: "relative", fontSize: 40, lineHeight: 1 }}>{s.emoji}</span>
              <div style={{ marginTop: 14, position: "relative" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: 11, marginTop: 4, color: "var(--text-muted)", fontWeight: 400, lineHeight: 1.4 }}>
                  {s.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 热门标签 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-section)" }}>
        <div className="flex items-center justify-between mb-4">
          <span className="section-title">按标签找</span>
          <Link href="/routes" className="section-link">全部路线 →</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOCK_TAGS.map((tag) => (
            <Link key={tag.id} href={`/routes?tags=${encodeURIComponent(tag.name)}`} className="pill" style={{
              background: "#fff", border: "1px solid var(--border)",
              color: "var(--text-secondary)", fontWeight: 480, fontSize: 13,
              padding: "7px 14px", textDecoration: "none",
              borderRadius: "var(--radius-full)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", gap: 5,
            }}>
              {tag.icon && <span style={{ fontSize: 13 }}>{tag.icon}</span>}
              {tag.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 编辑精选 ─── */}
      <section style={{ marginTop: "var(--space-section)" }}>
        <div className="page-px flex items-center justify-between mb-4">
          <div>
            <span className="section-title">本期精选</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8, fontWeight: 400 }}>编辑手工挑选</span>
          </div>
          <Link href="/routes" className="section-link">更多 →</Link>
        </div>

        {/* 精选标注条 */}
        <div className="page-px mb-3">
          <div style={{
            background: "linear-gradient(90deg, rgba(91,156,246,0.1), transparent)",
            borderLeft: "3px solid #5b9cf6",
            borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
            padding: "10px 14px",
          }}>
            <p style={{ fontSize: 12, color: "#4a7fe8", fontWeight: 500, letterSpacing: "0.01em" }}>
              ✦ 本周主题：春日出行，走出这座城市的温柔一面
            </p>
          </div>
        </div>

        <div className="page-px flex flex-col gap-4">
          {featured.map((r) => <RouteCard key={r.id} route={r} />)}
        </div>
      </section>

      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  );
}
