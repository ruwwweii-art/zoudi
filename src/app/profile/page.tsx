import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import { MOCK_USER } from "@/lib/demo-data";

const MENU_ITEMS = [
  { label: "通知设置",  icon: "🔔", href: "#" },
  { label: "意见反馈",  icon: "💬", href: "#" },
  { label: "关于走地",  icon: "🗺️", href: "#" },
  { label: "隐私政策",  icon: "🔒", href: "#" },
];

const SCENE_LABELS: Record<string, string>   = { date: "约会", kids: "遛娃", citywalk: "Citywalk" };
const BUDGET_LABELS: Record<string, string>  = { low: "省钱 ¥50以下", medium: "中等 ¥50-200", high: "不限预算" };
const DURATION_LABELS: Record<string, string>= { short: "2小时内", half: "半日游", full: "全日游" };

const user  = MOCK_USER;
const prefs = user.preferences;

const STATS = [
  { value: "2",       unit: "",   label: "收藏路线" },
  { value: "6",       unit: "",   label: "已走路线" },
  { value: "12",      unit: "km", label: "徒步总距离" },
];

const PREF_ROWS = [
  { icon: "🎭", label: "场景偏好",  value: prefs?.primary_scene   ? (SCENE_LABELS[prefs.primary_scene]   ?? prefs.primary_scene)   : "未设置" },
  { icon: "💰", label: "预算偏好",  value: prefs?.budget_level    ? (BUDGET_LABELS[prefs.budget_level]   ?? prefs.budget_level)    : "未设置" },
  { icon: "⏱️", label: "出行时长",  value: prefs?.prefer_duration ? (DURATION_LABELS[prefs.prefer_duration] ?? prefs.prefer_duration) : "未设置" },
];

export default function ProfilePage() {
  return (
    <div className="mobile-container pb-nav">

      {/* ─── 顶部 ─── */}
      <div className="page-px" style={{ paddingTop: 60 }}>

        {/* 用户信息卡 */}
        <div style={{
          background: "#fff", borderRadius: 24,
          padding: "20px 20px 22px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          {/* 头像 */}
          <div style={{
            width: 60, height: 60, borderRadius: "var(--radius-full)",
            background: "linear-gradient(135deg, #4f7ef8, #7c5ce8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, boxShadow: "0 4px 14px rgba(79,126,248,0.3)",
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#fff" }}>演</span>
          </div>

          {/* 信息 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {user.nickname ?? "演示用户"}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, fontWeight: 400 }}>
              📍 {user.city ?? "杭州"}
            </p>
          </div>

          {/* 编辑按钮 */}
          <button style={{
            background: "rgba(91,156,246,0.1)", color: "#4a7fe8",
            border: "none", borderRadius: "var(--radius-full)",
            padding: "7px 14px", fontSize: 12.5, fontWeight: 560, cursor: "pointer",
            flexShrink: 0,
          }}>
            编辑
          </button>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-3 gap-3" style={{ marginTop: 12 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: 18, padding: "16px 0",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 720, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.value}
                {s.unit && <span style={{ fontSize: 13, fontWeight: 500 }}>{s.unit}</span>}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5, fontWeight: 400 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 偏好设置 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-section)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="section-title">我的偏好</span>
          <button style={{
            background: "rgba(0,0,0,0.05)", color: "var(--text-secondary)",
            border: "none", borderRadius: "var(--radius-full)",
            padding: "6px 14px", fontSize: 12, fontWeight: 480, cursor: "pointer",
          }}>
            编辑偏好
          </button>
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          {PREF_ROWS.map((row, idx) => (
            <div key={row.label} className="flex items-center justify-between" style={{
              padding: "14px 16px",
              borderBottom: idx < PREF_ROWS.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: 16 }}>{row.icon}</span>
                <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 400 }}>{row.label}</span>
              </div>
              <span style={{
                background: "rgba(91,156,246,0.1)", color: "#4a7fe8",
                fontSize: 12, fontWeight: 550, padding: "3px 10px", borderRadius: 99,
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 功能菜单 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-section)" }}>
        <div className="mb-3">
          <span className="section-title">更多</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          {MENU_ITEMS.map((item, idx) => (
            <Link key={item.label} href={item.href} className="flex items-center justify-between" style={{
              padding: "16px", textDecoration: "none",
              borderBottom: idx < MENU_ITEMS.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 460, letterSpacing: "0.005em" }}>
                  {item.label}
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 退出登录 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-section)" }}>
        <button style={{
          width: "100%", padding: "14px 24px",
          background: "#fff", color: "var(--text-secondary)",
          border: "1px solid var(--border)", borderRadius: 16,
          fontSize: 14, fontWeight: 460, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          退出登录
        </button>
      </section>

      {/* ─── 版本号 ─── */}
      <div style={{ textAlign: "center", marginTop: 28, paddingBottom: 8 }}>
        <p style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 400, letterSpacing: "0.02em" }}>
          走地 v0.1.0 · 杭州限定版
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
