import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import { RouteCard } from "@/components/ui/RouteCard";
import { MOCK_ROUTES, toRouteCard } from "@/lib/demo-data";
import type { RouteCard as RouteCardType } from "@/types";

// Demo: first 2 routes shown as already favorited
const DEMO_FAVORITES: RouteCardType[] = MOCK_ROUTES.slice(0, 2).map((r) =>
  toRouteCard({ ...r, is_favorited: true })
);

export default function FavoritesPage() {
  const favorites = DEMO_FAVORITES;
  const isEmpty = favorites.length === 0;

  return (
    <div className="mobile-container pb-nav">

      {/* ─── 顶部标题栏 ─── */}
      <header className="page-px pt-14 pb-4">
        <div className="flex items-center gap-3">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 720,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            我的收藏
          </h1>
          {!isEmpty && (
            <span
              className="pill"
              style={{
                background: "var(--text-primary)",
                color: "var(--card)",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 9px",
              }}
            >
              {favorites.length}
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: 12.5,
            color: "var(--text-muted)",
            marginTop: 4,
            fontWeight: 400,
            letterSpacing: "0.005em",
          }}
        >
          收藏你喜欢的路线，随时再看
        </p>
      </header>

      {/* ─── Demo 提示条 ─── */}
      <div className="page-px mb-1">
        <div
          className="flex items-center gap-2.5"
          style={{
            background: "var(--accent-light)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            border: "1px solid #e8d9b8",
          }}
        >
          <span style={{ fontSize: 14 }}>💡</span>
          <p
            style={{
              fontSize: 12,
              color: "#8b6914",
              fontWeight: 450,
              letterSpacing: "0.005em",
              lineHeight: 1.5,
            }}
          >
            演示模式下默认展示已收藏路线
          </p>
        </div>
      </div>

      {/* ─── 内容区 ─── */}
      {isEmpty ? (
        /* 空状态 */
        <div
          className="flex flex-col items-center justify-center page-px"
          style={{ paddingTop: 80, paddingBottom: 40 }}
        >
          <span style={{ fontSize: 64, lineHeight: 1 }}>🗺️</span>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 620,
              color: "var(--text-primary)",
              marginTop: 20,
              letterSpacing: "-0.01em",
            }}
          >
            还没有收藏的路线
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginTop: 8,
              fontWeight: 400,
              letterSpacing: "0.005em",
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 220,
            }}
          >
            去发现页浏览路线，点击右上角心形收藏
          </p>
          <Link
            href="/discover"
            className="btn-primary"
            style={{
              marginTop: 28,
              borderRadius: "var(--radius-full)",
              padding: "12px 28px",
              fontSize: 14,
            }}
          >
            去发现路线
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <path d="M5 12h14M13 5l6 7-6 7" />
            </svg>
          </Link>
        </div>
      ) : (
        /* 收藏列表 */
        <section style={{ marginTop: "var(--space-module)" }}>
          <div className="page-px flex items-center justify-between mb-4">
            <span className="section-title">已收藏路线</span>
            <span
              style={{
                fontSize: 12.5,
                color: "var(--text-muted)",
                fontWeight: 400,
              }}
            >
              共 {favorites.length} 条
            </span>
          </div>
          <div className="page-px flex flex-col gap-4">
            {favorites.map((r) => (
              <RouteCard key={r.id} route={r} />
            ))}
          </div>

          {/* 引导发现更多 */}
          <div
            className="page-px"
            style={{ marginTop: "var(--space-section)" }}
          >
            <Link
              href="/discover"
              className="flex items-center justify-center gap-2"
              style={{
                background: "var(--card)",
                border: "1px dashed var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "18px 24px",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 18 }}>✦</span>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontWeight: 480,
                  letterSpacing: "0.01em",
                }}
              >
                去发现更多路线
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M5 12h14M13 5l6 7-6 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  );
}
