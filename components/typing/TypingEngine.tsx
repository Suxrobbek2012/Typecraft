'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '@/lib/texts'
import type { Language, Difficulty, TypingMode } from '@/types'
import { TestResult } from './TestResult'
import {
  TypingAnimations,
  WpmFlame,
  ErrorFlash,
  ConfettiCanvas,
  StreakIcon,
  UltraIcon,
  ProLockIcon,
} from '@/components/svg/TypingAnimations'
import {
  UltraThemePicker,
  ComboDisplay,
  MilestoneToast,
  ScreenShake,
  UltraThemeOverlay,
  PersonalBestBadge,
  useWpmMilestones,
  loadUltraTheme,
  loadPersonalBest,
  savePersonalBest,
  type UltraTheme,
} from '@/components/typing/UltraEffects'
import { useLocale } from '@/components/layout/LocaleProvider'

// ---- Config ----
const TIME_OPTIONS  = [15, 30, 60, 120] as const
const WORD_OPTIONS  = [10, 25, 50, 100] as const
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'extreme']
const SETTINGS_KEY = 'typecraft-user-prefs'
const FONT_SIZES = {
  sm: '1rem',
  md: '1.2rem',
  lg: '1.35rem',
  xl: '1.5rem',
} as const

type TimeOption = typeof TIME_OPTIONS[number]
type WordOption = typeof WORD_OPTIONS[number]
type Plan = 'free' | 'basic' | 'ultra'

interface CharState {
  char: string
  status: 'pending' | 'correct' | 'wrong' | 'extra'
}

interface SparkleParticle {
  id: number
  left: number
  top: number
  size: number
  hue: number
  dx: number
  dy: number
  duration: number
  delay: number
}

// ---- Helpers ----
function buildCharStates(text: string): CharState[] {
  return text.split('').map(char => ({ char, status: 'pending' }))
}

// Accurate WPM: based on correct characters typed ÷ 5 (word = 5 chars) per minute
function calcWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds < 0.5) return 0
  return Math.round((correctChars / 5) / (elapsedSeconds / 60))
}

function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

// ---- Web Audio API — zero-latency sounds ----
let _audioCtx: AudioContext | null = null

function getAudioCtx(): AudioContext {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  // Resume if suspended (browser policy)
  if (_audioCtx.state === 'suspended') _audioCtx.resume()
  return _audioCtx
}

function playClick(type: 'correct' | 'wrong', soundEnabled = true) {
  if (!soundEnabled) return

  try {
    const ctx  = getAudioCtx()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    if (type === 'correct') {
      // Yumshoq mexanik klaviatura ovozi (soft mechanical switch / thock click)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.045)
      
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 850
      filter.Q.value = 1.2
      
      osc.disconnect(gain)
      osc.connect(filter)
      filter.connect(gain)
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045)
      
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.05)
    } else {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.09)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.12)
    }
  } catch { /* ignore if audio not available */ }
}

