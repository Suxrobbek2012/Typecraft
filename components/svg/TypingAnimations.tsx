'use client'

import { useEffect, useRef } from 'react'

// ============================================================
// TYPING ANIMATIONS — Ultra-only ambient background
// ============================================================
import type { UltraTheme } from '@/components/typing/UltraEffects'

interface TypingAnimationsProps {
  wpm: number
  isTyping: boolean
  isUltra?: boolean
  ultraTheme?: UltraTheme
  combo?: number
}

export function TypingAnimations({ wpm, isTyping, isUltra, ultraTheme = 'default', combo = 0 }: TypingAnimationsProps) {
  if (!isTyping || !isUltra) return null

  const speed     = wpm > 100 ? 'fast' : wpm > 60 ? 'medium' : 'slow'
  const dur       = speed === 'fast' ? '0.28s' : speed === 'medium' ? '0.45s' : '0.9s'
  const intensity = Math.min(wpm / 180, 1)

  // Dynamic hue: theme overrides + speed
  const themeHue: Record<UltraTheme, number> = { default: 45, neon: 280, aurora: 160, matrix: 130 }
  const baseHue = isUltra ? themeHue[ultraTheme] : 45
  const hue   = Math.round(baseHue - intensity * (isUltra ? 12 : 24))
  const glow  = (isUltra ? 0.05 : 0.03) + intensity * (isUltra ? 0.14 : 0.1)
  const particleCount = isUltra ? 24 : 12
  const comboBoost = Math.min(combo / 120, 1)

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      {/* WPM-driven gradient glow */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 55%,
            hsla(${hue}, 90%, 55%, ${glow}) 0%,
            transparent 70%)`,
        }}
      />

      <svg viewBox="0 0 1200 600" className="w-full h-full absolute inset-0" fill="none">
        {/* Ambient particles */}
        {[...Array(particleCount)].map((_, i) => (
          <circle key={i} cx={60 + i * 118} cy={120 + (i % 4) * 90} r={1.5 + (i % 3)}>
            <animate attributeName="fill" values={`hsla(${hue},80%,60%,0);hsla(${hue},90%,65%,0.5);hsla(${hue},80%,60%,0)`} dur={`${1.2 + i * 0.28}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${120+(i%4)*90};${80+(i%4)*90};${120+(i%4)*90}`} dur={`${1.4+i*0.25}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Speed lines — appear when fast */}
        {speed === 'fast' && [...Array(6)].map((_, i) => (
          <line key={i} x1={-120} y1={60 + i * 90} x2={-10} y2={60 + i * 90} stroke={`hsla(${hue},90%,60%,0.35)`} strokeWidth="1.5">
            <animateTransform attributeName="transform" type="translate" values="0,0;1350,0" dur={dur} begin={`${i * 0.05}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* Ripple rings (ultra) */}
        {isUltra && wpm > 20 && [...Array(4)].map((_, i) => (
          <ellipse key={`ripple-${i}`} cx="600" cy="290" rx="30" ry="18" stroke={`hsla(${hue},95%,70%,${0.8 - i * 0.14})`} strokeWidth="1.25" fill="none">
            <animate attributeName="rx"      values="30;380;30"    dur="3.2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
            <animate attributeName="ry"      values="18;220;18"    dur="3.2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0;0.25" dur="3.2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
          </ellipse>
        ))}

        {/* Ultra focused glow bursts */}
        {isUltra && combo >= 10 && [...Array(3)].map((_, i) => (
          <circle key={`combo-ring-${i}`} cx="600" cy="300" r={40 + i * 40} fill="none" stroke={`hsla(${hue},95%,75%,${0.35 - i * 0.1})`} strokeWidth="2">
            <animate attributeName="r" values={`${40 + i * 40};${80 + i * 40};${40 + i * 40}`} dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Theme-specific ultra effects */}
        {isUltra && ultraTheme === 'neon' && [...Array(5)].map((_, i) => (
          <rect
            key={`neon-${i}`}
            x={80 + i * 220}
            y={80}
            width="8"
            height="160"
            fill={`hsla(${hue},100%,70%,0.16)`}
            rx="4"
          >
            <animate attributeName="y" values="80;40;80" dur={`${2.4 + i * 0.12}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.08;0.22;0.08" dur={`${2.4 + i * 0.12}s`} repeatCount="indefinite" />
          </rect>
        ))}
        {isUltra && ultraTheme === 'aurora' && [...Array(4)].map((_, i) => (
          <ellipse
            key={`aurora-${i}`}
            cx={220 + i * 200}
            cy={260}
            rx="180"
            ry="60"
            fill={`hsla(${hue + 20},90%,70%,0.08)`}
          >
            <animate attributeName="cx" values={`${220 + i * 200};${200 + i * 200};${220 + i * 200}`} dur={`${5 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.08;0.18;0.08" dur={`${5 + i * 0.3}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
        {isUltra && ultraTheme === 'matrix' && [...Array(8)].map((_, i) => (
          <text key={`matrix2-${i}`} x={80 + i * 140} y="0" fill="rgba(74,222,128,0.35)" fontSize="10" fontFamily="monospace">
            {String.fromCharCode(0x30A0 + ((i * 7) % 96))}
            <animate attributeName="y" values="-20;620" dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.5;0" dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" />
          </text>
        ))}

        {/* Lightning streaks at max speed (ultra) */}
        {isUltra && speed === 'fast' && (
          <>
            <polyline points="0,50 40,120 20,120 80,200" stroke={`hsla(${hue},100%,70%,0.5)`} strokeWidth="1.5" fill="none">
              <animate attributeName="opacity" values="0;0.6;0" dur="0.4s" repeatCount="indefinite" />
            </polyline>
            <polyline points="1180,80 1140,150 1165,150 1100,240" stroke={`hsla(${hue},100%,70%,0.5)`} strokeWidth="1.5" fill="none">
              <animate attributeName="opacity" values="0;0.6;0" dur="0.5s" begin="0.2s" repeatCount="indefinite" />
            </polyline>
          </>
        )}

        {/* Combo burst rings (ultra, high combo) */}
        {isUltra && combo >= 10 && (
          <circle cx="600" cy="300" r="8" fill="none" stroke={`hsla(${hue},90%,65%,0.6)`} strokeWidth="2">
            <animate attributeName="r" values="8;120" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0" dur="0.6s" repeatCount="indefinite" />
          </circle>
        )}

      </svg>
    </div>
  )
}

// ============================================================
// WPM FLAME SVG ICON — replaces emoji 🔥
// ============================================================
export function WpmFlame({ wpm }: { wpm: number }) {
  if (wpm < 80) return null

  const intensity = Math.min((wpm - 80) / 120, 1)
  const flames    = Math.floor(1 + intensity * 3)
  // Below 100: gold, 100+: orange-red
  const r = wpm >= 100 ? 255 : 232
  const g = wpm >= 100 ? 100 : 184
  const b = wpm >= 100 ? 30  : 75

  return (
    <div className="flex items-center gap-0.5" title={`${wpm} WPM — on fire!`} aria-hidden>
      {[...Array(flames)].map((_, i) => (
        <svg key={i} width="14" height="18" viewBox="0 0 20 26" fill="none">
          {/* Outer flame */}
          <path d={`M10 1C10 1 18 8 18 14C18 19 14.5 22 10 23C5.5 22 2 19 2 14C2 8 10 1 10 1Z`}
            fill={`rgba(${r},${g},${b},${0.55 + i * 0.15})`}>
            <animate
              attributeName="d"
              values={`M10 1C10 1 18 8 18 14C18 19 14.5 22 10 23C5.5 22 2 19 2 14C2 8 10 1 10 1Z;
                       M10 2C10 2 19 9 18 14C17 19 14 21.5 10 23C6 21.5 3 19 2 14C1 9 10 2 10 2Z;
                       M10 1C10 1 18 8 18 14C18 19 14.5 22 10 23C5.5 22 2 19 2 14C2 8 10 1 10 1Z`}
              dur={`${0.45 - i * 0.08}s`}
              repeatCount="indefinite"
            />
          </path>
          {/* Inner bright core */}
          <path d="M10 10C10 10 14 14 14 17C14 19.5 12.2 21 10 22C7.8 21 6 19.5 6 17C6 14 10 10 10 10Z"
            fill={`rgba(255,220,100,${0.6 + i * 0.1})`}>
            <animate
              attributeName="d"
              values="M10 10C10 10 14 14 14 17C14 19.5 12.2 21 10 22C7.8 21 6 19.5 6 17C6 14 10 10 10 10Z;M10 11C10 11 14.5 15 14 17C13.5 19.5 12 20.5 10 22C8 20.5 6.5 19.5 6 17C5.5 15 10 11 10 11Z;M10 10C10 10 14 14 14 17C14 19.5 12.2 21 10 22C7.8 21 6 19.5 6 17C6 14 10 10 10 10Z"
              dur={`${0.35 - i * 0.06}s`}
              repeatCount="indefinite"
            />
          </path>
        </svg>
      ))}
    </div>
  )
}

// ============================================================
// ERROR FLASH — red glow on wrong key (Ultra PRO)
// ============================================================
export function ErrorFlash({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10"
      aria-hidden
      style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(239,68,68,0.22) 0%, rgba(239,68,68,0.05) 50%, transparent 75%)',
        animation: 'tc-error-flash 0.13s ease-out both',
      }}
    />
  )
}

