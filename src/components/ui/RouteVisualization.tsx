"use client";

import { useEffect, useRef, useState } from "react";
import type { RouteStepDetail } from "@/types";

const TRANSPORT_ICON: Record<string, string> = {
  walk: "🚶", bus: "🚌", drive: "🚗", subway: "🚇",
};
const TRANSPORT_LABEL: Record<string, string> = {
  walk: "步行", bus: "公交", drive: "驾车", subway: "地铁",
};

interface Props {
  steps: RouteStepDetail[];
  suggestedStartTime: string | null;
}

export function RouteVisualization({ steps, suggestedStartTime }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (steps.length === 0) return null;

  return (
    <section ref={containerRef}>
      <h2 className="section-title mb-4">路线总览</h2>

      <div
        className="route-vis"
        style={{
          background: "linear-gradient(135deg, rgba(245,237,216,0.55), rgba(255,253,248,0.85))",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 20px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle decorative grain */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at 20% 30%, var(--accent) 1px, transparent 1px), radial-gradient(circle at 80% 70%, var(--accent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* start time hint */}
        {suggestedStartTime && (
          <div
            className={`rv-fade ${visible ? "rv-in" : ""}`}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              marginBottom: 20, animationDelay: "0.1s",
            }}
          >
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
              🕐 建议 {suggestedStartTime} 出发
            </span>
          </div>
        )}

        {/* route nodes */}
        <div style={{ position: "relative" }}>
          {steps.map((step, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === steps.length - 1;
            const delay = 0.15 + idx * 0.1;

            return (
              <div key={step.id}>
                {/* node row */}
                <div
                  className={`rv-fade ${visible ? "rv-in" : ""}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    animationDelay: `${delay}s`,
                  }}
                >
                  {/* node dot */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isFirst || isLast ? "var(--text-primary)" : "var(--card)",
                    border: isFirst || isLast ? "none" : "2px solid var(--accent)",
                    boxShadow: isFirst || isLast
                      ? "0 2px 8px rgba(26,23,20,0.15)"
                      : "0 1px 4px rgba(200,169,126,0.2)",
                  }}>
                    {isFirst ? (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.04em" }}>起</span>
                    ) : isLast ? (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.04em" }}>终</span>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>{idx}</span>
                    )}
                  </div>

                  {/* text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 600, color: "var(--text-primary)",
                      lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {step.poi_name}
                    </p>
                    {step.stay_duration && (
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                        停留 {step.stay_duration} 分钟
                      </p>
                    )}
                  </div>
                </div>

                {/* connector */}
                {!isLast && (
                  <div
                    className={`rv-fade ${visible ? "rv-in" : ""}`}
                    style={{
                      display: "flex", alignItems: "stretch", gap: 12,
                      animationDelay: `${delay + 0.05}s`,
                    }}
                  >
                    {/* vertical line */}
                    <div style={{ width: 32, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                      <div
                        className={visible ? "rv-line-draw" : ""}
                        style={{
                          width: 1.5,
                          height: 40,
                          background: "var(--accent)",
                          opacity: 0.35,
                          transformOrigin: "top",
                          animationDelay: `${delay + 0.05}s`,
                        }}
                      />
                    </div>

                    {/* transport info */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 0",
                    }}>
                      {step.transport_to_next && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 3,
                          fontSize: 11, color: "var(--text-muted)", fontWeight: 500,
                          background: "rgba(200,169,126,0.1)", borderRadius: 8,
                          padding: "3px 8px",
                        }}>
                          {TRANSPORT_ICON[step.transport_to_next]}
                          {TRANSPORT_LABEL[step.transport_to_next]}
                        </span>
                      )}
                      {step.time_to_next != null && (
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {step.time_to_next}min
                        </span>
                      )}
                      {step.distance_to_next != null && (
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {step.distance_to_next >= 1000
                            ? `${(step.distance_to_next / 1000).toFixed(1)}km`
                            : `${step.distance_to_next}m`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* summary footer */}
        <div
          className={`rv-fade ${visible ? "rv-in" : ""}`}
          style={{
            marginTop: 16, paddingTop: 14,
            borderTop: "1px solid rgba(200,169,126,0.2)",
            display: "flex", justifyContent: "center", gap: 20,
            animationDelay: `${0.15 + steps.length * 0.1 + 0.1}s`,
          }}
        >
          <Stat label="站点" value={`${steps.length} 站`} />
          {(() => {
            const total = steps.reduce((s, st) => s + (st.time_to_next ?? 0), 0);
            return total > 0 ? <Stat label="路程" value={`约${total}min`} /> : null;
          })()}
          {(() => {
            const dist = steps.reduce((s, st) => s + (st.distance_to_next ?? 0), 0);
            return dist > 0 ? <Stat label="总距离" value={dist >= 1000 ? `${(dist / 1000).toFixed(1)}km` : `${dist}m`} /> : null;
          })()}
        </div>
      </div>

      {/* animation styles */}
      <style>{`
        .rv-fade {
          opacity: 0;
          transform: translateY(10px);
        }
        .rv-fade.rv-in {
          animation: rvFadeUp 0.5s ease-out forwards;
        }
        @keyframes rvFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .rv-line-draw {
          animation: rvLineDraw 0.6s ease-out forwards;
          transform: scaleY(0);
        }
        @keyframes rvLineDraw {
          to { transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}