export function TypingEngine() {
  const { t: tr } = useLocale()
  // ---- User plan ----
  const [plan,   setPlan]   = useState<Plan>('free')
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    fetch('/api/auth?action=me')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          // Fallback: if plan undefined, use isPro/role to determine
          const rawPlan = d.user.plan
          let resolvedPlan: Plan = 'free'
          if (rawPlan === 'ultra') resolvedPlan = 'ultra'
          else if (rawPlan === 'basic') resolvedPlan = 'basic'
          else if (d.user.role === 'admin') resolvedPlan = 'ultra'
          else if (d.user.isPro) resolvedPlan = 'basic'
          else resolvedPlan = 'free'

          setPlan(resolvedPlan)
          setStreak(d.user.stats?.streak || 0)
        }
      })
      .catch(() => {})
  }, [])

  const isBasic = plan === 'basic' || plan === 'ultra'
  const isUltra = plan === 'ultra'

  // ---- Config state ----
  const [mode,        setMode]        = useState<TypingMode>('time')
  const [duration,    setDuration]    = useState<TimeOption>(30)
  const [wordCount,   setWordCount]   = useState<WordOption>(25)
  const [language,    setLanguage]    = useState<Language>('en')
  const [difficulty,  setDifficulty]  = useState<Difficulty>('medium')
  const [punctuation, setPunctuation] = useState(false)
  const [numbers,     setNumbers]     = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')
  const [showLiveWpm, setShowLiveWpm] = useState(true)
  const [screenVibration, setScreenVibration] = useState(false)
  const [showProgress, setShowProgress] = useState(true)
  const [caretStyle, setCaretStyle] = useState<'line' | 'block' | 'underline'>('line')
  const [smoothCaret, setSmoothCaret] = useState(true)

  // ---- Test state ----
  const [chars,      setChars]      = useState<CharState[]>([])
  const [cursor,     setCursor]     = useState(0)
  const [started,    setStarted]    = useState(false)
  const [finished,   setFinished]   = useState(false)
  const [timeLeft,   setTimeLeft]   = useState<TimeOption>(duration)
  const [wpmHistory, setWpmHistory] = useState<number[]>([])
  const [liveWpm,    setLiveWpm]    = useState(0)
  const [liveCpm,    setLiveCpm]    = useState(0)

  // ---- Ultra effects state ----
  const [errorFlash,      setErrorFlash]      = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [combo,           setCombo]           = useState(0)
  const [maxCombo,        setMaxCombo]        = useState(0)
  const [ultraTheme,      setUltraTheme]      = useState<UltraTheme>('default')
  const [personalBest,    setPersonalBest]    = useState(0)
  const [screenShake,     setScreenShake]     = useState(false)
  const [glowIndex, setGlowIndex] = useState<number | null>(null)
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([])
  const sparkleIdRef = useRef(0)
  const milestoneToast = useWpmMilestones(liveWpm, isUltra && started && !finished)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = window.localStorage.getItem(SETTINGS_KEY)
      if (!saved) return

      const parsed = JSON.parse(saved) as {
        language?: Language
        fontSize?: 'sm' | 'md' | 'lg' | 'xl'
        soundEnabled?: boolean
        showLiveWpm?: boolean
        showProgress?: boolean
        caretStyle?: 'line' | 'block' | 'underline'
        smoothCaret?: boolean
        screenVibration?: boolean
      }

      if (parsed.language) setLanguage(parsed.language)
      if (parsed.fontSize) setFontSize(parsed.fontSize)
      if (typeof parsed.soundEnabled === 'boolean') setSoundEnabled(parsed.soundEnabled)
      if (typeof parsed.showLiveWpm === 'boolean') setShowLiveWpm(parsed.showLiveWpm)
      if (typeof parsed.showProgress === 'boolean') setShowProgress(parsed.showProgress)
      if (parsed.caretStyle) setCaretStyle(parsed.caretStyle)
      if (typeof parsed.smoothCaret === 'boolean') setSmoothCaret(parsed.smoothCaret)
      if (typeof parsed.screenVibration === 'boolean') setScreenVibration(parsed.screenVibration)
    } catch {
      // ignore invalid saved prefs
    }
  }, [])

  useEffect(() => {
    if (isUltra) {
      setUltraTheme(loadUltraTheme())
      setPersonalBest(loadPersonalBest())
    }
  }, [isUltra])

  const inputRef     = useRef<HTMLInputElement>(null)
  const typingAreaRef = useRef<HTMLDivElement>(null)
  const timerRef     = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const correctRef   = useRef(0)   // correct characters
  const totalRef     = useRef(0)   // total keystrokes
  const lastWpmRef   = useRef<number[]>([])  // per-second accurate wpm log

  const spawnSparklesAt = useCallback((index: number, isCorrect: boolean) => {
    const container = typingAreaRef.current
    if (!container) return

    const chars = container.querySelectorAll<HTMLSpanElement>('.typing-char')
    const target = chars[index] || chars[chars.length - 1]
    const containerRect = container.getBoundingClientRect()
    const targetRect = target?.getBoundingClientRect() ?? containerRect
    const baseX = targetRect.left - containerRect.left + targetRect.width / 2
    const baseY = targetRect.top - containerRect.top + targetRect.height / 2
    
    // Agar correct bo'lsa ultraTheme ranglari, aks holda qizil rang (hue = 0)
    const themeHue = isCorrect 
      ? (ultraTheme === 'neon' ? 280 : ultraTheme === 'aurora' ? 160 : ultraTheme === 'matrix' ? 140 : 45)
      : 0

    const newParticles = Array.from({ length: 7 }, () => {
      const dx = (Math.random() - 0.5) * 52
      const dy = -24 - Math.random() * 28
      return {
        id: sparkleIdRef.current++,
        left: baseX + (Math.random() - 0.5) * 6,
        top: baseY + (Math.random() - 0.5) * 4,
        size: 5 + Math.random() * 6,
        hue: themeHue + (isCorrect ? (Math.random() * 24 - 12) : (Math.random() * 10 - 5)),
        dx,
        dy,
        duration: 0.42 + Math.random() * 0.16,
        delay: Math.random() * 0.08,
      }
    })

    setSparkles(prev => [...prev, ...newParticles])
    window.setTimeout(() => {
      setSparkles(prev => prev.filter(p => !newParticles.some(n => n.id === p.id)))
    }, 900)
  }, [ultraTheme])

  // ---- Load text ----
  const loadText = useCallback(async () => {
    const timeCount = Math.max(80, Math.ceil(duration * 2.5))
    const count = mode === 'words' ? wordCount : timeCount
    const res = await fetch(
      `/api/texts?lang=${language}&difficulty=${difficulty}&count=${count}&punctuation=${punctuation}&numbers=${numbers}`
    )
    const data = await res.json()
    const text: string = data.text || 'the quick brown fox jumps over the lazy dog'
    setChars(buildCharStates(text))
    setCursor(0)
    setStarted(false)
    setFinished(false)
    setTimeLeft(duration)
    setWpmHistory([])
    setLiveWpm(0)
    setLiveCpm(0)
    setCombo(0)
    setMaxCombo(0)
    setGlowIndex(null)
    setSparkles([])
    sparkleIdRef.current = 0
    correctRef.current  = 0
    totalRef.current    = 0
    lastWpmRef.current  = []
    if (timerRef.current) clearInterval(timerRef.current)
  }, [language, difficulty, mode, wordCount, duration, punctuation, numbers])

  useEffect(() => { loadText() }, [loadText])

  useEffect(() => {
    if (!typingAreaRef.current) return
    const activeCaret = typingAreaRef.current.querySelector('.caret-line') as HTMLElement | null
    if (!activeCaret) return

    const containerRect = typingAreaRef.current.getBoundingClientRect()
    const caretRect = activeCaret.getBoundingClientRect()
    const bottomPadding = 56

    if (caretRect.bottom > containerRect.bottom - bottomPadding) {
      typingAreaRef.current.scrollBy({
        top: caretRect.bottom - (containerRect.bottom - bottomPadding),
        behavior: 'smooth',
      })
    } else if (caretRect.top < containerRect.top + 16) {
      typingAreaRef.current.scrollBy({
        top: caretRect.top - (containerRect.top + 16),
        behavior: 'smooth',
      })
    }
  }, [cursor, chars.length])

  // ---- Accurate per-second WPM timer ----
  useEffect(() => {
    if (started && mode === 'time') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          const next = (t - 1) as TimeOption
          if (t <= 1) {
            clearInterval(timerRef.current!)
            setFinished(true)
            return 0 as TimeOption
          }

          // Record real-time WPM each second
          const elapsed = (Date.now() - startTimeRef.current) / 1000
          const wpm = calcWpm(correctRef.current, elapsed)
          lastWpmRef.current = [...lastWpmRef.current, wpm]
          setWpmHistory([...lastWpmRef.current])
          setLiveWpm(wpm)

          return next
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started, mode])

  // ---- Key handler ----
  const handleKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return

    const key = e.key

    // Start on first character key
    if (!started && key.length === 1) {
      setStarted(true)
      startTimeRef.current = Date.now()
    }

    if (key === 'Backspace') {
      e.preventDefault()
      if (cursor === 0) return
      setChars(prev => {
        const next = [...prev]
        if (next[cursor - 1]?.status === 'extra') {
          next.splice(cursor - 1, 1)
        } else {
          next[cursor - 1].status = 'pending'
        }
        return next
      })
      setCursor(c => c - 1)
      return
    }

    if (key.length !== 1) return
    e.preventDefault()

    totalRef.current++
    let isCorrect = false

    setChars(prev => {
      const next = [...prev]
      if (cursor >= next.length) {
        next.push({ char: key, status: 'extra' })
      } else if (next[cursor].char === key) {
        next[cursor].status = 'correct'
        correctRef.current++
        isCorrect = true
      } else {
        next[cursor].status = 'wrong'
      }
      return next
    })

    // Ultra-specific effects
    if (isUltra) {
      playClick(isCorrect ? 'correct' : 'wrong', soundEnabled)
      if (!isCorrect) {
        setErrorFlash(true)
        if (screenVibration) setScreenShake(true)
        setTimeout(() => { setErrorFlash(false); setScreenShake(false) }, 140)
        setCombo(0)
        spawnSparklesAt(cursor, false) // Xato uchun qizil zarrachalar
      } else {
        setCombo(c => {
          const next = c + 1
          setMaxCombo(m => Math.max(m, next))
          return next
        })
        setGlowIndex(cursor)
        setTimeout(() => setGlowIndex(null), 350)
        if (combo >= 0 && (combo + 1) % 8 === 0) {
          setConfettiTrigger(t => t + 1)
        }
        spawnSparklesAt(cursor, true) // To'g'ri uchun o'z mavzuidagi zarrachalar
      }
    }

    const nextCursor = cursor + 1
    setCursor(nextCursor)

    // Live WPM update every keystroke — accurate
    const elapsed = Math.max((Date.now() - startTimeRef.current) / 1000, 0.1)
    setLiveWpm(calcWpm(correctRef.current, elapsed))
    setLiveCpm(Math.round(correctRef.current / (elapsed / 60)))

    // Words mode: finish check
    if (mode === 'words' && nextCursor >= chars.length) {
      setFinished(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [cursor, chars, started, finished, mode, isUltra, combo, soundEnabled])

  // Tab+Enter restart
  useEffect(() => {
    let tabHeld = false
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') { e.preventDefault(); tabHeld = true }
      if (e.key === 'Enter' && tabHeld) { e.preventDefault(); restart() }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === 'Tab') tabHeld = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    loadText()
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [loadText])

  useEffect(() => { inputRef.current?.focus() }, [])

  // ---- Results ----
  if (finished) {
    const elapsed  = Math.max((Date.now() - startTimeRef.current) / 1000, 1)
    const wpm      = calcWpm(correctRef.current, elapsed)
    const accuracy = calcAccuracy(correctRef.current, totalRef.current)
    const cpm      = Math.round(correctRef.current / (elapsed / 60))
    const isNewPb  = isUltra && savePersonalBest(wpm)
    if (isNewPb) setPersonalBest(wpm)

    return (
      <>
        {isUltra && <ConfettiCanvas trigger={1} massive />}
        <TestResult
          wpm={wpm}
          accuracy={accuracy}
          wpmHistory={wpmHistory.length > 0 ? wpmHistory : [wpm]}
          duration={Math.round(elapsed)}
          errors={totalRef.current - correctRef.current}
          onRestart={restart}
          isUltra={isUltra}
          cpm={cpm}
          maxCombo={maxCombo}
          isNewPb={isNewPb}
        />
      </>
    )
  }

  // ---- Plan-gated options ----
  const allowedTimes = isBasic ? TIME_OPTIONS : ([15, 30] as TimeOption[])
  const allowedLangs = LANGUAGES

  return (
    <ScreenShake active={screenVibration && screenShake}>
    <div className="w-full max-w-4xl mx-auto animate-slide-up relative z-10">
      {isUltra && <UltraThemeOverlay theme={ultraTheme} />}
      {isUltra && milestoneToast !== null && (
        <MilestoneToast wpm={milestoneToast} show />
      )}
      {/* Background SVG animations */}
      <TypingAnimations
        wpm={liveWpm}
        isTyping={started && !finished}
        isUltra={isUltra}
        ultraTheme={ultraTheme}
        combo={combo}
      />

      {/* Ultra-only: error flash + confetti */}
      {isUltra && <ErrorFlash active={errorFlash} />}
      {isUltra && <ConfettiCanvas trigger={confettiTrigger} />}

      {/* ---- Config bar ---- */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-sm font-mono">

        {/* Mode */}
        <div className="flex rounded-lg overflow-hidden border border-custom">
          {(['time', 'words', 'quote'] as TypingMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 capitalize transition-all ${
                mode === m ? 'bg-accent text-dark-bg font-semibold' : 'text-sub hover:text-accent hover:bg-card'
              }`}
            >
              {tr.typing.modes[m as keyof typeof tr.typing.modes] ?? m}
            </button>
          ))}
        </div>

        {/* Time options */}
        {mode === 'time' && (
          <div className="flex rounded-lg overflow-hidden border border-custom">
            {TIME_OPTIONS.map(t => {
              const locked = !allowedTimes.includes(t)
              return (
                <button
                  key={t}
                  onClick={() => { if (!locked) { setDuration(t); setTimeLeft(t) } }}
                  title={locked ? tr.typing.proLock : `${t}s ${tr.typing.seconds}`}
                  className={`px-3 py-1.5 transition-all flex items-center gap-1 ${
                    duration === t && !locked ? 'bg-accent text-dark-bg font-semibold' :
                    locked ? 'text-sub/30 cursor-not-allowed' :
                    'text-sub hover:text-accent hover:bg-card'
                  }`}
                >
                  {t}s
                  {locked && <ProLockIcon size={9} />}
                </button>
              )
            })}
          </div>
        )}

        {/* Word options */}
        {mode === 'words' && (
          <div className="flex rounded-lg overflow-hidden border border-custom">
            {WORD_OPTIONS.map(w => (
              <button
                key={w}
                onClick={() => setWordCount(w)}
                className={`px-3 py-1.5 transition-all ${
                  wordCount === w ? 'bg-accent text-dark-bg font-semibold' : 'text-sub hover:text-accent hover:bg-card'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        )}

        {/* Language selector */}
        <div className="relative">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as Language)}
            className="appearance-none bg-card border border-custom rounded-lg px-3 py-1.5 text-sm font-mono text-sub hover:text-accent focus:outline-none focus:border-accent pr-7 cursor-pointer"
          >
            {allowedLangs.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-sub" />
        </div>

        {/* Difficulty selector */}
        <div className="relative">
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as Difficulty)}
            className="appearance-none bg-card border border-custom rounded-lg px-3 py-1.5 text-sm font-mono text-sub hover:text-accent focus:outline-none focus:border-accent pr-7 cursor-pointer"
          >
            {DIFFICULTIES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-sub" />
        </div>

        {/* Toggles */}
        <button
          onClick={() => setPunctuation(p => !p)}
          className={`px-3 py-1.5 rounded-lg border font-mono transition-all ${
            punctuation ? 'border-accent text-accent bg-accent/10' : 'border-custom text-sub hover:text-accent'
          }`}
        >@#!</button>
        <button
          onClick={() => setNumbers(n => !n)}
          className={`px-3 py-1.5 rounded-lg border font-mono transition-all ${
            numbers ? 'border-accent text-accent bg-accent/10' : 'border-custom text-sub hover:text-accent'
          }`}
        >123</button>

        {isUltra && (
          <div className="flex flex-col gap-1 min-w-[180px] max-w-full">
            <UltraThemePicker theme={ultraTheme} onChange={setUltraTheme} />
            <p className="text-[11px] text-sub/70 break-words max-w-full">{tr.ultra.description}</p>
          </div>
        )}
      </div>

      {/* ---- Stats bar ---- */}
      <div className="flex flex-col gap-4 mb-6 font-mono md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          {showLiveWpm && (
            <>
              {/* WPM display */}
              <div className="flex items-end gap-1">
                <span className={`text-3xl font-bold tabular-nums transition-colors ${
                  liveWpm >= 100 ? 'text-orange-400' : liveWpm >= 60 ? 'text-accent' : 'text-accent'
                }`}>
                  {liveWpm > 0 ? liveWpm : '—'}
                </span>
                <span className="text-sub text-xs uppercase tracking-wider mb-1">{tr.typing.wpm}</span>
              </div>

              {/* Flame for 80+ WPM */}
              <WpmFlame wpm={liveWpm} />

              {/* Streak counter with SVG fire icon */}
              {streak > 0 && (
                <div className="flex items-center gap-1 border border-orange-400/25 bg-orange-400/8 px-2 py-0.5 rounded-full">
                  <StreakIcon size={11} />
                  <span className="text-orange-400 text-xs font-mono">{streak}d</span>
                </div>
              )}

              {isUltra && liveCpm > 0 && (
                <div className="flex items-end gap-0.5 text-sub">
                  <span className="text-lg font-bold tabular-nums text-purple-300">{liveCpm}</span>
                  <span className="text-[10px] uppercase mb-0.5">{tr.typing.cpm}</span>
                </div>
              )}

              {isUltra && <ComboDisplay combo={combo} />}

              {isUltra && (
                <PersonalBestBadge wpm={liveWpm} best={personalBest} />
              )}

              {/* Ultra badge with SVG lightning */}
              {isUltra && (
                <div className="flex items-center gap-1 border border-purple-400/25 bg-purple-400/8 px-2 py-0.5 rounded-full">
                  <UltraIcon size={11} />
                  <span className="text-purple-400 text-xs font-mono">{tr.typing.ultra}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Timer / Word counter */}
        {mode === 'time' && (
          <div className={`text-3xl font-bold font-mono tabular-nums transition-all text-right min-w-[5rem] ${
            timeLeft <= 5 ? 'text-red-400 animate-pulse scale-110' : 'text-accent'
          }`}>
            {started ? timeLeft : duration}s
          </div>
        )}
        {mode === 'words' && (
          <div className="text-sub text-sm tabular-nums text-right min-w-[5rem]">
            {Math.min(cursor, chars.length)} / {chars.length}
          </div>
        )}
      </div>

      {/* ---- Typing area — large & comfortable ---- */}
      <div
        ref={typingAreaRef}
        className="typing-area relative cursor-text select-none overflow-auto rounded-xl border border-custom bg-surface/80 shadow-sm transition-all"
        style={{
          minHeight: '11rem',
          lineHeight: smoothCaret ? '3.6rem' : '3.2rem',
          fontSize: FONT_SIZES[fontSize] || '1.2rem',
          letterSpacing: '0.01em',
          fontFamily: 'var(--font-mono)',
          scrollPaddingTop: '1rem',
          padding: '1rem',
          transition: smoothCaret ? 'font-size 120ms ease, transform 120ms ease' : 'none',
        }}
        onClick={() => inputRef.current?.focus()}
        role="textbox"
        aria-label={tr.typing.ariaTyping}
      >
        {isUltra && sparkles.length > 0 && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {sparkles.map(sparkle => (
              <span
                key={sparkle.id}
                className="tc-ultra-sparkle"
                style={{
                  left: sparkle.left,
                  top: sparkle.top,
                  width: sparkle.size,
                  height: sparkle.size,
                  background: `hsl(${sparkle.hue}, 92%, 72%)`,
                  boxShadow: `0 0 ${sparkle.size * 0.75}px rgba(255,255,255,0.95), 0 0 ${sparkle.size * 1.8}px hsla(${sparkle.hue}, 92%, 72%, 0.65)`,
                  animationDuration: `${sparkle.duration}s`,
                  animationDelay: `${sparkle.delay}s`,
                  transform: `translate(-50%, -50%)`,
                  '--dx': `${sparkle.dx}px`,
                  '--dy': `${sparkle.dy}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
        <div className="flex flex-wrap">
          {chars.slice(0, cursor + 90).map((c, i) => (
            <span
              key={i}
              className={`typing-char relative ${c.status}${isUltra && i === glowIndex ? ' ultra-glow' : ''}`}
            >
              {c.char === ' ' ? '\u00A0' : c.char}
              {i === cursor && (
                <span
                  className={caretStyle === 'underline' ? 'caret-line underline' : 'caret-line'}
                  style={{
                    borderLeft: caretStyle === 'block' ? '2px solid currentColor' : undefined,
                    background: caretStyle === 'block' ? 'rgba(255,255,255,0.12)' : undefined,
                    height: caretStyle === 'block' ? '1.2em' : undefined,
                    borderBottom: caretStyle === 'underline' ? '2px solid currentColor' : undefined,
                  }}
                />
              )}
            </span>
          ))}
        </div>
      </div>

      {showProgress && (
        <div className="mt-3 h-1.5 rounded-full bg-custom/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${chars.length ? Math.min(100, (cursor / chars.length) * 100) : 0}%` }}
          />
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        onKeyDown={handleKey}
        readOnly
        aria-hidden="true"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* ---- Restart button ---- */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={restart}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-custom text-sub hover:text-accent hover:border-accent transition-all font-mono text-sm"
          title="Restart (Tab + Enter)"
        >
          <RotateCcw size={14} />
          {tr.typing.restart}
        </button>
      </div>

      {/* ---- Hint & upgrade nudge ---- */}
      <div className="flex items-center justify-center gap-4 mt-3">
        {!started && (
          <p className="text-center text-sub/60 text-xs font-mono">
            {tr.typing.startHint}
          </p>
        )}
        {!isBasic && (
          <a
            href="/donate"
            className="flex items-center gap-1.5 text-xs font-mono text-accent/60 hover:text-accent transition-colors border border-accent/15 px-2.5 py-0.5 rounded-full hover:border-accent/40"
          >
            <ProLockIcon size={10} />
            {tr.typing.upgradePro}
          </a>
        )}
      </div>
    </div>
    </ScreenShake>
  )
}
