"use client";
import Link from "next/link";
import Image from "next/image";
import type { RouteCard as RouteCardType } from "@/types";

const SCENE: Record<string, { bg: string; text: string; label: string }> = {
  date:     { bg: "var(--scene-date-bg)", text: "var(--scene-date)", label: "约会" },
  kids:     { bg: "var(--scene-kids-bg)", text: "var(--scene-kids)", label: "遛娃" },
  citywalk: { bg: "var(--scene-walk-bg)", text: "var(--scene-walk)", label: "Citywalk" },
};

const DUR: Record<string, string> = { short: "2h内", half: "半日", full: "全日" };

export function RouteCard({ route }: { route: RouteCardType }) {
  const s = SCENE[route.scene] ?? SCENE.date;

  return (
    <Link href={`/routes/${route.id}`} className="block card overflow-hidden">
      {/* 封面图 */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {route.cover_image_url ? (
          <Image src={route.cover_image_url} alt={route.title} fill className="object-cover" sizes="(max-width:430px)100vw,430px" />
        ) : (
          <div className="w-full h-full" style={{ background: s.bg }} />
        )}

        {/* 左下标签 */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="pill" style={{ background: s.bg, color: s.text, fontWeight: 600 }}>{s.label}</span>
          <span className="pill" style={{ background: "rgba(255,255,255,0.88)", color: "var(--text-secondary)" }}>{DUR[route.duration_type] ?? route.duration_type}</span>
        </div>

        {/* 右上收藏 */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.88)" }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={route.is_favorited ? "#e11d48" : "none"} stroke={route.is_favorited ? "#e11d48" : "#6b6560"} strokeWidth={2}>
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>

      {/* 内容区 */}
      <div className="p-4 pt-3.5">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 620, lineHeight: 1.4, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{route.title}</h3>
        {route.subtitle && (
          <p className="mt-1.5 line-clamp-1" style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-muted)", fontWeight: 400, letterSpacing: "0.005em" }}>{route.subtitle}</p>
        )}

        {/* 信息行 */}
        <div className="mt-3.5 flex items-center gap-3" style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 450 }}>
          {route.budget_per_person != null && <span>¥{route.budget_per_person}/人</span>}
          <span>{Math.floor(route.duration_minutes / 60)}h{route.duration_minutes % 60 > 0 ? `${route.duration_minutes % 60}m` : ""}</span>
          <span>{route.stop_count}站</span>
          <span className="ml-auto flex items-center gap-1" style={{ fontWeight: 550 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {route.avg_rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
