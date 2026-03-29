import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import { RouteCard } from "@/components/ui/RouteCard";
import { FilterBar } from "@/components/ui/FilterBar";
import { MOCK_ROUTES, toRouteCard } from "@/lib/demo-data";

interface Props {
  searchParams: Promise<{
    scene?: string;
    duration?: string;
    budget?: string;
    weather?: string;
    sortBy?: string;
  }>;
}

export default async function RoutesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { scene, duration, budget, weather, sortBy } = params;

  let routes = [...MOCK_ROUTES];

  if (scene) routes = routes.filter((r) => r.scene === scene);
  if (duration) routes = routes.filter((r) => r.duration_type === duration);
  if (weather && weather !== "both") {
    routes = routes.filter((r) => r.weather_type === weather || r.weather_type === "both");
  }
  if (budget && budget !== "unlimited") {
    const max = parseInt(budget);
    routes = routes.filter((r) => !r.budget_per_person || r.budget_per_person <= max);
  }
  if (sortBy === "rating") routes.sort((a, b) => b.avg_rating - a.avg_rating);
  else if (sortBy === "favorites") routes.sort((a, b) => b.favorite_count - a.favorite_count);

  const cards = routes.map(toRouteCard);
  const sceneLabels: Record<string, string> = { date: "约会", kids: "遛娃", citywalk: "Citywalk" };
  const pageTitle = scene ? `${sceneLabels[scene] ?? scene}路线` : "发现路线";

  return (
    <div className="mobile-container pb-nav">
      {/* 顶部栏 */}
      <header className="page-px pt-14 pb-2 flex items-center justify-between">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 720, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>{pageTitle}</h1>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 450 }}>{cards.length} 条</span>
      </header>

      {/* 场景 Tab */}
      <div className="page-px mt-3">
        <div className="flex gap-2">
          {[
            { key: "", label: "全部" },
            { key: "date", label: "💕 约会" },
            { key: "kids", label: "👶 遛娃" },
            { key: "citywalk", label: "🚶 Citywalk" },
          ].map((tab) => {
            const active = (scene ?? "") === tab.key;
            return (
              <Link
                key={tab.key}
                href={tab.key ? `/routes?scene=${tab.key}` : "/routes"}
                className="pill"
                style={{
                  background: active ? "var(--text-primary)" : "#f0ece6",
                  color: active ? "var(--card)" : "var(--text-secondary)",
                  fontWeight: active ? 600 : 500,
                  padding: "7px 14px",
                  fontSize: 13,
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 筛选栏 */}
      <FilterBar current={{ scene, duration, budget, weather, sortBy }} />

      {/* 推荐区（无筛选时显示） */}
      {!scene && !duration && !budget && !weather && (
        <section className="mt-6">
          <div className="page-px flex items-center justify-between mb-4">
            <span className="section-title">本周精选</span>
          </div>
          <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 scrollbar-none">
            {cards.filter((r) => r.is_featured).map((r) => (
              <div key={r.id} className="flex-none" style={{ width: 272 }}>
                <RouteCard route={r} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 列表 */}
      <section className="page-px mt-6 flex flex-col gap-4">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <span style={{ fontSize: 40 }}>🗺️</span>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>换个筛选条件试试</p>
            <Link href="/routes" className="btn-secondary" style={{ fontSize: 13 }}>清除筛选</Link>
          </div>
        ) : (
          cards.map((r) => <RouteCard key={r.id} route={r} />)
        )}
      </section>

      <div style={{ height: 24 }} />
      <BottomNav />
    </div>
  );
}
