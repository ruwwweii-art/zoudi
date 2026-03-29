"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FilterState {
  scene?: string;
  duration?: string;
  budget?: string;
  weather?: string;
  sortBy?: string;
}

const FILTERS = [
  {
    key: "duration",
    label: "时长",
    options: [
      { value: "", label: "不限" },
      { value: "short", label: "2h内" },
      { value: "half", label: "半日" },
      { value: "full", label: "全日" },
    ],
  },
  {
    key: "budget",
    label: "预算（人均）",
    options: [
      { value: "", label: "不限" },
      { value: "50", label: "¥50内" },
      { value: "100", label: "¥100内" },
      { value: "200", label: "¥200内" },
    ],
  },
  {
    key: "weather",
    label: "天气",
    options: [
      { value: "", label: "不限" },
      { value: "sunny", label: "☀️ 晴天" },
      { value: "rainy", label: "🌧 雨天" },
    ],
  },
  {
    key: "sortBy",
    label: "排序",
    options: [
      { value: "", label: "最新" },
      { value: "rating", label: "⭐ 评分最高" },
      { value: "favorites", label: "❤️ 收藏最多" },
    ],
  },
];

export function FilterBar({ current }: { current: FilterState }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<FilterState>(current);

  const activeCount = Object.entries(current).filter(([k, v]) => v && v !== "" && k !== "scene").length;

  function apply(key: string, value: string) {
    const next = { ...local, [key]: value };
    setLocal(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/routes?${params.toString()}`);
  }

  function clearAll() {
    const next: FilterState = current.scene ? { scene: current.scene } : {};
    setLocal(next);
    router.push(next.scene ? `/routes?scene=${next.scene}` : "/routes");
    setOpen(false);
  }

  return (
    <>
      {/* 触发按钮 + pills */}
      <div className="page-px mt-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setOpen(true)}
          className="pill flex-none"
          style={{
            background: activeCount > 0 ? "var(--text-primary)" : "#f0ece6",
            color: activeCount > 0 ? "var(--card)" : "var(--text-secondary)",
            fontWeight: 600,
            padding: "6px 12px",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          筛选
          {activeCount > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: 8, background: "var(--accent)", color: "var(--text-primary)", fontSize: 10, fontWeight: 700 }}>
              {activeCount}
            </span>
          )}
        </button>
        {current.duration && <Pill label={{ short: "2h内", half: "半日", full: "全日" }[current.duration] ?? current.duration} onRemove={() => apply("duration", "")} />}
        {current.budget && <Pill label={`¥${current.budget}内`} onRemove={() => apply("budget", "")} />}
        {current.weather && <Pill label={current.weather === "sunny" ? "☀️ 晴天" : "🌧 雨天"} onRemove={() => apply("weather", "")} />}
      </div>

      {/* 底部弹出面板 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-[430px] mx-auto p-5 pb-8"
            style={{ background: "var(--card)", borderRadius: "var(--radius-xl) var(--radius-xl) 0 0" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--border)" }} />
            <div className="flex items-center justify-between mb-5">
              <span className="section-title">筛选</span>
              <button onClick={clearAll} style={{ fontSize: 13, color: "var(--text-muted)" }}>清除全部</button>
            </div>

            {FILTERS.map((f) => (
              <div key={f.key} className="mb-5">
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>{f.label}</p>
                <div className="flex flex-wrap gap-2">
                  {f.options.map((opt) => {
                    const active = (local[f.key as keyof FilterState] ?? "") === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => apply(f.key, opt.value)}
                        className="pill"
                        style={{
                          background: active ? "var(--text-primary)" : "#f0ece6",
                          color: active ? "var(--card)" : "var(--text-secondary)",
                          padding: "7px 14px",
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button onClick={() => setOpen(false)} className="btn-primary w-full mt-2">
              查看路线
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Pill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="pill pill-muted flex-none" style={{ padding: "5px 10px" }}>
      {label}
      <button
        onClick={onRemove}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: 7, background: "var(--text-muted)", color: "white", fontSize: 10, marginLeft: 2 }}
      >
        ×
      </button>
    </span>
  );
}
