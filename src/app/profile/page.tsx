import Link from "next/link";
import { MOCK_USER } from "@/lib/demo-data";

const MENU_ITEMS = [
  { label: "通知设置", icon: "🔔", href: "#" },
  { label: "意见反馈", icon: "💬", href: "#" },
  { label: "关于走地", icon: "🗺️", href: "#" },
  { label: "隐私政策", icon: "🔒", href: "#" },
];

const SCENE_LABELS: Record<string, string> = {
  date: "约会",
  kids: "遛娃",
  citywalk: "Citywalk",
};

const BUDGET_LABELS: Record<string, string> = {
  low: "省钱 ¥50以下",
  medium: "中等 ¥50-200",
  high: "不限预算",
};

const DURATION_LABELS: Record<string, string> = {
  short: "2小时内",
  half: "半日游",
  full: "全日游",
};

const user = MOCK_USER;
const prefs = user.preferences;

export default function ProfilePage() {
  return (
    <div className="mobile-container" style={{ paddingBottom: 112 }}>

      {/* ─── 头部渐变背景 ─── */}
      <div
        style={{
          background: "linear-gradient(160deg, var(--accent-light) 0%, #ede5d0 100%)",
          minHeight: 180,
          position: "relative",
          paddingTop: 60,
          paddingBottom: 28,
        }}
      >
        <div className="page-px flex items-end gap-4">
          {/* 头像 */}
          <div
            className="flex-none flex items-center justify-center"
            style={{
              width: 68,
              height: 68,
              borderRadius: "var(--radius-full)",
              background: "var(--text-primary)",
              boxShadow: "var(--shadow-float)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--card)",
                letterSpacing: "-0.02em",
              }}
            >
              演
            </span>
          </div>

          {/* 用户信息 */}
          <div style={{ paddingBottom: 4 }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {user.nickname ?? "演示用户"}
            </p>
            <p
              style={{
                fontSize: 12.5,
                color: "var(--text-secondary)",
                marginTop: 5,
                fontWeight: 400,
                letterSpacing: "0.005em",
              }}
            >
              📍 {user.city ?? "杭州"}
            </p>
          </div>
        </div>
      </div>

      {/* ─── 数据统计 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-module)" }}>
        <div
          className="grid grid-cols-3 gap-3"
        >
          {/* 收藏路线 */}
          <div
            className="info-block flex flex-col items-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 720,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              2
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 5,
                fontWeight: 400,
                letterSpacing: "0.01em",
                textAlign: "center",
              }}
            >
              收藏路线
            </span>
          </div>

          {/* 已走路线 */}
          <div
            className="info-block flex flex-col items-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 720,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              6
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 5,
                fontWeight: 400,
                letterSpacing: "0.01em",
                textAlign: "center",
              }}
            >
              已走路线
            </span>
          </div>

          {/* 徒步距离 */}
          <div
            className="info-block flex flex-col items-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 720,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              12<span style={{ fontSize: 14, fontWeight: 500 }}>km</span>
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 5,
                fontWeight: 400,
                letterSpacing: "0.01em",
                textAlign: "center",
              }}
            >
              徒步总距离
            </span>
          </div>
        </div>
      </section>

      {/* ─── 偏好设置 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-section)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="section-title">我的偏好</span>
          <button
            className="btn-secondary"
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 480,
              borderRadius: "var(--radius-full)",
            }}
          >
            编辑偏好
          </button>
        </div>

        <div
          className="card-flat"
          style={{ padding: "4px 0" }}
        >
          {/* 场景偏好 */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span style={{ fontSize: 16 }}>🎭</span>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontWeight: 400,
                }}
              >
                场景偏好
              </span>
            </div>
            <span
              className="pill pill-accent"
              style={{ fontSize: 12, fontWeight: 550 }}
            >
              {prefs?.primary_scene
                ? SCENE_LABELS[prefs.primary_scene] ?? prefs.primary_scene
                : "未设置"}
            </span>
          </div>

          {/* 预算偏好 */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span style={{ fontSize: 16 }}>💰</span>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontWeight: 400,
                }}
              >
                预算偏好
              </span>
            </div>
            <span
              style={{
                fontSize: 13,
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              {prefs?.budget_level
                ? BUDGET_LABELS[prefs.budget_level] ?? prefs.budget_level
                : "未设置"}
            </span>
          </div>

          {/* 出行时长 */}
          <div
            className="flex items-center justify-between"
            style={{ padding: "14px 16px" }}
          >
            <div className="flex items-center gap-2.5">
              <span style={{ fontSize: 16 }}>⏱️</span>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontWeight: 400,
                }}
              >
                出行时长
              </span>
            </div>
            <span
              style={{
                fontSize: 13,
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              {prefs?.prefer_duration
                ? DURATION_LABELS[prefs.prefer_duration] ?? prefs.prefer_duration
                : "未设置"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 功能菜单 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-section)" }}>
        <div className="mb-3">
          <span className="section-title">更多</span>
        </div>

        <div className="flex flex-col gap-2">
          {MENU_ITEMS.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="card-flat flex items-center justify-between"
              style={{
                padding: "16px",
                textDecoration: "none",
                borderRadius:
                  index === 0
                    ? "var(--radius-md) var(--radius-md) 6px 6px"
                    : index === MENU_ITEMS.length - 1
                    ? "6px 6px var(--radius-md) var(--radius-md)"
                    : "6px",
              }}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--text-primary)",
                    fontWeight: 460,
                    letterSpacing: "0.005em",
                  }}
                >
                  {item.label}
                </span>
              </div>
              {/* 右箭头 */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 退出登录 ─── */}
      <section className="page-px" style={{ marginTop: "var(--space-section)" }}>
        <button
          className="btn-secondary"
          style={{
            width: "100%",
            padding: "14px 24px",
            fontSize: 14,
            fontWeight: 460,
            color: "var(--text-secondary)",
            borderRadius: "var(--radius-md)",
          }}
        >
          退出登录
        </button>
      </section>

      {/* ─── App 版本 ─── */}
      <div
        style={{
          textAlign: "center",
          marginTop: 28,
          paddingBottom: 8,
        }}
      >
        <p
          style={{
            fontSize: 11.5,
            color: "var(--text-muted)",
            fontWeight: 400,
            letterSpacing: "0.02em",
          }}
        >
          走地 v0.1.0 · 杭州限定版
        </p>
      </div>
    </div>
  );
}
