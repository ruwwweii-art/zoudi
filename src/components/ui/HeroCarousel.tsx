'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Card =
  | { type: 'intro' }
  | { type: 'route'; title: string; subtitle: string; image: string; tag: string; href: string }

const CARDS: Card[] = [
  { type: 'intro' },
  {
    type: 'route',
    title: '云栖竹径半日游',
    subtitle: '竹海 · 免票 · 3站',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=85',
    tag: '自然',
    href: '/routes/route-001',
  },
  {
    type: 'route',
    title: '西溪湿地漫游',
    subtitle: '芦苇 · 亲水 · 4站',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=85',
    tag: '亲水',
    href: '/routes/route-003',
  },
]

function pos(i: number, active: number, total: number): 'center' | 'left' | 'right' | 'hidden' {
  const offset = ((i - active) % total + total) % total
  if (offset === 0) return 'center'
  if (offset === 1) return 'right'
  if (offset === total - 1) return 'left'
  return 'hidden'
}

const STYLE: Record<string, React.CSSProperties> = {
  center: {
    transform: 'translateX(0) rotate(0deg) scale(1)',
    zIndex: 10, opacity: 1, filter: 'none',
    boxShadow: '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.06)',
  },
  left: {
    transform: 'translateX(-82%) rotate(-12deg) scale(0.76)',
    zIndex: 5, opacity: 0.82, filter: 'brightness(0.5)',
    boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
  },
  right: {
    transform: 'translateX(82%) rotate(12deg) scale(0.76)',
    zIndex: 5, opacity: 0.82, filter: 'brightness(0.5)',
    boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
  },
  hidden: {
    transform: 'translateX(0) rotate(0deg) scale(0.6)',
    zIndex: 0, opacity: 0, filter: 'none',
    boxShadow: 'none', pointerEvents: 'none',
  },
}

export function HeroCarousel() {
  const [active, setActive] = useState(0)
  const touchX = useRef(0)
  const total = CARDS.length

  const goNext = () => setActive(i => (i + 1) % total)
  const goPrev = () => setActive(i => (i - 1 + total) % total)

  return (
    <section
      style={{ position: 'relative', height: 372, marginTop: 8 }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchX.current
        if (dx < -44) goNext()
        if (dx > 44) goPrev()
      }}
    >
      {CARDS.map((card, i) => {
        const p = pos(i, active, total)
        const isCenter = p === 'center'

        return (
          <div
            key={i}
            onClick={() => { if (!isCenter) setActive(i) }}
            style={{
              position: 'absolute',
              left: '50%', marginLeft: -132,
              top: 6, width: 264, height: 340,
              borderRadius: 30, overflow: 'hidden',
              transition: 'transform 0.52s cubic-bezier(0.34,1.28,0.64,1), opacity 0.38s ease, filter 0.38s ease, box-shadow 0.4s ease',
              cursor: isCenter ? 'default' : 'pointer',
              WebkitTapHighlightColor: 'transparent',
              ...STYLE[p],
            }}
          >
            {card.type === 'intro' ? (
              /* ── 白色介绍卡 ── */
              <div style={{
                width: '100%', height: '100%', background: '#fff',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '36px 26px', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* 侧位时加深色遮罩，让白卡和路线卡视觉一致 */}
                {!isCenter && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,30,0.45)', zIndex: 20, pointerEvents: 'none', borderRadius: 30 }} />
                )}
                {/* Aurora */}
                <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(90,160,255,0.26) 0%, transparent 68%)', filter: 'blur(40px)', left: '50%', bottom: -60, transform: 'translateX(-50%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(80,210,150,0.16) 0%, transparent 70%)', filter: 'blur(30px)', left: -10, bottom: 30, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,120,255,0.14) 0%, transparent 70%)', filter: 'blur(24px)', right: 0, top: 40, pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontSize: 11.5, color: '#7baeff', fontWeight: 580, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
                    HANGZHOU · 杭州
                  </p>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 720, lineHeight: 1.3, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                    <span style={{ color: '#5b9cf6' }}>周末出行</span>，就让<br />我来帮你搞定
                  </h1>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.65, fontWeight: 400 }}>
                    选场景，挑路线，直接出发
                  </p>
                  <Link href="/routes" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 22,
                    background: 'var(--text-primary)', color: '#fff',
                    borderRadius: 999, padding: '11px 24px',
                    fontSize: 13.5, fontWeight: 580, textDecoration: 'none', letterSpacing: '0.01em',
                  }}>
                    立即找路线
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 12h14M13 5l6 7-6 7"/></svg>
                  </Link>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 20, letterSpacing: '0.01em' }}>
                    ← 左右滑动查看路线 →
                  </p>
                </div>
              </div>
            ) : (
              /* ── 路线照片卡 ── */
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <Image
                  src={card.image} alt={card.title}
                  fill className="object-cover" sizes="264px"
                  priority={i <= 1}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 22px 28px' }}>
                  <span style={{
                    display: 'inline-block', marginBottom: 10,
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 450,
                  }}>{card.tag}</span>
                  <p style={{ color: '#fff', fontSize: 19, fontWeight: 720, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                    {card.title}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 12, marginTop: 6 }}>{card.subtitle}</p>
                  {isCenter && (
                    <Link href={card.href} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 16,
                      background: '#fff', color: '#111',
                      borderRadius: 999, padding: '9px 20px',
                      fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    }}>
                      查看路线
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 12h14M13 5l6 7-6 7"/></svg>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* ── 指示点 ── */}
      <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, alignItems: 'center' }}>
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 20 : 6, height: 6,
              borderRadius: 99, border: 'none', padding: 0, cursor: 'pointer',
              background: i === active ? 'var(--text-primary)' : 'rgba(0,0,0,0.18)',
              transition: 'width 0.32s cubic-bezier(0.34,1.2,0.64,1), background 0.25s ease',
            }}
          />
        ))}
      </div>
    </section>
  )
}
