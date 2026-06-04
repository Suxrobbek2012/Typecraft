import type { Metadata } from 'next'
import { PricingPage } from '@/components/PricingPage'

export const metadata: Metadata = {
  title: 'Pricing Plans — TypeCraft',
  description: 'Unlock premium custom themes, advanced stats, full keyboard layouts, and priority support response time.',
  robots: { index: true, follow: true },
}

export default function Pricing() {
  return <PricingPage />
}