// ============================================================
// CONFETTI CANVAS — pixel bursts (Ultra PRO)
// ============================================================
interface ConfettiProps {
  trigger: number   // increment to fire small burst
  massive?: boolean // end-of-test big burst
}

const CONFETTI_COLORS = [
  '#E8B84B', '#a855f7', '#ec4899',
  '#22d3ee', '#4ade80', '#f97316',
  '#facc15', '#e879f9',
]

interface Particle {
  x: number; y: number
  vx: number; vy: number
  color: string
  w: number; h: number
  life: number; maxLife: number
  rot: number; rotSpeed: number
  shape: 'rect' | 'circle' | 'star'
}

export function ConfettiCanvas({ trigger, massive }: ConfettiProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const parts      = useRef<Particle[]>([])
  const raf        = useRef<number>(0)
  const mounted    = useRef(false)

  function spawnBurst(count: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const cx = canvas.width  / 2
    const cy = canvas.height * 0.42

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = massive
        ? 4 + Math.random() * 14
        : 2 + Math.random() * 5
      parts.current.push({
        x: cx + (Math.random() - 0.5) * (massive ? 200 : 40),
        y: cy + (Math.random() - 0.5) * (massive ? 100 : 20),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (massive ? 6 : 1.5),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        w: 5 + Math.random() * (massive ? 8 : 4),
        h: 3 + Math.random() * (massive ? 5 : 2),
        life: 0,
        maxLife: massive ? 90 + Math.random() * 80 : 35 + Math.random() * 25,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        shape: (['rect', 'rect', 'circle', 'star'] as const)[Math.floor(Math.random() * 4)],
      })
    }
  }

  function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const a  = (i * Math.PI * 2) / 5 - Math.PI / 2
      const ai = a + Math.PI / 5
      if (i === 0) ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
      else ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
      ctx.lineTo(x + Math.cos(ai) * (r * 0.4), y + Math.sin(ai) * (r * 0.4))
    }
    ctx.closePath()
    ctx.fill()
  }

  // Animation loop
  useEffect(() => {
    mounted.current = true
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    function resize() {
      canvas!.width  = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function loop() {
      if (!mounted.current) return
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      parts.current = parts.current.filter(p => p.life < p.maxLife)

      for (const p of parts.current) {
        p.x   += p.vx
        p.y   += p.vy
        p.vy  += 0.22   // gravity
        p.vx  *= 0.985  // air friction
        p.rot += p.rotSpeed
        p.life++

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife)
        ctx.fillStyle   = p.color

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, p.w / 2)
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        }
        ctx.restore()
      }

      raf.current = requestAnimationFrame(loop)
    }

    loop()
    return () => {
      mounted.current = false
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Trigger burst when trigger increments
  useEffect(() => {
    if (trigger === 0) return
    spawnBurst(massive ? 200 : 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden
    />
  )
}

// ============================================================
// SVG ICON — replaces emoji streak fire
// ============================================================
export function StreakIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 20 26" fill="none" aria-hidden>
      <path d="M10 1C10 1 18 8 18 14C18 19 14.5 22 10 23C5.5 22 2 19 2 14C2 8 10 1 10 1Z" fill="#f97316" opacity="0.9" />
      <path d="M10 10C10 10 14 14 14 17C14 19.5 12 21 10 22C8 21 6 19.5 6 17C6 14 10 10 10 10Z" fill="#fcd34d" opacity="0.85" />
    </svg>
  )
}

// ============================================================
// SVG ICON — replaces ⚡ ultra badge
// ============================================================
export function UltraIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 20 24" fill="none" aria-hidden>
      <path d="M12 1L2 14H10L8 23L18 10H10L12 1Z" fill="#a855f7" stroke="#c084fc" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}

// ============================================================
// SVG ICON — PRO lock indicator
// ============================================================
export function ProLockIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 20 22" fill="none" aria-hidden>
      <rect x="3" y="10" width="14" height="11" rx="2" fill="none" stroke="#E8B84B" strokeWidth="1.5" />
      <path d="M7 10V7C7 4.79 8.79 3 11 3V3C13.21 3 15 4.79 15 7V10" stroke="#E8B84B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="15.5" r="1.5" fill="#E8B84B" />
      <line x1="10" y1="15.5" x2="10" y2="18.5" stroke="#E8B84B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
