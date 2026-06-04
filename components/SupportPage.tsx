'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLocale } from '@/components/layout/LocaleProvider'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Send, AlertCircle, CheckCircle2, Lock } from 'lucide-react'

export function SupportPage() {
  const { t: tr } = useLocale()
  
  const [user, setUser] = useState<{ id: string; email: string; username: string; role: string } | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth?action=me')
      .then((r) => {
        if (!r.ok) return null
        return r.json()
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingUser(false)
      })
  }, [])

  // Word counter logic based on regex space splitting (matches backend: split(/\s+/))
  const words = message.trim() ? message.trim().split(/\s+/) : []
  const wordCount = words.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Subject and message are required')
      return
    }
    if (wordCount > 100) {
      toast.error('Message exceeds 100 words')
      return
    }

    setSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      })

      const data = await res.json()
      if (res.ok) {
        // Show exact text "Xabaringiz yuborildi" in success state on the page and toast
        const successText = 'Xabaringiz yuborildi'
        setStatusMessage({ type: 'success', text: successText })
        toast.success(successText)
        setSubject('')
        setMessage('')
      } else {
        // Show exact error message returned from backend
        const errorText = data.error || 'Xatolik yuz berdi'
        setStatusMessage({ type: 'error', text: errorText })
        toast.error(errorText)
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Tarmoq xatosi' })
      toast.error('Tarmoq xatosi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-white">
      <Navbar />
      <main className="flex-1 max-w-xl mx-auto px-4 py-16 w-full flex flex-col justify-center">
        {loadingUser ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sub font-mono text-sm">{tr.auth.loading}</p>
          </div>
        ) : !user ? (
          <div className="bg-card border border-custom rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
            <Lock className="mx-auto text-sub mb-4" size={40} />
            <h2 className="text-2xl font-bold font-display mb-3">{tr.support.title}</h2>
            <p className="text-sub text-sm mb-6">{tr.support.loginRequired}</p>
            <Link
              href="/auth/login"
              id="login-redirect-btn"
              className="inline-block bg-accent hover:bg-accent-light text-dark-bg font-bold font-mono px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-accent/20"
            >
              {tr.nav.login}
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-custom rounded-2xl p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6">
              <h1 className="text-3xl font-bold font-display text-white mb-2">{tr.support.title}</h1>
              <p className="text-sub text-sm">{tr.support.subtitle}</p>
            </div>

            {statusMessage && (
              <div
                id="status-message"
                className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                  statusMessage.type === 'success'
                    ? 'bg-correct/10 border-correct/30 text-correct'
                    : 'bg-wrong/10 border-wrong/30 text-wrong'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                ) : (
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                )}
                <div>
                  <p className="text-sm font-medium">{statusMessage.text}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" id="support-form">
              <div>
                <label htmlFor="subject-input" className="block text-xs font-mono uppercase tracking-wider text-sub mb-2">
                  {tr.support.subject}
                </label>
                <input
                  type="text"
                  id="subject-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={tr.support.subjectPh}
                  disabled={submitting}
                  className="w-full bg-black/40 border border-custom focus:border-accent rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="message-input" className="block text-xs font-mono uppercase tracking-wider text-sub">
                    {tr.support.message}
                  </label>
                  <span
                    id="word-counter"
                    className={`text-xs font-mono ${wordCount > 100 ? 'text-wrong font-bold' : 'text-sub'}`}
                  >
                    {wordCount}/100 {tr.support.wordCount}
                  </span>
                </div>
                <textarea
                  id="message-input"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={tr.support.messagePh}
                  disabled={submitting}
                  className="w-full bg-black/40 border border-custom focus:border-accent rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                id="submit-ticket-btn"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-accent text-dark-bg font-bold font-mono hover:bg-accent-light transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-accent/20"
              >
                <Send size={16} />
                {submitting ? tr.support.submitting : tr.support.submit}
              </button>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
