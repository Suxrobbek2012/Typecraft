'use client'

import { useState } from 'react'
import { Check, Shield, Crown, Star, ArrowRight, Zap, HelpCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLocale } from '@/components/layout/LocaleProvider'
import Link from 'next/link'

type Currency = 'UZS' | 'USD'

export function PricingPage() {
  const { t: tr } = useLocale()
  const [currency, setCurrency] = useState<Currency>('UZS')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { UZS: '0 UZS', USD: '$0' },
      period: '',
      description: tr.donate.freeTier || 'Basic typing tests and standard features',
      icon: Shield,
      color: 'from-gray-500/10 to-gray-600/5',
      border: 'border-white/10 hover:border-white/20',
      accent: 'text-sub',
      buttonText: 'Current Plan',
      href: '/',
      features: [
        '15s & 30s typing tests',
        '3 core languages (EN, UZ, RU)',
        'Basic performance statistics',
        '7-day support response rate limit',
      ],
      popular: false,
    },
    {
      id: 'basic',
      name: tr.donate.basic || 'Basic PRO',
      price: { UZS: '5 000 UZS', USD: '$0.39' },
      period: tr.donate.perMonth || '/mo',
      description: 'Unlock full practice modes and extended testing times',
      icon: Crown,
      color: 'from-yellow-500/20 to-yellow-600/10',
      border: 'border-yellow-500/30 hover:border-yellow-500/50',
      accent: 'text-yellow-400',
      buttonText: 'Upgrade to Basic',
      href: '/donate?plan=basic',
      features: [
        '60s & 120s extended tests',
        'All 10+ languages unlocked',
        'Distinct PRO profile badge',
        'Leaderboard entry priority',
        '3-day support response rate limit',
      ],
      popular: false,
    },
    {
      id: 'ultra',
      name: tr.donate.ultra || 'Ultra PRO',
      price: { UZS: '11 000 UZS', USD: '$0.89' },
      period: tr.donate.perMonth || '/mo',
      description: 'Ultimate immersive typing experience with visual effects',
      icon: Star,
      color: 'from-purple-500/25 to-pink-600/15',
      border: 'border-purple-500/40 hover:border-purple-500/70 shadow-lg shadow-purple-500/10',
      accent: 'text-purple-400',
      buttonText: 'Upgrade to Ultra',
      href: '/donate?plan=ultra',
      features: [
        'Everything in Basic PRO',
        'Premium gold, neon, aurora, matrix themes',
        'Key press sound effects & combo sounds',
        'Combo bursts & CPM tracking',
        'Highest priority support queue (3-day rate limit)',
      ],
      popular: true,
    },
  ]

  const faqs = [
    {
      q: 'How is the PRO status activated?',
      a: 'After making a manual card transfer on the Donate page, submit the confirmation form. Our administrator will confirm the payment and activate your plan within 24 hours.',
    },
    {
      q: 'What is the support rate limit difference?',
      a: 'Free users can send one support message every 7 days. PRO and Ultra users have priority support access with a reduced rate limit of one message every 3 days.',
    },
    {
      q: 'Are these subscriptions recurring?',
      a: 'No, these are one-off manual payments. You can extend your subscription by making another donation whenever you want.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-white">
      <Navbar />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Level Up Your <span className="text-accent">Typing</span>
          </h1>
          <p className="text-sub text-lg mb-8">
            Choose the perfect plan to boost your speed, customize your workspace, and support open-source development.
          </p>

          {/* Currency Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-black/40 border border-custom">
            <button
              onClick={() => setCurrency('UZS')}
              id="currency-uzs-btn"
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === 'UZS'
                  ? 'bg-accent text-dark-bg'
                  : 'text-sub hover:text-white'
              }`}
            >
              UZS (so'm)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              id="currency-usd-btn"
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-accent text-dark-bg'
                  : 'text-sub hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                id={`plan-card-${plan.id}`}
                className={`relative flex flex-col bg-card border rounded-3xl p-8 transition-all duration-300 bg-gradient-to-b ${plan.color} ${plan.border}`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold font-mono tracking-wider uppercase shadow-md shadow-purple-500/25">
                    Most Popular
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl bg-black/30 border border-white/5 ${plan.accent}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                </div>

                <p className="text-sub text-sm mb-6 min-h-[40px]">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold font-mono tracking-tight">
                    {currency === 'UZS' ? plan.price.UZS : plan.price.USD}
                  </span>
                  {plan.period && <span className="text-sub text-sm">{plan.period}</span>}
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-sub">
                      <Check size={16} className="text-accent shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                {plan.id === 'free' ? (
                  <Link
                    href={plan.href}
                    id={`btn-plan-${plan.id}`}
                    className="w-full py-3.5 rounded-xl border border-custom hover:border-white/30 text-center text-sm font-bold font-mono transition-all hover:bg-white/5"
                  >
                    {plan.buttonText}
                  </Link>
                ) : (
                  <Link
                    href={plan.href}
                    id={`btn-plan-${plan.id}`}
                    className={`w-full py-3.5 rounded-xl text-center text-sm font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-lg ${
                      plan.id === 'ultra'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/10 hover:shadow-purple-500/25'
                        : 'bg-accent hover:bg-accent-light text-dark-bg shadow-accent/10 hover:shadow-accent/20'
                    }`}
                  >
                    {plan.buttonText}
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto border-t border-custom pt-16">
          <h2 className="font-display text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <HelpCircle className="text-accent" size={20} />
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-custom p-6 rounded-2xl">
                <h4 className="font-bold text-base mb-2 text-white">{faq.q}</h4>
                <p className="text-sub text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
