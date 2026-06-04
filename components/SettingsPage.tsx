'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LANGUAGES } from '@/lib/texts'
import type { Language } from '@/types'
import { useLocale } from '@/components/layout/LocaleProvider'

type Section = { title: string; items: SettingItem[] }
type SettingItem =
  | { type: 'toggle'; key: string; label: string; desc: string }
  | { type: 'select'; key: string; label: string; desc: string; options: { value: string; label: string }[] }
  | { type: 'radio';  key: string; label: string; desc: string; options: { value: string; label: string }[] }

const STORAGE_KEY = 'typecraft-user-prefs'

const DEFAULT_PREFS = {
  theme:        'dark' as 'dark' | 'light' | 'system',
  language:     'en' as Language,
  caretStyle:   'line',
  fontSize:     'md',
  soundEnabled: true,
  showLiveWpm:  true,
  showProgress: true,
  smoothCaret:  true,
  blindMode:    false,
  screenVibration: false,
}

export function SettingsPage() {
  const { t: tr, setLocale } = useLocale()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [saved, setSaved] = useState(false)

  function applySavedPrefs(nextPrefs: Partial<typeof DEFAULT_PREFS>) {
    if (nextPrefs.language) {
      setLocale(nextPrefs.language as Parameters<typeof setLocale>[0])
    }
    if (nextPrefs.theme) {
      setTheme(nextPrefs.theme as 'dark' | 'light' | 'system')
    }
  }

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<typeof DEFAULT_PREFS>
        setPrefs({ ...DEFAULT_PREFS, ...parsed })
        applySavedPrefs(parsed)
      }
    } catch {
      // ignore invalid stored prefs
    }
  }, [])

  function updatePrefs(next: Partial<typeof DEFAULT_PREFS>) {
    setPrefs(prev => ({ ...prev, ...next }))
    setSaved(false)
  }

  function toggle(key: string) {
    updatePrefs({ [key]: !prefs[key as keyof typeof prefs] } as Partial<typeof DEFAULT_PREFS>)
  }

  function set(key: string, value: string) {
    updatePrefs({ [key]: value } as Partial<typeof DEFAULT_PREFS>)
    if (key === 'language') {
      setLocale(value as Parameters<typeof setLocale>[0])
    }
  }

  function savePrefs() {
    if (typeof window === 'undefined') return

    const nextPrefs = { ...prefs }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPrefs))

    if (nextPrefs.language) {
      setLocale(nextPrefs.language as Parameters<typeof setLocale>[0])
    }
    if (nextPrefs.theme) {
      setTheme(nextPrefs.theme as 'dark' | 'light' | 'system')
    }

    setSaved(true)
  }

  function resetPrefs() {
    setPrefs(DEFAULT_PREFS)
    setSaved(false)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }

  const sections: Section[] = [
    {
      title: tr.settings.sections.appearance,
      items: [
        { type: 'radio', key: 'theme', label: tr.settings.theme, desc: tr.settings.themeDesc,
          options: [{ value: 'dark', label: tr.settings.dark }, { value: 'light', label: tr.settings.light }, { value: 'system', label: tr.settings.system }] },
        { type: 'radio', key: 'fontSize', label: tr.settings.fontSize, desc: tr.settings.fontSizeDesc,
          options: [{ value: 'sm', label: tr.settings.sm }, { value: 'md', label: tr.settings.md }, { value: 'lg', label: tr.settings.lg }, { value: 'xl', label: tr.settings.xl }] },
      ],
    },
    {
      title: tr.settings.sections.caret,
      items: [
        { type: 'radio', key: 'caretStyle', label: tr.settings.caretStyle, desc: tr.settings.caretStyleDesc,
          options: [{ value: 'line', label: tr.settings.line }, { value: 'block', label: tr.settings.block }, { value: 'underline', label: tr.settings.underline }] },
        { type: 'toggle', key: 'smoothCaret', label: tr.settings.smoothCaret, desc: tr.settings.smoothCaretDesc },
      ],
    },
    {
      title: tr.settings.sections.behaviour,
      items: [
        { type: 'toggle', key: 'soundEnabled', label: tr.settings.sound, desc: tr.settings.soundDesc },
        { type: 'toggle', key: 'showLiveWpm', label: tr.settings.liveWpm, desc: tr.settings.liveWpmDesc },
        { type: 'toggle', key: 'showProgress', label: tr.settings.showProgress, desc: tr.settings.showProgressDesc },
        { type: 'toggle', key: 'blindMode', label: tr.settings.blindMode, desc: tr.settings.blindModeDesc },
        { type: 'toggle', key: 'screenVibration', label: tr.settings.screenVibration, desc: tr.settings.screenVibrationDesc },
      ],
    },
    {
      title: tr.settings.languageSection,
      items: [
        { type: 'select', key: 'language', label: tr.settings.defaultLanguage, desc: tr.settings.defaultLanguageDesc,
          options: LANGUAGES.map(l => ({ value: l.code, label: `${l.flag} ${l.name}` })) },
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-16 w-full">
        <h1 className="font-display text-3xl font-bold mb-10">{tr.settings.title}</h1>

        <div className="space-y-10">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="text-xs font-mono uppercase tracking-widest text-sub mb-4 pb-2 border-b border-custom">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-card transition-colors">
                    <div className="mr-8">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-sub mt-0.5">{item.desc}</p>
                    </div>

                    {item.type === 'toggle' && (
                      <button
                        onClick={() => toggle(item.key)}
                        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                          prefs[item.key as keyof typeof prefs] ? 'bg-accent' : 'bg-muted'
                        }`}
                        role="switch"
                        aria-checked={!!prefs[item.key as keyof typeof prefs]}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          prefs[item.key as keyof typeof prefs] ? 'left-6' : 'left-1'
                        }`}/>
                      </button>
                    )}

                    {item.type === 'radio' && (
                      <div className="flex gap-1 shrink-0">
                        {item.options.map(opt => {
                          const isActive = item.key === 'theme'
                            ? mounted && (resolvedTheme ?? theme ?? 'dark') === opt.value
                            : prefs[item.key as keyof typeof prefs] === opt.value
                          return (
                            <button
                              key={opt.value}
                              onClick={() => item.key === 'theme' ? setTheme(opt.value) : set(item.key, opt.value)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                                isActive
                                  ? 'bg-accent text-dark-bg border-accent font-semibold'
                                  : 'border-custom text-sub hover:text-accent hover:border-accent'
                              }`}
                            >
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {item.type === 'select' && (
                      <select
                        value={prefs[item.key as keyof typeof prefs] as string}
                        onChange={e => set(item.key, e.target.value)}
                        className="bg-card border border-custom rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-accent shrink-0"
                      >
                        {item.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-custom flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={savePrefs}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-dark-bg transition-colors hover:bg-accent-light"
          >
            {tr.settings.save}
          </button>
          <div className="flex items-center gap-3 text-xs text-sub font-mono">
            {saved && <span className="text-accent">{tr.settings.saved}</span>}
            <button
              type="button"
              onClick={resetPrefs}
              className="hover:text-wrong transition-colors"
            >
              {tr.settings.resetAll}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
